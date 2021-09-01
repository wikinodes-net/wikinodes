import { Ad4mModel } from "./Ad4mModel";
import { Ad4m } from "./Ad4m";

describe("Ad4mModel", () => {
  describe('with "has many" association', () => {

    beforeAll(async () => {
      await Ad4m.init({perspectiveName: 'Tree of Life'})
      Ad4m.expressionLanguageAddress = Ad4m.languages['note-ipfs'].address
    });

    it("xxx", async () => {
      class Funder extends Ad4mModel {}
      // Funder.register();
      Funder.hasMany("FundingEvent");

      class FundingEvent extends Ad4mModel {}
      // FundingEvent.register();

      const musk: any = await Funder.create({});
      // expect(musk.FundingEvent).toBeTruthy();
      // musk.FundingEvent.create({ name: "Musk Foundation 2022" });
      // console.log({musk})
      const association = await musk.create(FundingEvent, { name: "Musk Foundation 2022" });
    });
  });
});
