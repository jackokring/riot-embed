//========================================
// SpliceArray  0.0.0
//========================================
// Stores an array optimized for splice()
// An int argument makes a range array
// of length.

function SpliceArray(obj, quick, keys, fns) {
  
  SpliceArray.VERSION = "1.0.0";
  
  if(quick) {
    this._back = quick;
    _.each(obj, function(el, idx) {
      this[idx] = el;
    }, this);
  } else {
    this.length = obj.length;//size
    _.each(fns, function(val, key, all) {
      if(!val) all[key] = _bma;
    });
    this._back = this._build(obj, keys, fns);
    this._use(0);//first index
  }
  this._esc = false;
  return new Proxy(this, {
    set: function(obj, prop, val) {
      if(!_.isNumber(prop)) {
        if(prop === 'length') ??
        obj[prop] = val;//property proper
        return val;
      }
      if(prop > obj.length - 1) error(_$, 'not assign out of bounds. Try push().');
      if(obj._esc == true) {
        obj[prop] = val;
        return val;
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
               x = fns[key++](vals[a], vals[b]);
            }
          });
          obj._back[1][key] = cur;//store new sort
          if(key == obj._back[4]) obj._use(key);//retore valid index
        }
      });
    }
    get: function(obj, prop) {
      if(prop === 'length') ??
      return obj._back[0][obj[prop]];//return indexed
    }
  });
  
  function concat() {
    if(this.length != this._back[0].length) error(concat, 'no concat() to a slice().');
    var res = new _$(this, this._back);//make new array
    _.each(arguments, function(el) {
      this.push(el);
    }, res);
    return res;
  }
  
  function fill() {
    error(fill);
  }
  
  function copyWithin() {
    error(copyWithin);
  }
  
  function push(el) {
    if(this.length != this._back[0].length) error(push, 'no push() or unshift() to a slice().');
    var len = this._back[0].push(el);
    _.times(this._back[1].length, function(n) {
      var idx = this._insert(n, 0, len - 1);//inset log(n)
      if(n == this._back[4]) super.splice(idx, 0, this.length);
    }, this);
    return len;
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
    error(splice, 'convert to concat() and slice(). Sorted!');
  }
  
  function reverse() {
    error(reverse);
  }
  
  function filter(callback, thisArg) {
    var it = [];
    _.each(this, function(el, key, arr) {
      if(callback.call(thisArg, this._back[0][el], key, arr)) {
        it.push(el);
      }
    });
    return new _$(it, this._back);//a slice;
  }
  
  /* function map(); */ //lets assume that [] are used, and the prototype is Array so ... OK
  
  function sort() {
    error(sort);
  }
  
  function error(func, suggest) {
    suggest = suggest || 'understand this is an indexed sorted collection.';
    throw 'Library _$.' + func.name + '() is not available. Suggest you ' + suggest;
  }
}

SpliceArray.prototype = Array;
