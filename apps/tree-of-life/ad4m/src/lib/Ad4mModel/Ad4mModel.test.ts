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
      // console.log(address);
      const cat = await Cat.find(address);
      expect(JSON.parse(cat.data)).toMatchObject(attrs);
    });

    // it("returns null if none found", async () => {
    //   class Cat extends Ad4mModel {}
    //   const notReally = await Cat.find(
    //     "Qmd6AZzLjfGWNAqWLGTGy354JC1bK26XNf7rTEEsJfv7Fe://QmVrvDQSoU4PMpZfjbaHREY1DbBo54zJHuKUKJ18P9cccc"
    //   );
    //   expect(notReally).toBeNull();
    // });
  });

  describe(".all(...)", () => {
    it("finds all instances of a model", async () => {
      class Dog extends Ad4mModel {}
      class Cat extends Ad4mModel {}

      const dog1address = (await Dog.create({})).expressionAddress;
      const dog2address = (await Dog.create({})).expressionAddress;
      const cat1address = (await Cat.create({})).expressionAddress;
      const cat2address = (await Cat.create({})).expressionAddress;

      const dogs = (await Dog.all()).map((dog) => dog.expressionAddress);
      const cats = (await Cat.all()).map((cat) => cat.expressionAddress);

      expect(dogs).toEqual(expect.arrayContaining([dog1address, dog2address]));
      expect(cats).toEqual(expect.arrayContaining([cat1address, cat2address]));
    });
  });

  // describe(".getClassExpressionAddress()", () => {
  //   it("returns the same result when called multiple times for the same class", async () => {
  //     class Cat extends Ad4mModel {}
  //     const catClassExpressionAddress1 = await Cat.getClassExpressionAddress();
  //     const catClassExpressionAddress2 = await Cat.getClassExpressionAddress();
  //     expect(catClassExpressionAddress1).toEqual(catClassExpressionAddress2);
  //   });

  //   it("returns different addresses for different classes", async () => {
  //     class Cat extends Ad4mModel {}
  //     class Dog extends Ad4mModel {}
  //     const catClassExpressionAddress = await Cat.getClassExpressionAddress();
  //     const dogClassExpressionAddress = await Dog.getClassExpressionAddress();
  //     expect(catClassExpressionAddress).not.toEqual(dogClassExpressionAddress);
  //   });
  // });

  describe('with "has many" association', () => {
    it("scratchpad", async () => {
      class Funder extends Ad4mModel {}
      Funder.hasMany("FundingEvent");
      class FundingEvent extends Ad4mModel {}

      const musk: any = await Funder.create({ name: "Musk" });
      const muskExpression = await client.expression.get(
        musk.expressionAddress
      );
      expect(muskExpression.data).toBe(JSON.stringify({ name: "Musk" }));

      const fundingEvent = await musk.create(FundingEvent, {
        name: "Musk Foundation 2022",
        totalBudget: 22_000_000,
      });
      const fundingEventExpression = await client.expression.get(
        fundingEvent.expressionAddress
      );
      expect(fundingEventExpression.data).toBe(
        JSON.stringify({
          name: "Musk Foundation 2022",
          totalBudget: 22_000_000,
        })
      );

      const fundingEvents = await musk.find(FundingEvent);

      expect(fundingEvents).toHaveLength(1);
      expect(fundingEvents[0].expressionAddress).toEqual(
        fundingEvent.expressionAddress
      );
    });
  });
});
