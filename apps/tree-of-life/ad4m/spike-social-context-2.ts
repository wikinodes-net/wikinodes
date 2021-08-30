import path from "path";
import {
  Ad4mClient,
  Link,
  LinkExpression,
  LinkQuery,
  ExpressionProof,
  Perspective,
} from "@perspect3vism/ad4m";
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

(async function main() {
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
  console.log({ languages });

  const socialContextLanguage = languages.find(
    (l) => l.name === "social-context"
    // (l) => l.address === 'QmRfneighvZs6wc1fat2wNu2qVHddZDE7fcTRcVnsKa2ra'
  );
  if (!socialContextLanguage) throw new Error();
  log({ socialContextLanguage });

  // const perspective = await ad4mClient.perspective.add("My new space");
  // await ad4mClient.perspective.addLink(
  //   perspective.uuid,
  //   new Link({
  //     source: "root",
  //     target: exprAddress,
  //   })
  // );

  const create = await ad4mClient!.perspective.add("publish-test");

  let link = new LinkExpression();
  link.author = "did:test";
  link.timestamp = new Date().toISOString();
  link.data = new Link({ source: "src", target: "target", predicate: "pred" });
  link.proof = new ExpressionProof("sig", "key");
  const publishPerspective =
    await ad4mClient.neighbourhood.publishFromPerspective(
      create.uuid,
      socialContextLanguage.address,
      new Perspective([link])
    );

  // // crashing:
  // const createNeighbourhood =
  //   await ad4mClient.neighbourhood.publishFromPerspective(
  //     perspective.uuid,
  //     socialContextLanguage.address,
  //     new Perspective()
  //   );

  // crashing:
  // const funderMuskAddress = await ad4mClient.expression.create(
  //   "Musk Foundation",
  //   socialContextLanguage.address
  // );
  // log({ funderMuskAddress });

  // const fundingEventMuskAddress = await ad4mClient.expression.create(
  //   "FundingEvent:Musk2022",
  //   socialContextLanguage.address
  // );
  // log({ fundingEventMuskAddress });

  // const addLink = await ad4mClient.perspective.addLink(perspective.uuid, {
  //   source: funderMuskAddress,
  //   predicate: "has funding event",
  //   target: fundingEventMuskAddress,
  // });

  // const getLinks = await ad4mClient.perspective.queryLinks(
  //   perspective.uuid,
  //   new LinkQuery({})
  // );

  //end of main
})();

function log(arg: object | string) {
  console.log(JSON.stringify(arg, null, 4));
}
