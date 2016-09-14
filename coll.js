//========================================
// Keyed collection _$
//========================================

function _$(obj, quick) {
  
  if(_.isFunction(obj)) /* OK? */ ;
  
  if(quick) {
    this._idx = new Array(quick);
    var inner = this;
    _.each(obj, function(el, idx) {
      inner[idx] = el;
    });
  } else {
    this._idx = new Array();
    var inner = this;
    _.each(obj, function(el, idx) {
      inner[idx] = el;
      inner._idx[idx] = el;
    });
  }
  return this;
  
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
  
  function sort() {
    
  }
  
  //any more functions?
}

_$.prototype = Array;
