function setBibliography(data) {
    // Function used by JSON callback
    var element=document.getElementById("orcidbib");
    if (element === null) {
	showError("");
    } else {
	element.innerHTML=data.html;
    }
}

function showError(msg) {
    // Show helpful error to help user debug
    var element = document.getElementById("orcidbib");
    if (element === null) {
	// can't even write to page, show alert
	alert("orcidbib.js error: Cannot find element with id=\"orcidbib\" to insert content. " + msg);
    } else {
	element.style.color="#F00";
	element.innerHTML="orcidbib.js error: " + msg;
    }
}

function loadJSONP(uri) {
    // Insert <script> in head to load JSONP from uri
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src=uri
    head.appendChild(script);
}

// Write loading message
setBibliography({"html": "[Loading bibliography...]"});
// Find script element which has id="orcid:ID[:STYLE]"
var scripts = document.getElementsByTagName( "script" );
var id=null;
var style="nature"; // default style is nature
var feed=null;
for (var j=scripts.length-1; j>=0; j--) {
    var idatt=scripts[j].id;
    if (idatt !== null) {
	var parts = idatt.split(":");
	if (parts[0] == "orcid") {
	    id = parts[1];
	    // style as third part overrides default
	    if (parts[2]) {
		style = parts[2];
		if (parts[3]) {
		    feed = parts[3];
		}
	    }
	    break;
	}
    }
}
// FIXME - should validate id here also, at least form
console.log("id="+id+" style="+style+" feed="+feed);
if (id === null) {
    showError("Did not find id=\"orcid:NNNN-NNNN-NNNN-NNNN\" on a &lt;script&gt; tag.");
} else {
    if (feed == "mt") {
	loadJSONP("http://128.141.237.49:8080/"+id+".html?callback=setBibliography&style="+style);
    } else { //default to orcidlive
        loadJSONP("http://orcidlive.org/ajax/formatWorks/orcid/"+id+"/style/"+style+"/callback/setBibliography");
    }
}
