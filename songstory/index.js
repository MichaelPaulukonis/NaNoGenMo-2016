'use strict';

var tracery = require('tracery-grammar');

var grammar = tracery.createGrammar({
  'intro': ['Did you ever hear about the Princess who made friends with a real live #friend#? The #friend#\'s name was #friendName# and the Princess\'s name was #princessName#.'],
  'gameplay': ['They decided to play a game.\n\n#game#'],
  'dayend': ['Finally, the day was done. #dayclose#'],
  'dayclose': ['And they had a sleepover!', 'So they both went home.'],
  'thing': ['arm', 'tree', 'window', 'dishwasher', 'road', 'sign', 'leaf'],
  'name': ['Amanda', 'Anna', 'Annabelle', 'Amy', 'Ayumi', 'Sarah', 'Wheetabix', 'Hannukah'],
  'games': ['#hide-and-seek#', '#tellingjokes#'],// 'butterfly-catching', 'twenty questions', 'telling jokes'],
  'hide-and-seek': ['The decided to play hide-and-seek.\n\n#princessName# said "First you hide, then I\'ll find you!" "Okay!" said #friendName#.'],
  'tellingjokes': ['The decided to tell jokes.\n\n#njokes#'],
  'njokes': ['#joke#', '#joke##joke#', '#joke##joke##joke#'],
  'joke': ['#friendName# told a joke. "Ha-hah-hah!" said #princessName#.\n\n', '#princessName# told a joke. "Ha-hah-hah!" said #friendName#.\n\n'],
  'wrapper': ['#[friend:#thing#][friendName:#name#][princessName:#name#][game:#games#]songstory#'],
  'songstory': ['#intro#\n\n#gameplay##dayend#']
});

grammar.addModifiers(tracery.baseEngModifiers);

console.log(grammar.flatten('#wrapper#'));
