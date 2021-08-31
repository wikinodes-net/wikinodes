import { Ad4mAssociationHasMany } from "./Ad4mAssociationHasMany";
import { Ad4m } from "./Ad4m";

// interface Ad4mModelClass
export class Ad4mModel {
  protected static hasManyAssociations: any = {};

  private expression;

  // constructor() {}

  static async create(attrs: object) {
    const model = new Ad4mModel()
    await model.createExpression(attrs);
    // this.createHasManyAssociations();
    return model
  }

  private async createExpression(attrs: object) {
    this.expression = await Ad4m.client.expression.create(
      JSON.stringify(attrs),
      Ad4m.expressionLanguage
    );
  }

   async create(otherModelClass: any, otherModelAttrs: object) {
    if (!(otherModelClass.name in Ad4mModel.hasManyAssociations[this.constructor.name])){
      throw new Error("xxxxx")
    }
    // create new model
    // create association between them
  }

  // private static createHasManyAssociations() {
  //   // console.log({'Ad4mModel.hasManyAssociations in createHasManyAssociations': (this.constructor as any).hasManyAssociations});
  //   const otherModelNames: Array<string> =
  //     Ad4mModel.hasManyAssociations[this.constructor.name];
  //   // console.log({otherModelNames});
  //   for (const otherModelName of otherModelNames) {
  //     // console.log({otherModelName});
  //     if ((this as any)[otherModelName]) {
  //       throw new Error(
  //         `Already exists: <instance>${this.constructor.name}[${otherModelName}]`
  //       );
  //     }
  //     (this as any)[otherModelName] = new Ad4mAssociationHasMany(
  //       this.constructor.name,
  //       otherModelName
  //     );
  //   }
  // }

  // TODO move into constructor
  static register() {
    Ad4m.set(this.name, this);
  }

  static hasMany(otherModelName: string): void {
    if (!Ad4mModel.hasManyAssociations[this.name]) {
      Ad4mModel.hasManyAssociations[this.name] = new Set();
    }
    Ad4mModel.hasManyAssociations[this.name].add(otherModelName);
  }
}
