abstract class Ad4mModel {
  protected static hasManyAssociations: any = {}

  constructor(attrs: object) {
    console.log({'this.constructor.name': this.constructor.name});

    // TODO create model as expression in ad4m

    this.createHasManyAssociations();
  }

  private createHasManyAssociations() {
    log({'Ad4mModel.hasManyAssociations in createHasManyAssociations': (this.constructor as any).hasManyAssociations});
    const otherModelNames: Array<string> = Ad4mModel.hasManyAssociations[this.constructor.name];
    log({otherModelNames});
    for (const otherModelName in otherModelNames) {
      if ((this as any)[otherModelName]) {
        throw new Error(
          `Already exists: <instance>${this.constructor.name}[${otherModelName}]`
        );
      }
      log({otherModelName});
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
    if (!Ad4mModel.hasManyAssociations[this.name] ){
      Ad4mModel.hasManyAssociations[this.name] = new Set()
    }
    Ad4mModel.hasManyAssociations[this.name].add(otherModelName)
    console.log({'Ad4mModel.hasManyAssociations in .hasMany': Ad4mModel.hasManyAssociations})
  }
}
