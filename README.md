# ORCID Feed inclusion with JavaScript

*WARNING:* This is demo code created as part of a [codesprint](http://www.hackathon.io/projects/3233) for the [ODIN project](http://odin-project.eu/). I'm not a JavaScript programmer, it is not polished, and it relies upon demonstration feed processing services that may not remain available. Buyer beware!

## 1. Why?

FIXME - description of goals and process, from Mummi's notes. 

## 2. How to include

At the place on your web page where you would like to include your ORCID profile bibliography, include the following two lines:

```html
<div id="orcidbib">[Bibliography loads here]</div>
<script src="orcidbib.js" type="text/javascript" id="orcid:0000-0002-7970-7855"></script>
```

where the {{id}} attribute is the way that the individual's ORCID iD is passed in, prefixed with {{orcid:}}.

Optionally, the citation style may be added as another parameter, separated by a colon again. For example, to specify the {{ieee}} style, use:

```html
<div id="orcidbib">[Bibliography loads here]</div>
<script src="orcidbib.js" type="text/javascript" id="orcid:0000-0002-7970-7855"></script>
```

FIXME - link to styles

FIXME - description of use of orcidlive and Mummi/Martin's feeds

## 3. Concepts and processing

[ORCID](http://orcid.org) provides a simple and openly accessible API to get an individual's profile data, including works they have included, in various formats. For example, the HTML of my public profile is simply the full URL form of my ORCID:

  * [http://orcid.org/0000-0002-7970-7855](http://orcid.org/0000-0002-7970-7855)

To get the data behind this page you can access as:

```
$ curl -H 'Accept: application/orcid+xml' 'http://orcid.org/0000-0002-7970-7855/orcid-works' -L -i
```

ORCID aims to support scholars across all academic disciplines and there are a great many different citation styles used by different disciplines. There is considerable existing work on citation formatting and descriptions of the many formatting styles (see, for example the Wikipedia articles on [CiteProc](http://en.wikipedia.org/wiki/CiteProc) and [Citation Style Language](http://en.wikipedia.org/wiki/Citation_Style_Language)). We
thus chose to look at implementations of [CSL](http://citationstyles.org/) and found the JavaScript [citeproc-js](https://bitbucket.org/fbennett/citeproc-js) and the Ruby [citeproc-ruby](https://github.com/inukshuk/citeproc-ruby).

FIXME - tried in-broswer citeproc-js but big (430kB) and cumbersome, moved to server implementation extending [Martin Fenner's work on feeds](http://blog.martinfenner.org/2013/07/26/rss-feeds-for-scholarly-authors/)

FIXME - feeds implemented by Mummi and Roy, aim to build client with very simple config that can take either

