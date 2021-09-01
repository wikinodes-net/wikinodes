import { Ad4mModel } from "./Ad4mModel";
import { Ad4m } from "./Ad4m";

describe("Ad4mModel", () => {
  describe('with "has many" association', () => {
    beforeAll(async () => {
      await Ad4m.init({ perspectiveName: "Tree of Life" });
      Ad4m.expressionLanguageAddress = Ad4m.languages["note-ipfs"].address;
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
      });

      const links = await Ad4m.queryLinks();

      expect(links).toHaveLength(1);
      expect(links[0]["data"]).toMatchObject({
        source: expect.anything(),
        predicate: "has",
        target: expect.anything(),
      });
    });
  });
});

// +     "source": "Qmd6AZzLjfGWNAqWLGTGy354JC1bK26XNf7rTEEsJfv7Fe://QmQygoYTxUzAobKdPyQaVdKZwoKGH3TsJrFHRa46Ybmnra",
// +     "target": "Qmd6AZzLjfGWNAqWLGTGy354JC1bK26XNf7rTEEsJfv7Fe://QmUmRK4p6YKuQ8x7p2ABU43Gn5RbZ6PB6WPSNfMxmsvR96",
