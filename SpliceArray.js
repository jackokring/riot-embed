//========================================
// SpliceArray  0.0.0
//========================================
// Stores an array optimized for splice()
// An int argument makes a range array
// of length.

function SpliceArray(obj) {
  
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
    },
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
  
  function splice() {
    error(splice, 'convert to concat() and slice(). Sorted!');
  }
}

SpliceArray.prototype = Array;
