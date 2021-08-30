import path from "path";
import { Ad4mClient, Link, LinkQuery, Perspective } from "@perspect3vism/ad4m";
import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import ws from "ws";

const uri = "http://localhost:4000/graphql";
const apolloClient = new ApolloClient({
  link: new WebSocketLink({
    uri,
    options: { reconnect: true },
    webSocketImpl: ws,
  }),
  cache: new InMemoryCache({ resultCaching: false, addTypename: false }),
  defaultOptions: {
    watchQuery: { fetchPolicy: "no-cache" },
    query: { fetchPolicy: "no-cache" },
  },
});

const ad4mClient = new Ad4mClient(apolloClient);

(async function xxx() {
  let isInitialized, isUnlocked, did, result;

  result = await ad4mClient.agent.status();
  isInitialized = result.isInitialized;
  isUnlocked = result.isUnlocked;
  did = result.did;
  log({ isInitialized, isUnlocked, did });

  if (!isInitialized) {
    result = await ad4mClient.agent.generate("passphrase");
    did = result.did;
    log({ did });
  }
  if (!isUnlocked) {
    result = await ad4mClient.agent.unlock("passphrase");
    isUnlocked = result.isUnlocked;
    did = result.did;
    log({ isUnlocked, did });
  }

  const languages = await ad4mClient.languages.all();
  // log({ languages });

  const language = languages.find(
    (l) => l.name === "note-ipfs"
    // (l) => l.name === "social-context"
  )?.address;
  if (!language) throw new Error();
  log({ language });

  const funderMuskAddress = await ad4mClient.expression.create(
    "Musk Foundation",
    language

  );
  log({ funderMuskAddress });

  let treeOfLifePerspective;
  treeOfLifePerspective = await ad4mClient.perspective.add(
    "Tree of Life"
  );
  log({treeOfLifePerspective})

  const fundingEventMuskAddress = await ad4mClient.expression.create(
    "FundingEvent:Musk2022",
    language
  );
  log({ fundingEventMuskAddress });

  await ad4mClient.perspective.addLink(
    treeOfLifePerspective.uuid,
    new Link({
      source: funderMuskAddress,
      predicate: 'has funding event',
      target: fundingEventMuskAddress,
    })
  );

  let links;
  links = await ad4mClient.perspective.queryLinks(
    treeOfLifePerspective.uuid,
    new LinkQuery({})
  );
  log({ links });

})();

function log(arg: object|string) {
  console.log(JSON.stringify(arg, null, 4));
}
