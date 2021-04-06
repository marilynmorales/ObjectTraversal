const util = require("./object_util");

class ObjectTraversal {
  constructor(origin) {
    this.origin = origin;
  }
  
  find(key) {
    const keys = util.find(key, this.origin, 1);
    let origin = {};
    if(keys.length > 0) {
      origin = keys[0];
    }
    return new this.constructor(origin);
  }
  
  findN(key, limit=null) {
    const origin = util.find(key, this.origin, limit);
    return new this.constructor(origin);
  }
  
  findAll(key) {
    const origin = util.find(key, this.origin);
    return new this.constructor(origin);
  }
  
  where(key, value, limit = null) {
    const origin = util.find(key, this.origin, limit, value);
    return new this.constructor(origin);
  }

  get(key) {
    const origin = util.get(key, this.origin);
    return new this.constructor(origin);
  }

  first(key) {
    const keys = util.find(key, this.origin, 1);
    let origin = {};
    if(keys.length > 0) {
      origin = keys[0][key];
    }
    return new this.constructor(origin);
  }

  value() {
    return this.origin;
  }
}

module.exports = ObjectTraversal;
