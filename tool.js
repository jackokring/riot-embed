//      RiotEmbed tool.js 1.0.5
//      https://kring.co.uk
//      (c) 2016 Simon Jackson, K Ring Technologies Ltd
//      MIT, like as he said. And underscored :D

//===============================================
// Might as well start with __ libs for use
// This does imply $$ is very sexy :D
//===============================================

function riotEmbed(ob) {
    
    if(ob) {
        //maybe some semantic?
        //the following should be same as trimmed code text?
        alert('Object checksum: ' + makeHash(ob.toString()));
        return riotEmbed;
    }
    riotEmbed.VERSION = '1.0.5';
    riotEmbed._saveState = __;
    riotEmbed.url = 'https://www.kring.co.uk/dbase.php';//CHANGE IF NEEDED

//====================================
// PON handling
//====================================

function appPON(json, hash, callback) {
    forkPON(json, eval, function(script) {
        if(hashCode(script.innerHTML) == hash) {
            run(script, callback);
        } 
    });
}

function hashCode(input) { //CH-32
    var gen = tally(input);
    gen.zz = input.length;
    var acc = 0;
    gen = _.reduce(gen, function(memo, val) {
        memo += String.fromCharCode((val << (acc % 17)) % 40763 + acc % 9473);
        acc += val % 98 + input.charCodeAt(acc * 65341 % input.length);
    }, '');
    gen = JSON.stringify(pack(gen));
    gen = _.reduce(gen.split(''), function(memo, val) {
        val = val.charCodeAt();
        memo += String.fromCharCode((val << (acc % 18)) % 45563 + acc % 6923);
        acc += val % 37 + input.charCodeAt(acc * 63371 % input.length);;
    }, '');
    gen = btoa(encodeUTF(gen));
    var genMax = gen.length - 32;
    var genStart = input.length % genMax;
    return gen.substring(genStart, genStart + 32);
}

function makeHash(input) {
    return hashCode('eval(' + stringifyPreJS(input) + ');');
}

function run(script, callback) {
    document.body.appendChild(script);//RUN!!
    script.onload = function() {
        script.parent.removeChild(script);//GC!!
        callback && callback(_.now());
    }
}

//a little Java hashCode lib
function fastHash(e){for(var r=0,i=0;i<e.length;i++)r=(r<<5)-r+e.charCodeAt(i),r&=r;return r};

function loadPON(json, callback) {//gets packed object at url
    savePON(json, callback, true);
}

function forkPON(json, exec, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    loadPON(json, function(result) {
        script.innerHTML = exec + '(' + stringifyPreJS(result) + ');';
        callback && callback(script);
    });
}

function stringifyPreJS(s) {
    return s.
        replace(/\u2028/g, '\\u2028').
        replace(/\u2029/g, '\\u2029');
}

function savePON(json, callback, load) {
    json.tx = _.now();
    var http = new XMLHttpRequest();
    var id = json.id;//special
    var rest = load ? 'GET' : 'PUT';
    json = _.omit(json, 'id');
    http.open(rest, url + '?' + fastHash(JSON.stringify(id)), true);
    //fastHash for page caches 
    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/json");
    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            var tr = unpack(JSON.parse(http.responseText));
            tr.id.__ = id;
            tr.rx = _.now();
            callback && callback(tr);
        }
    }
    var pj = pack(json);
    pj.id = id;
    http.send(JSON.stringify(pj));
}

// LZW-compress a string
function encodeLZW(s, bounce) {
    s = encodeUTF(s);
    var dict = {};
    var data = (s + '').split('');
    var out = [];
    var currChar;
    var phrase = data[0];
    var codeL = 0;
    var code = 256;
    for (var i=1; i<data.length; i++) {
        currChar=data[i];
        if (dict['_' + phrase + currChar] != null) {
            phrase += currChar;
        }
        else {
            out.push(codeL = phrase.length > 1 ? dict['_'+phrase] : phrase.charCodeAt(0));
            if(code < 65536) {//limit
                dict['_' + phrase + currChar] = code;
                code++;
                if(bounce && codeL != code - 2) {
                    _.each(phrase.split(''), function (chr) {
                        if(code < 65536 && !dict['_' + phrase + chr]) {
                            dict['_' + phrase + chr] = code;
                            code++;
                        }
                    });
                }
            }
            phrase=currChar;
        }
    }
    out.push(phrase.length > 1 ? dict['_'+phrase] : phrase.charCodeAt(0));
    for (var i=0; i<out.length; i++) {
        out[i] = String.fromCharCode(out[i]);
    }
    return out.join('');
}

