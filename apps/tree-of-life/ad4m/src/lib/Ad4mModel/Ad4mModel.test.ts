import { Ad4mModel } from "./Ad4mModel";
import { Ad4m } from "./Ad4m";

describe("Ad4mModel", () => {
  describe('with "has many" association', () => {
    beforeAll(async () => {
      await Ad4m.init({
        perspectiveName: "Tree of Life",
        defaultExpressionLanguage: "note-ipfs"
       });
      Ad4mModel.client = Ad4m.client
      Ad4mModel.defaultPerspective = Ad4m.perspective
      Ad4mModel.defaultExpressionLanguage = Ad4m.defaultExpressionLanguage
    });

    it("scratchpad", async () => {
      class Funder extends Ad4mModel {}
      Funder.hasMany("FundingEvent");
      class FundingEvent extends Ad4mModel {}

      const musk: any = await Funder.create({ name: "Musk" });
      const muskExpression = await Ad4m.client.expression.get(
        musk.expressionAddress
      );
      expect(muskExpression.data).toBe(JSON.stringify({ name: "Musk" }));

      const fundingEvent = await musk.create(FundingEvent, {
        name: "Musk Foundation 2022",
        totalBudget: 22_000_000,
      });
      const fundingEventExpression = await Ad4m.client.expression.get(
        fundingEvent.expressionAddress
      );
      expect(fundingEventExpression.data).toBe(
        JSON.stringify({
          name: "Musk Foundation 2022",
          totalBudget: 22_000_000,
        })
      );

      const links = await Ad4m.queryLinks();

      expect(links).toHaveLength(1);
      expect(links[0]["data"]).toMatchObject({
        source: musk.expressionAddress,
        predicate: "has",
        target: fundingEvent.expressionAddress,
      });
    });
  });
});
