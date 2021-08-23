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
// console.log(ad4mClient);

async function xxx() {
  let isInitialized, isUnlocked, did, result;

  result = await ad4mClient.agent.status();
  isInitialized = result.isInitialized;
  isUnlocked = result.isUnlocked;
  did = result.did;
  console.log({ isInitialized, isUnlocked, did });

  if (!isInitialized) {
    result = await ad4mClient.agent.generate("passphrase");
    did = result.did;
    console.log({ did });
  }
  if (!isUnlocked) {
    result = await ad4mClient.agent.unlock("passphrase");
    isUnlocked = result.isUnlocked;
    did = result.did;
    console.log({ isUnlocked, did });
  }

  const languages = await ad4mClient.languages.all();
  const noteIpfsAddress = languages.find(
    (l) => l.name === "note-ipfs"
  )?.address;
  console.log(noteIpfsAddress);
  if (!noteIpfsAddress) throw new Error();

  const exprAddress = await ad4mClient.expression.create(
    "A new text note",
    noteIpfsAddress
  );
  console.log(exprAddress);

  const perspectiveHandle = await ad4mClient.perspective.add(
    "A new perspective on apps..."
  );
  await ad4mClient.perspective.addLink(
    perspectiveHandle.uuid,
    new Link({
      source: "root",
      target: exprAddress,
    })
  );
  const links = await ad4mClient.perspective.queryLinks(
    perspectiveHandle.uuid,
    new LinkQuery({})
  );
  console.log(links);

  const uniqueLinkLanguage = await ad4mClient.languages.cloneHolochainTemplate(
    path.join(__dirname, "../../../../ad4m-cli/src/builtin-langs/social-context"),
    "social-context",
    "b98e53a8-5800-47b6-adb9-86d55a74871e"
  );

  console.log("uniqueLinkLanguage:", uniqueLinkLanguage)
}

xxx();
