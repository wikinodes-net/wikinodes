export class Ad4mRegistry {
  static expressionLanguage

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
