import { Ad4mModel } from "./Ad4mModel";
import { Ad4m } from "./Ad4m";

describe("Ad4mModel", () => {
  let client;

  beforeAll(async () => {
    await Ad4m.init({
      perspectiveName: "Tree of Life",
      defaultExpressionLanguage: "note-ipfs",
    });
    client = Ad4mModel.client = Ad4m.client;
    Ad4mModel.defaultPerspective = Ad4m.perspective;
    Ad4mModel.defaultExpressionLanguage = Ad4m.defaultExpressionLanguage;
  });

  describe(".create", () => {
    it("creates the expected expression", async () => {
      class Cat extends Ad4mModel {}
      const cat = await Cat.create({ fur: "long" });

      expect(cat.expressionAddress).toBeTruthy();

      const catExpression = await client.expression.get(cat.expressionAddress);

      expect(JSON.parse(catExpression.data)).toMatchObject({ fur: "long" });
    });
  });

  describe(".find(...)", () => {
    it("finds by address", async () => {
      class Cat extends Ad4mModel {}
      const attrs = { type: "Cat", fur: "grey", eyes: "blue" };

      const address = await client.expression.create(
        attrs,
        Ad4m.defaultExpressionLanguage.address
      );

      const cat = await Cat.find(address);
      expect(JSON.parse(cat.data)).toMatchObject(attrs);
    });
  });

  // describe(".all(...)", () => {
  //   it("finds all instances of a model", async () => {
  //     class Dog extends Ad4mModel {}
  //     class Cat extends Ad4mModel {}

  //     const dog1 = await Dog.create({});
  //     const dog2 = await Dog.create({});
  //     const cat1 = await Cat.create({});
  //     const cat2 = await Cat.create({});

  //     const dogs: Array<Ad4mModel> = await Dog.all();
  //     const cats: Array<Ad4mModel> = await Cat.all();

  //     expect(dogs).toBe([dog1, dog2]);
  //     expect(cats).toBe([cat1, cat2]);
  //   });
  // });

  // describe('with "has many" association', () => {
  //   it("scratchpad", async () => {
  //     class Funder extends Ad4mModel {}
  //     Funder.hasMany("FundingEvent");
  //     class FundingEvent extends Ad4mModel {}

  //     const musk: any = await Funder.create({ name: "Musk" });
  //     const muskExpression = await client.expression.get(
  //       musk.expressionAddress
  //     );
  //     expect(muskExpression.data).toBe(JSON.stringify({ name: "Musk" }));

  //     const fundingEvent = await musk.create(FundingEvent, {
  //       name: "Musk Foundation 2022",
  //       totalBudget: 22_000_000,
  //     });
  //     const fundingEventExpression = await client.expression.get(
  //       fundingEvent.expressionAddress
  //     );
  //     expect(fundingEventExpression.data).toBe(
  //       JSON.stringify({
  //         name: "Musk Foundation 2022",
  //         totalBudget: 22_000_000,
  //       })
  //     );

  //     const links = await musk.find(FundingEvent);

  //     expect(links).toHaveLength(1);
  //     expect(links[0]["data"]).toMatchObject({
  //       source: musk.expressionAddress,
  //       predicate: "has",
  //       target: fundingEvent.expressionAddress,
  //     });
  //   });
  // });
});
