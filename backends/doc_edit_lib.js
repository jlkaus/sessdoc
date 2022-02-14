/* Document Editor javascript library */
/* Can use dojo stuff.  Need to require stuff if you use it. */

function parseHeaders(headerText)
{
    var headers = {};
    var ls = /^\s*/;
    var ts = /\s*$/;
    var lines = headerText.split("\n");
    for(var i = 0;i< lines.length; ++i){
	var line = lines[i];
	if(line.length == 0) continue;
	var pos = line.indexOf(':');
	var name = line.substring(0, pos).replace(ls,"").replace(ts,"").toLowerCase();
	var value = line.substring(pos+1).replace(ls,"").replace(ts,"");
	headers[name] = value;
    }
    return headers;
}

function parseStdStuff(revision)
{
    var revdata = {};
    var ls = /^\s*/;
    var ts = /\s*$/;
    var lq = /^\"/;
    var tq = /\"$/;
    var mode = 0;
    var lastPos = 0;
    var equalPos = 0;
    var i = 0;
    for(i = 0;i< revision.length; ++i) {
	var c = revision.charAt(i);
	if(c == ";" && mode == 0) {
	    if(equalPos == 0) {
		revdata["revision"] = revision.substring(0, i).replace(ls,"").replace(ts,"").replace(lq,"").replace(tq,"");
//		console.log("revision=",revdata["revision"]);
	        equalPos = -1;
	    } else {
		var name = revision.substring(lastPos, equalPos).replace(ls,"").replace(ts,"").toLowerCase();
		revdata[name] = revision.substring(equalPos+1,i).replace(ls,"").replace(ts,"").replace(lq,"").replace(tq,"");
//		console.log(name,"=",revdata[name]);
                equalPos = -1;
	    }
	    lastPos=i+1;
	}
	if(c == "=" && mode == 0) {
	    equalPos = i;
	}
	if(c == "\"") {
	    if(mode == 0) {mode = 1;} else {mode = 0;}
	}
    }
    if(equalPos == 0) {
	revdata["revision"] = revision.substring(0, i).replace(ls,"").replace(ts,"").replace(lq,"").replace(tq,"");
//	  console.log("revision=",revdata["revision"]);
    } else if(equalPos > 0)	{
	var name = revision.substring(lastPos, equalPos).replace(ls,"").replace(ts,"").toLowerCase();
	revdata[name] = revision.substring(equalPos+1,i).replace(ls,"").replace(ts,"").replace(lq,"").replace(tq,"");	  
//         console.log(name,"=",revdata[name]);
    }

    return revdata;
}




