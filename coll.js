//========================================
// Keyed collection _$  1.0.2
//========================================

function _$(obj, quick, keys, fns) {
  
  _$.VERSION = "1.0.2";
  
  if(quick) {
    this._back = quick;
    _.each(obj, function(el, idx) {
      this[idx] = el;
    }, this);
  } else {
    this.length = obj.length;//size
    this._back = this._build(obj, keys, fns);
    this._use(0);//first index
  }
  this._esc = false;
  return new Proxy(this, {
    set: function(obj, prop, val) {
      if(obj._esc == true) {
        obj[prop] = val;
        return;
      }
      var old = obj._back[0][obj[prop]];
      obj._back[0][obj[prop]] = val;
      //rebuild quick!
      var vals = obj._back[0];
      _.each(obj._back[2], function(v, key) {
        if(old[key] !== val[key]) { //only fix damaged keys
          var cur = _.range(obj.length);
          cur.sort(function(a, b) {
            var x = 0;
            while(x == 0 && key < keys.length) {
               x = fns[key] && fns[key++](vals[a], vals[b]);
            }
          });
          obj._back[1][key] = cur;//store new sort
          if(key == obj._back[4]) obj._use(key);//retore valid index
        }
      });
    }
    get: function(obj, prop) {
      return obj._back[0][obj[prop]];//return indexed
    }
  });
  
  function _use(idx) {
    var x = this._back[4] = idx;
    this._esc = true;//escape proxy
    _.each(this, function(el, key) {//has right count
      this[key] = this._back[1][x][key];//indexes, index used, element 
    }, this);
    this._esc = false;
  }
  
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
      });
      idx.push(cur);//add an index
    });
    return [vals, idx, keys, fns, 0];//master shared structure of collection state
  }
  
  function use(name) {
    if(this.length != this._back[0].length) error(use, 'use use() before slice().');
    this._use(this._back[2].findIndex(name));
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
  
  function fill() {
    error(fill);
  }
  
  function copyWithin() {
    error(copyWithin);
  }
  
  function push(el) {
    this._idx.push(el._i);//becomes finable
    return super.push(el);
  }
  
  function pop() {
    return this._back[0][super.pop()];
  }
  
  function shift() {
    return this._back[0][super.shift()];
  }
  
  function unshift(el) {
    return this.push(el);//it's the same for this collection
  }
  
  function slice() {
    return new _$(super.slice(arguments), this._back);//quick
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
    error(reverse);
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
  
  function map() {
    error(map, 'consider a library like underscore. This is not an efficient operation.');
  }
  
  function sort() {
    error(sort);
  }
  
  function error(func, suggest) {
    suggest = suggest || 'understand this is an indexed sorted collection.';
    throw 'Library _$.' + func.name + '() is not available. Suggest you ' + suggest;
  }
  
  //any more functions?
}

_$.prototype = Array;
