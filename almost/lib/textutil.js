'use strict';

// > var c = require('./defaultTexts.js')
// undefined
// > var util = require('./lib/textutil.js');
// undefined
// > var wf = util.wordfreqs(c[0].text)
// undefined
// > wf.slice(0,10).map(function(e) { return e.word;}).join(' ').toUpperCase()
// ' PICTURES ONE PAINTING GREAT PAINTED WORKS MADE PICTURE TIME'

var textutils = function() {

  var splitwords = function(text) {
    // handle possible contractions http://stackoverflow.com/questions/27715581/how-do-i-handle-contractions-with-regex-word-boundaries-in-javascript
    return text.match(/(?!'.*')\b[\w']+\b/g);
  };

  // TODO: drop this into textutils AND TEST IT
  // based on some code I saw in https://github.com/scotthammack/ebook_ebooks/blob/master/ebook_ebooks.py
  // I've contemplated a different version for years, which I should complete
  // that would add in the missing pieces.
  let cleaner = function(poem) {
    // a first implementation of a naive cleaner
    let plines = poem.split(`\n`),
        cleanlines = [];

    for(let i = 0, len = plines.length; i < len; i++) {
      let line = plines[i];

      line = line.replace(/_+/g, `_`);

      let leftbrackets = line.match(/\[/g),
          lbCount = (leftbrackets ? leftbrackets.length : 0),
          rightbrackets = line.match(/\]/g),
          rbCount = (rightbrackets ? rightbrackets.length : 0);

      if ((leftbrackets || rightbrackets) && lbCount !== rbCount) {
        line = line.replace(/[\[\]]/g, ``);
      }

      let leftparens = line.match(/\(/g),
          lpCount = (leftparens ? leftparens.length : 0),
          rightparens = line.match(/\)/g),
          rpCount = (rightparens ? rightparens.length : 0);

      if ((leftparens || rightparens) && lpCount !== rpCount) {
        line = line.replace(/[\(\)]/g, ``);
      }

      cleanlines.push(line);

    }

    return cleanlines.join(`\n`);
  };

  let sentencify = function(text) {
    // if array of texts, join 'em together
    if (Object.prototype.toString.call(text) === `[object Array]`) {
      text = text.reduce((p,c) => p + ` ` + c, ``).trim();
    }

    let debreak = require(`../lib/debreak.js`),
        nlp = require(`nlp_compromise`),
        t = debreak(text)
          .replace(/\t/g, ` `)
          .replace(/^ +/g, ``),
        s = nlp.text(t),
        sentences = s.sentences.map(s => s.str.trim());
    return sentences;
  };


  return { cleaner: cleaner,
           splitwords: splitwords,
           sentencify: sentencify
         };
};

module.exports = textutils();
