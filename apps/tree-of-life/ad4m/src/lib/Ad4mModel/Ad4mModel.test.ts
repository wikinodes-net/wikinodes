import { Ad4mModel } from "./Ad4mModel";

describe("Ad4mModel", () => {
  describe('with "has many" association', () => {
    it("xxx", () => {
      class Funder extends Ad4mModel {}
      Funder.register();
      Funder.hasMany("FundingEvent");
      // expect(Ad4mModel.hasManyAssociations).toHaveProperty(
      //   "Funder",
      //   new Set(["FundingEvent"])
      // );

      class FundingEvent extends Ad4mModel {}
      FundingEvent.register();

      const musk: any = new Funder({});
      expect(musk.FundingEvent).toBeTruthy();
      musk.FundingEvent.create({ name: "Musk Foundation 2022" });
    });
  });
});
