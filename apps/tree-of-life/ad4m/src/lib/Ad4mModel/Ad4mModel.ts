import { Ad4mAssociationHasMany } from "./Ad4mAssociationHasMany";
import { Ad4mRegistry } from "./Ad4mRegistry";
export abstract class Ad4mModel {
  protected static hasManyAssociations: any = {}

  constructor(attrs: object) {
    // TODO create model as expression in ad4m
    this.createHasManyAssociations();
  }

  private createHasManyAssociations() {
    // console.log({'Ad4mModel.hasManyAssociations in createHasManyAssociations': (this.constructor as any).hasManyAssociations});
    const otherModelNames: Array<string> = Ad4mModel.hasManyAssociations[this.constructor.name];
    // console.log({otherModelNames});
    for (const otherModelName of otherModelNames) {
      // console.log({otherModelName});
      if ((this as any)[otherModelName]) {
        throw new Error(
          `Already exists: <instance>${this.constructor.name}[${otherModelName}]`
        );
      }
      (this as any)[otherModelName] = new Ad4mAssociationHasMany(
        this.constructor.name,
        otherModelName
      );
    }
  }

  // TODO move into constructor
  static register() {
    Ad4mRegistry.set(this.name, this);
  }

  static hasMany(otherModelName: string): void {
    if (!Ad4mModel.hasManyAssociations[this.name] ){
      Ad4mModel.hasManyAssociations[this.name] = new Set()
    }
    Ad4mModel.hasManyAssociations[this.name].add(otherModelName)
  }
}
