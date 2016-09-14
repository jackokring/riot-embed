//========================================
// Keyed collection _$
//========================================

function _$(obj, quick) {
  
  if(quick) {
    this._idx = new Array(quick);
    var inner = this;
    _.each(obj, function(el) {
      inner._spush(el);
    });
  } else {
    this._idx = new Array();
    var inner = this;
    _.each(obj, function(el) {
      inner.push(el);
    });
  }
  return res;
  
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

  /* function join() */
  
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
    
  }
  
  function reverse() {
    this._idx.reverse();
    return this.reverse();
  }
  
  function sort() {
    
  }
  
  function indexOf() {
    
  }
  
  function lastIndexOf() {
    
  }
  
  /* function forEach() */
  
  function map() {
    
  }
  
  function filter() {
    
  }
  
  /* function every() */
  
  /* function some() */
  
  /* function reduce() */
  
  /* function reduceRight() */
}

_$.prototype = Array;
