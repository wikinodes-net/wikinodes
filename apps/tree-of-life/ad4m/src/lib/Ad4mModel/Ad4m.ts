import { Ad4mClient, Link, LinkQuery, Perspective } from "@perspect3vism/ad4m";
import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import ws from "ws";

export class Ad4m {
  static client;
  static expressionLanguageAddress;
  static languages: object;
  static perspective;

  static async init({ perspectiveName }): Promise<void> {
    Ad4m.initClient();
    await Ad4m.loginOrCreateDid();
    await Ad4m.setLanguages();
    await Ad4m.setPerspective(perspectiveName);
  }

  private static initClient() {
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

    this.client = new Ad4mClient(apolloClient);
  }

  private static async loginOrCreateDid() {
    let isInitialized, isUnlocked, did, result;

    result = await this.client.agent.status();
    isInitialized = result.isInitialized;
    isUnlocked = result.isUnlocked;
    did = result.did;
    log({ isInitialized, isUnlocked, did });

    if (!isInitialized) {
      result = await this.client.agent.generate("passphrase");
      did = result.did;
      log({ did });
    }
    if (!isUnlocked) {
      result = await this.client.agent.unlock("passphrase");
      isUnlocked = result.isUnlocked;
      did = result.did;
      log({ isUnlocked, did });
    }
  }

  private static async setLanguages() {
    const languages = await this.client.languages.all();
    this.languages = {};
    for (const language of languages) {
      this.languages[language.name] = language;
    }
  }

  private static async setPerspective(perspectiveName: any) {
    this.perspective = await this.client.perspective.add(perspectiveName);
  }

  static async addLink({ source, predicate, target }) {
    await this.client.perspective.addLink(
      this.perspective.uuid,
      new Link({ source, predicate, target })
    );
  }

  static async queryLinks(queryParams = {}) {
    return await this.client.perspective.queryLinks(
      this.perspective.uuid,
      new LinkQuery(queryParams)
    );
  }
}

function log(arg: object | string) {
  // console.log(JSON.stringify(arg, null, 4));
}
