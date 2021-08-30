import path from "path";
import { Ad4mClient, Link, LinkQuery, Perspective } from "@perspect3vism/ad4m";
import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import ws from "ws";

// class Foo {
//   static hasManyAssociations = new Set();

//   constructor(attrs: object) {
//     console.log(this.constructor.name);
//     console.log(this.constructor);
//     console.log(Foo.hasManyAssociations)
//     console.log(Bar.hasManyAssociations)
//     console.log((this.constructor as any).hasManyAssociations)
//   }
// }

// class Bar extends Foo {}

// const bar = new Bar({});

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

main();

async function main() {
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

  let treeOfLifePerspective;
  treeOfLifePerspective = await ad4mClient.perspective.add("Tree of Life");
  log({ treeOfLifePerspective });

  // languages, eg:
  // TreeOfLife.v7.Funder
  // relationships - use as predicates
  // has many through - rich predicates?

  class Funder extends Ad4mModel {
    // static name: string
  }
  Funder.register();
  Funder.hasMany("FundingEvent");

  class FundingEvent extends Ad4mModel {}

  // Generic sketch:
  // type FundingEventFields =
  // { fields:
  //      name: string
  //   associations:
  //      hasMany:
  // }
  // class FundingEvent extends Ad4mModel<FundingEventFields> {}

  const musk: any = new Funder({});
  // maybe use generics?
  // const musk: any = new Ad4mModel<Funder>({});
  musk.FundingEvent.create({ name: "Musk Foundation 2022" });

  // end of main
}

// user code above, lib code below

abstract class Ad4mModel {
  static hasManyAssociations = new Set();

  constructor(attrs: object) {
    console.log({'this.constructor.name': this.constructor.name});

    // TODO create model as expression in ad4m

    this.createHasManyAssociations();
  }

  private createHasManyAssociations() {
    log((this.constructor as any).hasManyAssociations);
    log((this.constructor as any).hasManyAssociations);
    const otherModelNames: Array<string> = (this.constructor as any).hasManyAssociations;
    for (const otherModelName in otherModelNames) {
      if ((this as any)[otherModelName]) {
        throw new Error(
          `Already exists: <instance>${this.constructor.name}[${otherModelName}]`
        );
      }
      // log({otherModelName});
      (this as any)[otherModelName] = new Ad4mAssociationHasMany(
        this.constructor.name,
        otherModelName
      );
    }
  }

  // TODO move into constructor
  static register() {
    Ad4mModelRegistry.set(this.name, this);
  }

  static hasMany(otherModelName: string): void {
    (this as any).hasManyAssociations.add(otherModelName);
    console.log((this as any).hasManyAssociations);
  }
}

class Ad4mModelRegistry {
  static map: any = {};
  static set(modelName: string, model: object): void {
    this.map[modelName] = model;
  }
  static get(
    modelName: string //: Ad4mModel
  ) {
    return this.map[modelName];
  }
}

class Ad4mAssociationHasMany {
  constructor(private thisModelName: string, private otherModelName: string) {}

  create(attrs: object) {
    const thisModel = Ad4mModelRegistry.get(this.thisModelName);
    const otherModel = Ad4mModelRegistry.get(this.otherModelName);
    // TODO create association in ad4m
  }
}

function log(arg: object | string) {
  console.log(JSON.stringify(arg, null, 4));
}
