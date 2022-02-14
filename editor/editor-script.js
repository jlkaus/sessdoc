var numtabs=0;
var maxtabs=5;
var selectedtab="tab0";
var nexttabnum=1;

var tabcontent=[];


function startup() {
    document.getElementById('new').onclick = function() {menuopen(0);};
    document.getElementById('open').onclick = function() {menuopen(1);};
    // document.getElementById('save').onclick = menusave;
    document.getElementById('close').onclick = menuclose;
    
    var es=document.getElementById('editspace');
    // es.onclick = editclick;
    // es.onmouseover = null;
    // es.onmouseout = null;
    // es.onkeypress = null;
    // es.onkeyup = null;
    // es.onkeydown = editinterpret;

}

function menuclose() {
    var oldselected=selectedtab;

    changeTab("tab0");

    var futureselect="tab0";
    if(numtabs>1) {
	futureselect=
	    document.getElementById(oldselected).nextSibling.id;
	if(futureselect=='endtab') {
	    futureselect=
		document.getElementById(oldselected).previousSibling.id;
	}
    }

    tabcontent[oldselected]='';
    
    var tablist=document.getElementById('tablist');
    var endtab=document.getElementById('endtab');
    var oldtab=document.getElementById(oldselected);

    tablist.removeChild(oldtab);

    --numtabs;
    var newwidth=800-numtabs*(151);
    endtab.style.width = newwidth+'px';

    changeTab(futureselect);

}

function menuopen(loadfromfile) {
    if(numtabs<maxtabs) {
	var filename=prompt('Name of tab:','');
	
	++numtabs;
	var tabdex="tab"+nexttabnum;
	++nexttabnum;
	
	var tablist=document.getElementById('tablist');
	var endtab=document.getElementById('endtab');
	var newwidth=800-numtabs*(151);
	endtab.style.width = newwidth+'px';
	
	var newtab=document.createElement('li');
	newtab.id=tabdex;
	newtab.innerHTML=filename;
	
	tablist.insertBefore(newtab,endtab);
	
	if(loadfromfile) {
	    // load in the file from the server into the localstore
	    tabcontent[tabdex]='';
	} else {
	    tabcontent[tabdex]=filename;//'';
	}
	

	changeTab(tabdex);
	
    }
}

function changeTab(newone) {
	var es=document.getElementById('editspace');
	var tablist=document.getElementById('tablist');
	if(selectedtab!="tab0") {
	    var oldselected=selectedtab;
	    var oe=document.getElementById('selectedtab');

	    tabcontent[selectedtab]=es.innerHTML;
	    oe.id=selectedtab;

	    oe.onclick=function(){changeTab(this.id);};

	}
	es.innerHTML='';

	if(newone!="tab0") {
	    var ne=document.getElementById(newone);
	    document.title="Editor - " + ne.innerHTML;

	    ne.id='selectedtab';
	    ne.onclick=null;
	    es.innerHTML=tabcontent[newone];
	} else {
	    document.title="Editor";
	}


	selectedtab=newone;    

}
