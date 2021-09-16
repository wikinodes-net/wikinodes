import { Ad4mClient, Link, LinkQuery, Perspective } from "@perspect3vism/ad4m";
import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import ws from "ws";

export class Ad4m {
  static client;
  static defaultExpressionLanguage;
  static languages: object;
  static perspective;

  static async init({
    perspectiveName,
    defaultExpressionLanguage,
  }): Promise<void> {
    this.initClient();
    await this.loginOrCreateDid();
    await this.setLanguages();
    await this.setPerspective(perspectiveName);
    this.defaultExpressionLanguage = this.languages[defaultExpressionLanguage];
    if (!this.defaultExpressionLanguage) {
      throw new Error(
        `defaultExpressionLanguage '${defaultExpressionLanguage}' not found in languages: ${this.languages}`
      );
    }
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
}

function log(arg: object | string) {
  // console.log(JSON.stringify(arg, null, 4));
}
