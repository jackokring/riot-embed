//========================================
// Keyed collection _$  1.0.1
//========================================

function _$(obj, quick, keys, fns) {
  
  _$.VERSION = "1.0.1";
  
  if(quick) {
    this._back = quick;
    _.each(obj, function(el, idx) {
      this[idx] = el;
    }, this);
  } else {
    this._back = this._build(obj, keys, fns);
    _.each(obj, function(el, key) {//has right count
      this[key] = this._back[1][1][key];//index, first, element 
    }, this);
  }
  return new Proxy(this, {
    set: function(obj, prop, val) {
      obj[prop] = val;
      obj._idx[prop] = val._i;//OK 
    }
    get: function(obj, prop) {
      return obj._back[0][obj[prop]];//return indexed
    }
  });
  
  function _build(obj, keys, fns) {
    var vals = [];
    _.each(obj, function(el) {
      vals.push(el);
    });
    var len = vals.length;
    var idx = [];
    _.each(keys, function(val, key) {
      var cur = _.range(len);
      cur.sort(function(a, b) {
        var x = 0;
        while(x == 0 && key < keys.length) {
           x = fns[key] && fns[key++](vals[a], vals[b]);
        }
        idx.push(cur);//add an index
      });
    });
    return [vals, idx];//master shared structure of collection state
  }
  
  //OK to here!!
  
  function of() {
    return _$(arguments, _.map(arguments, function() {
      return undefined;
    }));
  }
  
  function concat(all) {// or ONE _$ to make a collection of both
    var res;
    if(all instanceof _$) {// N.B.
      res = new _$(super.concat(all), this._idx.concat(all._idx));// super === this.prototype ...
    } else {
      res = new _$(this);
      _.each(arguments, function(el) {
        res.push(el);
      });
    }
    return res;
  }
  
  function fill(el, start, end) {
    this._idx.fill(el._i, start, end);
    super.fill(arguments);
  }
  
  function copyWithin() {
    this._idx.copyWithin(arguments);
    super.copyWithin(arguments);
  }
  
  function push(el) {
    this._idx.push(el._i);//becomes finable
    return super.push(el);
  }
  
  function pop() {
    this._idx.pop();//make not found
    return super.pop();
  }
  
  function shift() {//synchronized auto
    this._idx.shift();
    return super.shift();
  }
  
  function unshift(el) {
    this._idx.unshift(el._i);
    return super.unshift(el);
  }
  
  function slice() {
    return new _$(this.slice(arguments), this._idx.slice(arguments));
  }
  
  function splice() {
    var x = Array.from(arguments);
    _.map(x, function(el, key) {
      if(key < 2) return el;
      return el._i;
    });
    this._idx.splice(x);
    return super.splice(arguments);
  }
  
  function reverse() {
    this._idx.reverse();
    return this.reverse();
  }
  
  function filter(callback, thisArg) {
    var it = new _$();
    _.each(this, function(el, key, arr) {
      if(callback.call(thisArg, el, key, arr)) {
        it.push(el);
      }
    });
    return it;
  }
  
  function map() {//map in worst case can change keys so recalc
    return new _$(super.map(arguments));
  }
  
     //==== optimze below later
  
  function sort(func) {
    var rng = _.range(this.length);
    rng.sort(function(a, b) {
      func(this[a], this[b]);
    });
    var inner = this;
    var cl = _$(this, this._idx);
    _.each(rng, function(val, key) {
      this[key] = cl[val];
      this._idx[key] = cl._idx[val];
    }, this);
    return this;
  }
  
  //any more functions?
}

_$.prototype = Array;
