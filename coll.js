//========================================
// Keyed collection _$  1.0.8
//========================================
// Stores an array with sorted indexing
// Excellent. The fast insert time while
// having an excellent ordering allows
// pop() and shift() to iterate. Use reset()
// to get back the whole collection.
// use() restores a particular key sort
// order, and restores all elements of
// the collection ready to splice again.

//TODO: Make an n-tree fixed depth SpliceArray for O(1) splice()
//Extend filter()
//Formulate the most efficient delete strategy


function _$(obj, quick, keys, fns) {
  
  _$.VERSION = "1.0.8";
  
  function _bma(a, b) {
    if(_.isUndefined(a) && _.isUndefined(b)) return 0;
    if(_.isUndefined(a)) return 1;
    if(_.isUndefined(b)) return -1;
    if(_.isFinite(a) && _.isFinite(b)) return b - a;
    if(_.isString(a) && _.isString(b)) return a.localCompare(b);
    if(_.isObject(a) && _.isObject(b)) {
      var tot = _.reduce(_.keys(a), function(memo, el, key) {
        memo += _bma(el, b[key]);
      }, 0);
      tot += _.reduce(_.keys(b), function(memo, el, key) {
        memo += _bma(a[key], el);
      }, 0);
      return tot;//a property compare set
    }
    if(_.isArray(a) && _.isArray(b)) return b.length - a.length;
    return JSON.stringify(a).localCompare(JSON.stringify(b));
  }
  
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
        if(prop === 'length') error(_$, 'not assign new length. Try push().');
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
          var cur = new SpliceArray(obj.length);//an optimal fill
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
      if(!_.isNumber(prop)) {
        if(prop === 'length') return obj.length;
        return obj[prop];
      }
      return obj._back[0][obj[prop]];//return indexed
    }
  });
  
  function _use(idx) {
    this._back[4] = idx;
    this._esc = true;//escape proxy
    _.each(this, function(el, key) {//has right count
      this[key] = this._back[1][idx][key];//indexes, index used, element 
    }, this);
    this._esc = false;
  }
  
  function _build(obj, keys, fns) {
    var vals = new SpliceArray();
    _.each(obj, function(el) {
      vals.push(el);
    });
    var len = vals.length;
    var idx = new SpliceArray();
    _.each(keys, function(val, key) {
      var cur = _.range(len);
      cur.sort(function(a, b) {
        var x = 0;
        while(x == 0 && key < keys.length) {
           x = fns[key++](vals[a], vals[b]);
        }
      });
      idx.push(cur);//add an index
    });
    return [vals, idx, keys, fns, 0];//master shared structure of collection state
  }
  
  function use(name) {
    this._use(this._back[2].findIndex(name));
  }
  
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
  
  function _insert(key, start, end) {
    var idx = this._back[1][key];
    var code = idx.length;
    var fns = this._back[3];
    var num = this._back[1].length;
    var vals = this._back[0];
    var mid = start + (end - start) >> 1;
    var x = 0;
    var sz = end - start;
    while(x == 0 && key < num) {
       x = fns[key++](vals[mid], vals[code]);
    }
    if(x == 0 || sz == 0) {
      idx.splice(mid, 0, code);
      return mid;
    }
    if(x > 0) {
      if(sz == 1) {
        idx.splice(end, 0, code);
        return end;
      }
      return this._insert(key, mid, end);
    } else {
      if(sz == 1) {
        idx.splice(start, 0, code);
        return start;
      }
      return this._insert(key, start, mid);
    }
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

_$.prototype = SpliceArray;
