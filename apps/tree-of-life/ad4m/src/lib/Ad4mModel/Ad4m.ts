import { Ad4mClient, Link, LinkQuery, Perspective } from "@perspect3vism/ad4m";
import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import ws from "ws";

export class Ad4m {
  static client;
  // static expressionLanguage;
  static expressionLanguageAddress;
  static languages: object

  // static map: any = {};
  // static set(modelName: string, model: object): void {
  //   this.map[modelName] = model;
  // }
  // static get(
  //   modelName: string //: Ad4mModel
  // ) {
  //   return this.map[modelName];
  // }

  static async init(): Promise<void> {
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

    const languages = await this.client.languages.all();
    this.languages = {}
    for (const language of languages) {
      this.languages[language.name] = language
    }
  }

}

function log(arg: object | string) {
  // console.log(JSON.stringify(arg, null, 4));
}
