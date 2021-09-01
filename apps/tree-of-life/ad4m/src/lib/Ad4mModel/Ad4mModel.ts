import { Ad4mAssociationHasMany } from "./Ad4mAssociationHasMany";
import { Ad4m } from "./Ad4m";

// interface Ad4mModelClass
export class Ad4mModel {
  protected static hasManyAssociations: any = {};

  private expressionAddress;

  // constructor() {}

  static async create(attrs: object) {
    const model = new this(); // instance of inheriting class
    await model.createExpression(attrs);
    // this.createHasManyAssociations();
    return model;
  }

  private async createExpression(attrs: object) {
    this.expressionAddress = await Ad4m.client.expression.create(
      JSON.stringify(attrs),
      Ad4m.expressionLanguageAddress
    );
  }

  async create(otherModelClass: any, otherModelAttrs: object) {
    // console.log(Ad4mModel.hasManyAssociations);
    // console.log(this.constructor.name);
    if (!Ad4mModel.hasManyAssociations[this.constructor.name]) {
      throw new Error(
        `Missing association: ${this.constructor.name} hasMany ${otherModelClass.name}`
      );
    }
    // console.log(otherModelClass.name);
    // console.log(Ad4mModel.hasManyAssociations[this.constructor.name]);
    if (
      !Ad4mModel.hasManyAssociations[this.constructor.name].has(
        otherModelClass.name
      )
    ) {
      throw new Error(
        `Missing association: ${this.constructor.name} hasMany ${otherModelClass.name}`
      );
    }

    const otherModel = await otherModelClass.create(otherModelAttrs);

    await Ad4m.addLink({
      source: this.expressionAddress,
      predicate: "has",
      target: otherModel.expressionAddress,
    });

    return otherModel;

    // create new model
    // create association between them
  }

  static hasMany(otherModelName: string): void {
    if (!Ad4mModel.hasManyAssociations[this.name]) {
      Ad4mModel.hasManyAssociations[this.name] = new Set();
    }
    Ad4mModel.hasManyAssociations[this.name].add(otherModelName);
  }
}