function encodePON(s) {
    return encodeLZW(s, true);
}

// Decompress an LZW-encoded string
function decodeLZW(s, bounce) {
    var dict = {};
    var data = (s + '').split('');
    var currChar = data[0];
    var oldPhrase = currChar;
    var out = [currChar];
    var code = 256;
    var phrase;
    for (var i=1; i<data.length; i++) {
        var currCode = data[i].charCodeAt(0);
        if (currCode < 256) {
            phrase = data[i];
        }
        else {
           phrase = dict['_'+currCode] ? dict['_'+currCode] : (oldPhrase + currChar);
        }
        out.push(phrase);
        currChar = phrase.charAt(0);
        if(code < 65536) {
            dict['_'+code] = oldPhrase + currChar;
            code++;
            if(bounce && !dict['_'+currCode]) {
                _.each(phrase.split(''), function (chr) {
                    if(code < 65536 && !dict['_' + code]) {
                        dict['_' + code] = oldPhrase + chr;
                        code++;
                    }
                });
            }
        }
        oldPhrase = phrase;
    }
    return decodeUTF(out.join(''));
}

function decodePON(s) {
    return decodeLZW(s, true);
}

function encodeUTF(s) {
    return unescape(encodeURIComponent(s));
}

function decodeUTF(s) {
    return decodeURIComponent(escape(s));
}

function encodeBWT(data) {
    var size = data.length;
    var buff = data + data;
    var idx = _.range(size).sort(function(x, y){
        for (var i = 0; i < size; i++) {
            var r = buff[x + i].charCodeAt() - buff[y + i].charCodeAt();
            if (r !== 0) return r;
        }
        return 0;
    });

    var top;
    var work = _.reduce(_.range(size), function(memo, k){
        var p = idx[k];
        if (p === 0) top = k;
        memo.push(buff[p + size - 1]);
        return memo;
    }, []).join('');
    
    return { top: top, data: work };
}

function decodeBWT(top, data) { //JSON

    var size = data.length;
    var idx = _.range(size).sort(function(x, y){
        var c = data[x].charCodeAt() - data[y].charCodeAt();
        if (c === 0) return x - y;
        return c;
    });

    var p = idx[top];
    return _.reduce(_.range(size), function(memo){
        memo.push(data[p]);
        p = idx[p];
        return memo;
    }, []).join('');
}

function tally(data) {
    return _.reduce(data.split(), function(memo, charAt) {
        memo[charAt]++;//increase
    }, {});
}

function splice(data) {
    var acc = 0;
    var counts = tally(data);
    return _.reduce(counts, function(memo, count, key) {
        memo.push(key + data.substring(acc, count + acc));
        /* adds a seek char:
        This assists in DB seek performance as it's the ordering char for the lzw block */
        acc += count;
    }, []);
}

//a packer and unpacker with good efficiency
function pack(data) {
    var bwt = encodeBWT(JSON.stringify(data));
    var mix = splice(bwt.data);
    
    mix = _.map(mix, encodePON);
    data = _.extendOwn({}, data, {
        top: bwt.top,
        /* tally: encode_tally(tally), */
        mix: mix
    });
    return data;
}

function unpack(got) {
    var top = got.top || 0;
    /* var tally = got.tally; */
    var mix = got.mix || [];
    
    mix = _.map(mix, decodePON);
    mix.sort(function(a, b) {
        return a.charCodeAt(0) - b.charCodeAt(0);
    });
    mix = _.reduce(mix, function(memo, lzw) {
        /* var key = lzw.charAt(0);//get seek char */
        memo += lzw.substring(1, lzw.length);//concat
    }, '');
    return _.extendOwn(JSON.parse(decodeBWT(top, mix)), _.omit(got, 'top', 'mix'));
}

function noConflict() {
    __ = _saveState;
    return riotEmbed;//ok give it a new name
}

//============================================
// And end the __ library
//============================================
__ = riotEmbed;
}//close object

riotEmbed();//activate
