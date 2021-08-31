import { Ad4mRegistry } from "./Ad4mRegistry";
export class Ad4mAssociationHasMany {
  constructor(private thisModelName: string, private otherModelName: string) {}

  create(attrs: object) {
    const thisModel = Ad4mRegistry.get(this.thisModelName);
    const otherModel = Ad4mRegistry.get(this.otherModelName);
    // TODO create association in ad4m
  }
}
