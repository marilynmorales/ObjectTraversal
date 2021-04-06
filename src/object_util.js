class ObjectUtil {
  isObject(val) {
    return typeof val === "object" && !Array.isArray(val) && val !== null;
  }

  isArray(val) {
    return Array.isArray(val);
  }
  
  keyInProp(key, prop, value) {
    let hasValue = typeof value !== "undefined",
      isObject = this.isObject(prop);
    if(
      (isObject && prop[key] && !hasValue) ||
      (isObject && prop[key] && hasValue && prop[key] == value)) {
      return true;
    }
    return false;
  }

  getKeyInProp(key, prop) {
    if(this.keyInProp(key, prop)) {
      return prop[key];
    }
    return null;
  }
  
  push(key, prop, value) {
    let keys = [];
    if(this.isObject(prop)) {
      if(this.keyInProp(key, prop, value)) {
        keys.push(prop);
      }
    }
    
    if(this.isArray(prop) && typeof value !== "undefined") {
      if(prop.indexOf(value) > -1) {
        keys.push(prop);
      }
    }
    return keys;
  }
  
  pushValues(key, prop, value) {
    let keys = [];
    if(this.isObject(prop)) {
      if(this.keyInProp(key, prop, value)) {
        keys.push(prop[key]);
      }
    }
    return keys;
  }

  pushMany(push, into) {
    for(var i in push) {
      into.push(push[i]);
    }
  }

  get(key, prop, value) {
    let keys = this.pushValues(key, prop, value);
     
    if(this.isArray(prop) || this.isObject(prop)) {
      for(var i in prop) {
        //if(this.isObject(prop[i])) {
          const n_keys = this.get(key, prop[i], value);
          if(n_keys.length > 0) this.pushMany(n_keys, keys);
       // }
      }
    }
    return keys;
  }
  
  find(key, prop, limit = null, value) { 
    let found = 0;
    const search = (key, prop, value) => {
     if(limit != null && limit <= found) return [];
  
      let keys = this.push(key, prop, value);
      if(keys.length > 0) {
        ++found;
      }
  
      if(this.isArray(prop) || this.isObject(prop)) {
        for(var i in prop) {
          const n_keys = search(key, prop[i], value);
          if(n_keys.length > 0) {
            this.pushMany(n_keys, keys);
          }
        }
      }
 
      return keys;
    }
    return search(key, prop, value);
  }
};

module.exports = new ObjectUtil();


