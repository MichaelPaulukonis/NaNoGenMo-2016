'use strict';

let textutils = require(`./textutil.js`),
    Corpora = require(`./corpora.js`),
    corpora = new Corpora().filter('moby|pride'),
    leven = require('leven'),
    mobySents = corpora[0].sentences(),
    prideSents = corpora[1].sentences();

console.log(corpora);

        // source = [{name: texts.reduce((p,c) => p + ` ` + c.name, ``),
        //            text: () => text,
        //            sentences: () => textutils.sentencify(text)
        //           }];

// DONE: pick two texts
// TODO: pick sentence in first
// TODO: find "close" sentences in second

let targSent = mobySents[20],
    closestLeven = -1,
    closestSent = '';

console.log(`target: ${targSent}`);

for (let i = 0, len = prideSents.length; i < len; i++) {
  var distance = leven(targSent, prideSents[i]);
  if (closestLeven === -1 || distance < closestLeven) {
    closestLeven = distance;
    closestSent = prideSents[i];
    console.log(`closest: ${closestLeven} text: ${closestSent}`);
  }
}
