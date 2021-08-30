abstract class Foo {
  protected static hasManyAssociations: any = {}

  constructor(attrs: object) {
    // console.log(this.name);
    // console.log(this.constructor);
    // console.log(Foo.hasManyAssociations)
    // console.log(Bar.hasManyAssociations)
    // console.log((this.constructor as any).hasManyAssociations)
  }

  static add(x: string){
    console.log(this.hasManyAssociations)
    console.log(this.name)
    // console.log(this.constructor)
    console.log(this.name)
    if (!this.hasManyAssociations[this.name] ){
      this.hasManyAssociations[this.name] = new Set()
    }
    this.hasManyAssociations[this.name].add(x)
    console.log(this.hasManyAssociations)
  }
}

class Bar extends Foo {}
class Baz extends Foo {}

// const bar1 = new Bar({});
// const bar2 = new Bar({});

Foo.add('Foo1')
Foo.add('Foo2')

Bar.add('bar1')
Bar.add('bar2')

// Baz.add('Baz1')
// Baz.add('Baz2')
