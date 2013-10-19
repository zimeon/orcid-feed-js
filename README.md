# ORCID Feed inclusion with JavaScript

*WARNING:* This is demo code created as part of a [codesprint](http://www.hackathon.io/projects/3233) for the [ODIN project](http://odin-project.eu/). I'm not a JavaScript programmer, it is not polished, and it relies upon demonstration feed processing services that may not remain available. Buyer beware!

## 1. Why?

We'd like to make is stupidly simple to include a bibliography from an ORCID profile in and other webpage. Like pages would be homepages and blogs for example. The code necessary should be very easy to add and configure for the appropriate citation style (which varies widely by discipline).

## 2. How to include

At the place on your web page where you would like to include your ORCID profile bibliography, include the following two lines:

```html
<script src="orcidbib.js" type="text/javascript" id="orcid:0000-0002-7970-7855"></script>
```

where the {{id}} attribute is the way that the individual's ORCID iD is passed in, prefixed with {{orcid:}}.

Optionally, the citation style may be added as another parameter, separated by a colon again. For example, to specify the {{ieee}} style, use:

```html
<script src="orcidbib.js" type="text/javascript" id="orcid:0000-0002-7970-7855"></script>
```

Optionally, you may specify a container for the bibliography in a different part of the document to the place where the script is included by adding an element with {{id="orcidbib}}. For example in the following there is a default message that would be left displayed if JavaScript were not running in the client:

```html
<div id="orcidbib">[Bibliography loads here (JavaScript required)]</div>
...more HTML in here...
<script src="orcidbib.js" type="text/javascript" id="orcid:0000-0002-7970-7855"></script>
```

The content of {{<div id="orcidbib">}} is replaced when the bibliography loads.

FIXME - link to styles

FIXME - description of use of orcidlive and Mummi/Martin's feeds

## 3. Concepts and processing

[ORCID](http://orcid.org) provides a simple and openly accessible API to get an individual's profile data, including works they have included, in various formats. For example, the HTML of my public profile is simply the full URL form of my ORCID:

  * [http://orcid.org/0000-0002-7970-7855](http://orcid.org/0000-0002-7970-7855)

To get the data behind this page you can access as:

```
$ curl -H 'Accept: application/orcid+xml' 'http://orcid.org/0000-0002-7970-7855/orcid-works' -L -i
```

ORCID aims to support scholars across all academic disciplines and there are a great many different citation styles used by different disciplines. There is considerable existing work on citation formatting and descriptions of the many formatting styles (see, for example the Wikipedia articles on [CiteProc](http://en.wikipedia.org/wiki/CiteProc) and [Citation Style Language](http://en.wikipedia.org/wiki/Citation_Style_Language)). We thus chose to look at implementations of [CSL](http://citationstyles.org/) and found the JavaScript [citeproc-js](https://bitbucket.org/fbennett/citeproc-js) and the Ruby [citeproc-ruby](https://github.com/inukshuk/citeproc-ruby).

It is possible to use the current ORCID native API to obain the BibTeX of the citation fo reach work and then proess that with citeproc-js to get formatted HTML output. However, this requires considerable client-side processing and over 400kB of JavaScript. Because most accesses to homepages and such are one-off rather than repeat accesses to a site the download size is an issue. We thus concluded that it is best to do more processing with a client-side app.

At present the demonstration code developed by Mummi (not on a real server yet) and Roy (at orcidlive.org) produces formatted HTML output that can later be styled with CSS. For example, to get Nature format citations for ORCID 0000-0002-7970-7855 with a JSONP callback {{setBibliography}} from orcidlive, the URI is:

```
$ curl http://orcidlive.org/ajax/formatWorks/orcid/0000-0002-7970-7855/style/nature/callback/setBibliography
```

The HTML has the structure:

```html
FIXME - structure with class tags
```

The current JavaScript simply put this HTML into the right place in the page. It would probably be better for the server-side apps to return more structure content, at least splitting the items into an array with one element per citiation.

## 4. Notes from ODIN codesprint

### 4.1 Key features wanted

  * description of item (i.e. the citation itself) + link to it (DOI ideally)
  * allow limiting number of items returned (e.g. URL param: ?maxcitations=x) and/or allow limiting number displayed displayed (i.e. fetch all and enable “show more”)
  * specify item order: most recently published (default from ORCID), by 1st author.. ? 
  * make it super-easy to use (drop-in Javascript library, 2-3 lines of HTML/code)
  * let user choose citation style (from list of all available CSL styles, use CiteProc/CSL to handle citation styling, see [CiteProc documantation](https://bitbucket.org/fbennett/citeproc-js/wiki/Home)
  * have useful error reporting so that non-programmer can debug issues (some quasi-sane exception catching, rather than just dumping stacktrace into the window)
  * add icon to indicate whether DOI’d work is from DataCite or CrossRef
  * would like some ability to decorate and/or split citation to highlight datasets (e.g. from Dryad)

### 4.2 Existing work

[Martin Fenner's work on feeds](http://blog.martinfenner.org/2013/07/26/rss-feeds-for-scholarly-authors/) implemented an orcid-feed tool already does server-side citation styling. Only plain text output so far:
  * http://feed.labs.orcid-eu.org/0000-0003-1419-2405.txt 
  * http://feed.labs.orcid-eu.org/0000-0003-1419-2405.txt?style=nature
  * http://feed.labs.orcid-eu.org/0000-0003-1419-2405.txt?style=ieee

Martin’s orcid-feed tool outputs "CiteProc ready" JSON:
  * http://feed.labs.orcid-eu.org/0000-0003-1419-2405.json 

Tom created a bibtex->JSON tool using the bibtex from native ORCID API:
  * http://odinsprint.appspot.com/orcid/0000-0001-5635-1860 

### 4.3 Early conclusions

  * Doing styling on the client-side requires too much code. Simeon git citeproc-js working but the citeproc.js code is ~430kB which really is too large to import for rendering homepages and such. It is also quite slow to run. Conclusion is that it is better to approach the problem with server-side running of citeproc. Do first expt with completely rendered HTML output but perhaps would be better to have on JSON array with on entry per item so then easy to truncate list or select portion in JavaScript app?

  * Would be good to understand type on the server-side so that can be expressed in simple ways allowing selection and/or styling of articles/datasets/etc.
