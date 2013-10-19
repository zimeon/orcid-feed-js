/* Copyright 2013 Simeon Warner

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

function setBibliography(data) {
    // Function used by JSON callback
    var element=document.getElementById("orcidbib");
    if (element === null) {
	showError("");
    } else {
	element.innerHTML=data.html;
    }
}

function setDefaultStyle() {
    // Add a default set of styles at top of <head> so that
    // settings will be overridden by any later style info
    var style = document.createElement("style");
    style.appendChild(document.createTextNode("div.csl-left-margin {width:2em; float:left;} div.csl-right-inline {display: inline; text-indent: -2em; margin-left: 2em;}"));
    var head=document.head;
    if (head.firstChild) {
	head.insertBefore(style,head.firstChild);
    } else {
	head.appendChild(style);
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

function generateCheckDigit(orcid_no_hyphens) { 
    // Generates check digit as per ISO 7064 11,2 for 15 digit string
    // http://support.orcid.org/knowledgebase/articles/116780-structure-of-the-orcid-identifier
    var total = 0; 
    var zero = "0".charCodeAt(0);
    for (var i = 0; i < 15; i++) { 
        var digit = orcid_no_hyphens.charCodeAt(i)-zero; 
        total = (total + digit) * 2; 
    } 
    var result = (12 - (total % 11)) % 11; 
    return(result == 10 ? "X" : String(result)); 
}

function invalidORCID(orcid) {
    // False if orcid has correct form (including hyphens) and valid checksum, else error string
    var orcid_no_hyphens=orcid.replace(/^(\d{4})-(\d{4})-(\d{4})-(\d\d\d[\dX])$/,"$1$2$3$4");
    if (orcid_no_hyphens==orcid) { // will not match if replace succeeded
	return "Invalid ORCID, bad form";
    }
    if (orcid_no_hyphens.charAt(15)!=generateCheckDigit(orcid_no_hyphens)) {
	return "Invalid ORCID, bad check digit";
    }
    return false;
}

// Find script element which has id="orcid:ID[:STYLE]"
var scripts = document.getElementsByTagName( "script" );
var script = null;
var id=null;
var style="nature"; // default style is nature
var feed=null;
// Look for last script that has a id matching "orcid:.*"
// (Wonder whether there should be a way to run for multiple ids?)
for (var j=scripts.length-1; j>=0; j--) {
    var script=scripts[j];
    if (script.id !== null) {
	var parts = script.id.split(":");
	if (parts[0] == "orcid") {
	    id = parts[1];
	    // style and feed override default if present
	    if (parts[2]) {
		style = parts[2];
	    }
	    if (parts[3]) {
		feed = parts[3];
	    }
	    break;
	}
    }
}
if (id !== null) {
    // Add div for content if not present
    if (document.getElementById("orcidbib") === null) {
	var div = document.createElement("div");
	div.id = "orcidbib";
	// FIXME - find parent of script, not just body
	var parent = document.body;
	parent.insertBefore(div, script);
    }
    // Write loading message
    setBibliography({"html": "[Loading bibliography...]"});
}
setDefaultStyle();
if (id === null) {
    showError("Did not find id=\"orcid:NNNN-NNNN-NNNN-NNNN\" on a &lt;script&gt; tag.");
} else if (msg=invalidORCID(id)) {
    showError(msg + " '" + id + "'");
} else {
    // All OK, try to load
    if (feed == "local") {
	loadJSONP("./"+id+"_"+style+".jsonp");
    } else if (feed == "mt") {
	loadJSONP("http://128.141.227.162:8080/"+id+".html?callback=setBibliography&style="+style);
    } else { //default to orcidlive
	loadJSONP("http://orcidlive.org/ajax/formatWorks/orcid/"+id+"/style/"+style+"/callback/setBibliography");
    }
}
