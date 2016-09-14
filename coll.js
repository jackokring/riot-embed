//========================================
// Keyed collection _$
//========================================

function _$(obj, quick) {
  
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
  
  function concat(all) {
    var res = new _$(this);
    _.each(all, function(el) {
      res.push(el);
    });
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
  
  function _spush(el) {
    return super.push(el);
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
  
  function filter() {
    var idx = Array();
    return new _$(super.filter(arguments));
  }
  
  function map() {
    return new _$(super.map(arguments));
  }
  
  function sort() {
    
  }
}

_$.prototype = Array;
