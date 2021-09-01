import { Link, LinkQuery, Perspective } from "@perspect3vism/ad4m";

export class Ad4mModel {
  static client;
  static defaultPerspective;
  static defaultExpressionLanguage;

  protected static hasManyAssociations: any = {};

  private expressionAddress;

  static async create(attrs: object) {
    const model = new this(); // instance of inheriting class
    await model.createExpression(attrs);
    return model;
  }

  private async createExpression(attrs: object) {
    if (attrs["type"]) throw new Error // TODO
    attrs["type"] = this.constructor.name

    this.expressionAddress = await Ad4mModel.client.expression.create(
      attrs,
      Ad4mModel.defaultExpressionLanguage.address
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

    await Ad4mModel.client.perspective.addLink(
      Ad4mModel.defaultPerspective.uuid,
      new Link({
        source: this.expressionAddress,
        predicate: "has",
        target: otherModel.expressionAddress,
      })
    );

    return otherModel;
  }

  static hasMany(otherModelName: string): void {
    if (!Ad4mModel.hasManyAssociations[this.name]) {
      Ad4mModel.hasManyAssociations[this.name] = new Set();
    }
    Ad4mModel.hasManyAssociations[this.name].add(otherModelName);
  }

  // // TODO
  // async find(queryParams = {}) {
  //   // TODO merge subject = self
  //   return await this.client.perspective.queryLinks(
  //     this.perspective.uuid,
  //     new LinkQuery(queryParams)
  //   );
  // }
}
