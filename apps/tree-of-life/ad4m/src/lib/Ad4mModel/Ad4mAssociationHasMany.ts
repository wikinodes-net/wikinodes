class Ad4mAssociationHasMany {
  constructor(private thisModelName: string, private otherModelName: string) {}

  create(attrs: object) {
    const thisModel = Ad4mModelRegistry.get(this.thisModelName);
    const otherModel = Ad4mModelRegistry.get(this.otherModelName);
    // TODO create association in ad4m
  }
}
