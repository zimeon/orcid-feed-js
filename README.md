# ORCID Feed inclusion with JavaScript

*WARNING:* This is demo code created as part of a codesprint for the <a href="">ODIN project</a>. It is not polished and relies upon demonstration feed processing services that may not remain available.

## 1. Concepts and processing

[ORCID](http://orcid.org) provides a simple and openly accessible API to get an individual's profile data, including works they have included, in various formats. For example, the HTML of my public profile is simply the full URL form of my ORCID:

  * [http://orcid.org/0000-0002-7970-7855](http://orcid.org/0000-0002-7970-7855)

To get the data behind this page you can access as:

```
$ curl -H 'Accept: application/orcid+xml' 'http://orcid.org/0000-0002-7970-7855/orcid-works' -L -i
```

ORCID aims to support scholars across all academic disciplines and there are a great many different citation styles used by different disciplines. There is considerable existing work on citation formatting and 

## 2. How to include

At the place on your web page where you would like to include your ORCID profile bibliography, include the following to lines:

```javascript
<div id="orcidbib">[Bibliography loads here]</div>
<script src="orcidbib.js" type="text/javascript" id="orcid:0000-0002-7970-7855:nature:mt"></script>
```

