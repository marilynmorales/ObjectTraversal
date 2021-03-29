const Traversal = require("../src/index");

const schema = [
  {
    "person": {
      "first_name": "Marilyn",
      "last_name": "Morales",
      "email": "hi@marilynmorales.com"
    }  
  },
  {
    "person": {
      "first_name": "Plato",
      "last_name": "Morales",
      "email": "bark@marilynmorales.com"
    }
  },
  {
    "people": [
      {
        "person": {
          "first_name": "Aaron",
          "email": null
        }
      },
      {
        "person": {
          "first_name": "Winny",
          "email": "hi@winosaurous.bark"
        }
      }
    ]
  } 
];
const load = new Traversal(schema);

test("It should load the data", () => {
  const load = new Traversal(schema);
  expect(schema).toMatchObject(load.origin);
});

describe("find()", () => {
  test("it should find the first key instance", () => {

    expect(schema[2]).toMatchObject(load.find("people").value());
    expect(schema[0].person).toMatchObject(load.find("first_name").value());
  });

  test("it should let chained find", () => {
    let found = load.find("people").find("first_name").value();
    expect(schema[2].people[0].person).toMatchObject(found);
    expect({}).not.toMatchObject(found);
  });

  test("it should return empty object if key does not exist", () => {
    let not_found = load.find("does_not_exist").value();
    expect({}).toMatchObject(not_found);
    expect(Object.keys(not_found)).toHaveLength(0);
  });
});

describe("findAll()", () => {
  test("it should return array of found items", () => {
    let found = load.findAll("first_name").value();
    let expecting = [
      schema[0].person,
      schema[1].person,
      schema[2].people[0].person,
      schema[2].people[1].person
    ];
    expect(expecting).toEqual(expect.arrayContaining(found));
    expect({}).not.toEqual(expect.arrayContaining(found));
  });

  test("it should return empty object if key does not exists", () => {
    let not_found = load.findAll("does_not_exist").value();
    expect(not_found).toHaveLength(0);
  })
});

describe("where()", () => {
  test("it should get items where key exists", () => {
    let found = load.where("last_name").value();
    let expecting = [
      schema[0].person,
      schema[1].person
    ];
    expect(expecting).toEqual(expect.arrayContaining(found))
    expect([]).not.toEqual(expect.arrayContaining(found))
  });

  test("it should get items where key and value exists", () => {
    let found = load.where("email", "bark@marilynmorales.com").value();
    let expecting = [
      schema[1].person
    ];
    expect(expecting).toEqual(expect.arrayContaining(found))
    expect([]).not.toEqual(expect.arrayContaining(found))
  });
});

describe("get()", () => {
  test("it should get values of keys", () => {
    let found = load.get("first_name").value();
    let expecting = ["Marilyn", "Plato", "Aaron", "Winny"];
    expect(expecting).toEqual(expect.arrayContaining(found));
    
    let found_2 = load.get("person").value();
    let expecting_2 = [
      schema[0].person,
      schema[1].person,
      schema[2].people[0].person,
      schema[2].people[1].person
    ];
    expect(expecting_2).toEqual(expect.arrayContaining(found_2))
  });
  test("it should return empty keys if not found", () => {
    let found = load.get("first_name_").value();

    expect(found).toHaveLength(0);
  });
});

describe("first()", () => {
  test("it should get the first key", () => {
    let found = load.first("people").value();
    let expected = schema[2].people;
    expect(expected).toEqual(expect.arrayContaining(found));
  });
  test("it should return empty object if key does not exists", () => {
    let found = load.first("does_not_exists").value();
    expect({}).toMatchObject(found);
    expect(found).not.toMatchObject({prop: "key"});
  })
});
