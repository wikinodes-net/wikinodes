import { Ad4mClient, Link, LinkQuery, Perspective } from "@perspect3vism/ad4m";
import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import ws from "ws";

import { Ad4mModel } from "./Ad4mModel";
import { Ad4mRegistry } from "./Ad4mRegistry";

describe("Ad4mModel", () => {
  describe('with "has many" association', () => {
    let ad4mClient;
    let language;

    beforeAll(async () => {
      ad4mClient = await initAd4m();
      Ad4mRegistry.expressionLanguage = await noteIpfsLanguage(ad4mClient);
    });
    it("xxx", () => {
      class Funder extends Ad4mModel {}
      Funder.register();
      Funder.hasMany("FundingEvent");

      class FundingEvent extends Ad4mModel {}
      FundingEvent.register();

      const musk: any = new Funder({});
      expect(musk.FundingEvent).toBeTruthy();
      musk.FundingEvent.create({ name: "Musk Foundation 2022" });
    });
  });
});

async function initAd4m() {
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

  return ad4mClient;
}

async function noteIpfsLanguage(ad4mClient) {
  const languages = await ad4mClient.languages.all();

  const language = languages.find((l) => l.name === "note-ipfs")?.address;
  if (!language) throw new Error();
  return language;
}

function log(arg: object | string) {
  console.log(JSON.stringify(arg, null, 4));
}
