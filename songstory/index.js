'use strict';

var tracery = require('tracery-grammar');

var grammar = tracery.createGrammar({
  'intro': ['Did you ever hear about the Princess who made friends with a real live #thing#?'],
  'thing': ['arm', 'tree', 'window', 'dishwasher', 'road', 'sign', 'leaf'],
  'animal': ['panda','fox','capybara','iguana'],
  'emotion': ['sad','happy','angry','jealous'],
  'origin':['I am #emotion.a# #animal#.'],
  'songstory': ['#intro#']
});

grammar.addModifiers(tracery.baseEngModifiers);

console.log(grammar.flatten('#songstory#'));
