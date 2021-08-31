import { Ad4m } from "./Ad4m";
export class Ad4mAssociationHasMany {
  constructor(private thisModelName: string, private otherModelName: string) {}

  create(attrs: object) {
    const thisModel = Ad4m.get(this.thisModelName);
    const otherModel = Ad4m.get(this.otherModelName);
    // TODO create association in ad4m
  }
}
