// 'use strict';

var retext = require('retext');
var nlcstToString = require('nlcst-to-string');
var english = require('retext-english');
var keywords = require('retext-keywords');
var unified = require('unified');
var stringify = require('retext-stringify');
var fs = require('fs');

let textutils = require(`./textutil.js`),
    Corpora = require(`./corpora.js`),
    // corpora = new Corpora().filter('corpus|prejudice'),
    // corpora = new Corpora().filter('finnegan|prejudice'),
    corpora = new Corpora().filter('moby|pride'),
    leven = require('leven'),
    timer = require('simple-timer');

console.log('sentencification starting');
timer.start('sentencify');

// can get errors if source is sufficiently large enough....
// HOWEVER: corpora CAN provide the sentences, so we have them, even from something so large?
// but we'd have to get the target parse to take in an array
let moby = unified().use(english).parse(corpora[0].text()),
    pride = unified().use(english).parse(corpora[1].text());

timer.stop('sentencify');
console.log(`sentencify took: ${timer.get('sentencify').delta}`);

let NO_LIMIT = -1;

function* limitedSentenceTree(cst, limit) {
  let i = 0;
  for(let child of cst.children) {
    if (child.type === 'ParagraphNode') {
      for(let pNode of child.children) {
        if (pNode.type === 'SentenceNode') {
          i++;
          if (i < limit || limit === NO_LIMIT) { yield pNode; } else { break; }
        }
      }
      if (i >= limit && limit !== NO_LIMIT) { break;}
    }
  }
};

function* treeSentences(cst) {
  for(let child of cst.children) {
    if (child.type === 'ParagraphNode') {
      for(let pNode of child.children) {
        if (pNode.type === 'SentenceNode') {yield retext().stringify(pNode);}
      }
    }
  }
};

// TODO: ideally, we want to _reconstruct_ the text, with all whitespaces from paras and between sentences
function* treeClosests(cst, limit, sentenceHandler, wsHandler) {
  let i = 0;
  // if (sentenceHandler === undefined) sentenceHandler =
  for(let paraOrWhite of cst.children) {
    if (paraOrWhite.type === 'ParagraphNode') {
      for(let sentOrWhite of paraOrWhite.children) {
        if (sentOrWhite.type === 'SentenceNode') {
          i++;
          if (i >= limit && limit !== NO_LIMIT) break;
          // console.log(`${i}: ${sentOrWhite.closest.sentence}`);
          if (sentOrWhite.closest) yield sentOrWhite.closest.sentence;
        } else if (sentOrWhite.type === 'WhiteSpaceNode') {
          // console.log(`${i} sentence whitespace`);
          yield retext().stringify(sentOrWhite);
        } else {
          console.log(`UNHANDLED NODE: ${sentOrWhite.type}:${JSON.stringify(sentOrWhite)}`);
        }
      }
    } else if (paraOrWhite.type === 'WhiteSpaceNode') {
      let text = retext().stringify(paraOrWhite);
      yield text + '\n';
    }
    if (i >= limit && limit !== NO_LIMIT) { break;}
  }
};

var closestSent = function(text, targSentence) {
  let closestLeven = -1,
      closestSent = '';
  for(let s of treeSentences(text)) {
    let distance = leven(targSentence, s);
    if (closestLeven === -1 || distance < closestLeven) {
      closestLeven = distance;
      closestSent = s;
    }
  }
  return { sentence: closestSent,
           distance: closestLeven
         };
};

let sourceText = pride, // text to reproduce
    closeText = moby; // closesst text from here

timer.start('closerify');

let sentenceLimit = -1,
    counter = 1;

var iter = limitedSentenceTree(sourceText, sentenceLimit),
    ticker = 0;
for(let s of iter) {
  let origSent = retext().stringify(s),
      closest = closestSent(closeText, origSent);
  s.closest = closest;
  if ((ticker++)%50 === 0) {
    console.log(`${ticker}: closerify took: ${timer.get('closerify').delta}\norig: ${origSent}\nclosest: ${JSON.stringify(closest,null,2)}`);
  }
}

timer.stop('closerify');
console.log(`closerify took: ${timer.get('closerify').delta} to map ${sentenceLimit} sentences`);

// fs.writeFileSync('dump.txt', JSON.stringify(sourceText, null, 2));

// TODO: this is "working" except for paragraph breaks. Hunh.
let iter2 = treeClosests(sourceText, sentenceLimit),
    blob = [],
    stream = fs.createWriteStream('almost.txt');
ticker = 0;

for(let s of iter2) {
  // console.log(`adding '${s}'`);
  // blob.push(s);
  stream.write(s);
  // ticker++;
  // if (ticker%50 === 0) {
  //   console.log(`ticker: ${ticker}`);
  // }
}

// console.log(`blob length: ${blob.length}`);
// console.log(JSON.stringify(blob, null, 2));

// console.log(blob.join(''));
