import { Ad4m } from "./Ad4m";

export class Ad4mModel {
  protected static hasManyAssociations: any = {};

  private expressionAddress;

  static async create(attrs: object) {
    const model = new this(); // instance of inheriting class
    await model.createExpression(attrs);
    return model;
  }

  private async createExpression(attrs: object) {
    this.expressionAddress = await Ad4m.client.expression.create(
      attrs,
      Ad4m.expressionLanguageAddress
    );
  }

  async create(otherModelClass: any, otherModelAttrs: object) {
    if (!Ad4mModel.hasManyAssociations[this.constructor.name]) {
      throw new Error(
        `Missing association: ${this.constructor.name} hasMany ${otherModelClass.name}`
      );
    }
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
  }

  static hasMany(otherModelName: string): void {
    if (!Ad4mModel.hasManyAssociations[this.name]) {
      Ad4mModel.hasManyAssociations[this.name] = new Set();
    }
    Ad4mModel.hasManyAssociations[this.name].add(otherModelName);
  }
}
