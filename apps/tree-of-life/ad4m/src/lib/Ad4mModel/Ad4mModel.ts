import { Link, LinkQuery, PerspectiveHandle } from "@perspect3vism/ad4m";

const PREDICATE_HAS_INSTANCE = "HAS_INSTANCE";

const TYPE_MODEL_CLASS = "MODEL_CLASS";
const TYPE_MODEL_INSTANCE = "MODEL_INSTANCE";
export class Ad4mModel {
  static client;
  private client;
  static defaultPerspective;
  static defaultExpressionLanguage;

  protected static hasManyAssociations: any = {};

  private static classExpressionAddress: string;
  expressionAddress: string;

  protected constructor() {
    // TODO assert client present

    this.client = Ad4mModel.client;
  }

  static async create(attrs: object) {
    const model = new this(); // instance of inheriting class
    await model.createExpression(attrs);
    // model.expressionAddress = await this.client.expression.create(
    //   attrs,
    //   Ad4mModel.defaultExpressionLanguage.address
    // );

    // await model.linkModelToInstance();
    return model;
  }

  protected async createExpression(attrs: object) {
    const modelClass: any = this.constructor;
    this.expressionAddress = await Ad4mModel.createExpression(
      // type: TYPE_MODEL_INSTANCE,
      attrs
    );

    // this.expressionAddress = await this.client.expression.create(
    //   attrs,
    //   Ad4mModel.defaultExpressionLanguage.address
    // );
  }

  // protected static async createExpression(type: string, attrs: object = {}) {
  protected static async createExpression(attrs: object = {}): Promise<string> {
    // if (attrs["type"])
    //   throw new Error("Expression attrs cannot contain reserved key 'type'");
    // attrs["type"] = this.constructor.name;
    const expressionAddress = await this.client.expression.create(
      attrs,
      Ad4mModel.defaultExpressionLanguage.address
    );

    return expressionAddress;
  }

  private async linkModelToInstance() {
    const modelClass: any = this.constructor;

    await this.client.perspective.addLink(
      Ad4mModel.defaultPerspective.uuid,
      new Link({
        source: await modelClass.getClassExpression(),
        predicate: PREDICATE_HAS_INSTANCE,
        target: this.expressionAddress,
      })
    );
  }

  // Get the expression for the model *class*
  protected static async getClassExpression() {
    if (this.classExpressionAddress) return this.classExpressionAddress;

    const modelClassName = this.name;
    this.classExpressionAddress = await this.createExpression({
      type: TYPE_MODEL_CLASS,
      className: modelClassName,
    });
    return this.classExpressionAddress;
  }

  protected async create(otherModelClass: any, otherModelAttrs: object) {
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

    await this.client.perspective.addLink(
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

  async find(
    model: Ad4mModel,
    options: { queryParams?: object; perspective?: PerspectiveHandle } = {}
  ) {
    const queryParams = options.queryParams ? options.queryParams : {};
    const perspective: PerspectiveHandle = options.perspective
      ? options.perspective
      : Ad4mModel.defaultPerspective;
    // TODO assert perspective
    // TODO merge subject = self
    // TODO limit target to model
    return await this.client.perspective.queryLinks(
      perspective.uuid,
      new LinkQuery(queryParams)
    );
  }

  static async find(address) {
    return await this.client.expression.get(address);
  }

  static async all(options: { perspective?: PerspectiveHandle } = {}) {
    const perspective: PerspectiveHandle = options.perspective
      ? options.perspective
      : Ad4mModel.defaultPerspective;
    // TODO assert perspective

    const links = await this.client.perspective.queryLinks(
      perspective.uuid,
      new LinkQuery({
        source: this.constructor.name,
        predicate: PREDICATE_HAS_INSTANCE,
      })
    );

    return links;
  }
}
