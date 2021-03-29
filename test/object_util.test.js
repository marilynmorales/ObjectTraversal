const util = require("../src/object_util");
let prop = {};

beforeEach(() => {
  prop = {
    person: "Marilyn",
    people: [
      { person: "Plato" },
      { person: "Winny" }
    ],
    leader: {
      person: "Rafie",
      type: "dog",
      toys: [
        {
          type: "bone"
        },
        {
          type: "stuffed"
        }
      ]
    }
  }
});

test("isObject() - it should return true for objects only", () => {
  expect(util.isObject({})).toBe(true);
  expect(util.isObject({name: "Marilyn"})).toBe(true);
  expect(util.isObject(function(){})).toBe(false);
  expect(util.isObject([])).toBe(false);
  expect(util.isObject(["1", "2"])).toBe(false);
  expect(util.isObject("string")).toBe(false);
  expect(util.isObject(3)).toBe(false);
});

test("isArray() - it should return true for arrays only", () => {
  expect(util.isArray({})).toBe(false);
  expect(util.isArray({name: "Marilyn"})).toBe(false);
  expect(util.isArray(function(){})).toBe(false);
  expect(util.isArray([])).toBe(true);
  expect(util.isArray(["1", "2"])).toBe(true);
  expect(util.isArray("string")).toBe(false);
  expect(util.isArray(3)).toBe(false);
});

test("keyInProp() - it should find key in prop", () => {
  expect(util.keyInProp("people", prop)).toBe(true);
  expect(util.keyInProp("person", prop, "not correct")).toBe(false);
  expect(util.keyInProp("person", prop, "Marilyn")).toBe(true);
  expect(util.keyInProp("diff", prop)).toBe(false);
  expect(util.keyInProp("type", prop)).toBe(false);
});

test("getKeyInProp() - it should get prop in key or return null", () => {
  expect(util.getKeyInProp("doesnt_exists", prop)).toBeNull();
  expect(util.getKeyInProp("person", prop)).toBe("Marilyn");
  expect(util.getKeyInProp("person", prop)).not.toBe("marilyn");
});

test("push() - it should push a key into an new array", () => {
  expect(util.push("key", {})).toHaveLength(0);
  expect(util.push("person", prop)).toHaveLength(1);
});

test("push() - it should be a key into an array where a value exists", () => {
  expect(util.push("person", prop, "Marilyn")).toEqual(expect.arrayContaining([prop]))
  expect(util.push(null, prop.people, prop.people[0])).toEqual(expect.arrayContaining([prop.people]));

  expect(util.push(null, ["data"], "sample")).toHaveLength(0);
  expect(util.push(null, ["data"], "data")).toHaveLength(1);
});

test("pushValues() - it should push the values of the keys", () => {
    expect(util.pushValues("leader", prop)).toEqual(expect.arrayContaining([prop.leader]));
    expect(util.pushValues("leader", prop, "not")).toHaveLength(0);
    expect(util.pushValues("leader", [])).toHaveLength(0);
    expect(util.pushValues("leader", ["leader"])).toHaveLength(0);
});

test("pushMany() - push array into main array reference", () => {
  let into = ["Marilyn", "Plato"];
  util.pushMany(["Winny", "Rafie"], into);
  expect(into).toEqual(expect.arrayContaining(["Marilyn", "Plato", "Winny", "Rafie"]));
});

test("get() - recursively get all values from json data", () => {
  expect(util.get("person", prop)).toEqual(expect.arrayContaining(["Marilyn", "Plato", "Winny", "Rafie"]));
  expect(util.get("toys", prop)).toEqual(expect.arrayContaining([
  [{type: "bone"}, {type: "stuffed"}]
  ]));
  expect(util.get("type", prop)).toEqual(expect.arrayContaining(["dog", "bone", "stuffed"]))
});

test("find() - recursively get all keys from json data", () => {
  let expecting = [
   {...prop},
   {...prop.people[0]},
   {...prop.people[1]},
   {...prop.leader}
  ]
  expect(util.find("person", prop)).toEqual(expect.arrayContaining(expecting))

  let expecting_type = [
    {...prop.leader},
    ...prop.leader.toys
  ];
  expect(util.find("type", prop)).toEqual(expect.arrayContaining(expecting_type));
  expect(util.find("not_exist", prop)).toHaveLength(0)
});

