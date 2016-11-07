'use strict';

let textutils = require(`./textutil.js`),
    Corpora = require(`./corpora.js`),
    corpora = new Corpora().filter('moby|pride'),
    leven = require('leven'),
    timer = require('simple-timer');

timer.start('sentencify');

    // takes a long time to parse to sentences; might want to store these
let mobySents = corpora[0].sentences(),
    prideSents = corpora[1].sentences();

timer.stop('sentencify');
console.log(`sentencify took: ${timer.get('sentencify').delta}`);

console.log(corpora);

// source = [{name: texts.reduce((p,c) => p + ` ` + c.name, ``),
//            text: () => text,
//            sentences: () => textutils.sentencify(text)
//           }];

// DONE: pick two texts
// TODO: pick sentence in first
// TODO: find "close" sentences in second

let sourceText = prideSents,
    closeText = mobySents,
    newText = [],
    data = [];
// TODO: capture original, replacement, and distance
// then we can see what is the closest, furthest, etc.

timer.start('novelize');

// for (let sent = 0, textLen = sourceText.length; sent < textLen; sent++) {
for (let sent = 0, textLen = 10; sent < textLen; sent++) {

  let targSent = sourceText[sent],
      closestLeven = -1,
      closestSent = '';

  // console.log(`target: ${targSent}`);

  for (let i = 0, len = closeText.length; i < len; i++) {
    var distance = leven(targSent, closeText[i]);
    if (closestLeven === -1 || distance < closestLeven) {
      closestLeven = distance;
      closestSent = closeText[i];
    }
  }

  // console.log(`closest: ${closestLeven} text: ${closestSent}`);

  newText.push(closestSent);
  data.push({ source: targSent, distance: closestLeven, close: closestSent});

}

timer.stop('novelize');
console.log(`novelize took: ${timer.get('novelize').delta}`);

var fs = require('fs');

fs.writeFileSync('out.txt', JSON.stringify(data, null, 2));
