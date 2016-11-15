'use strict';

var pick = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

var tracery = require('tracery-grammar');

var grammar = tracery.createGrammar({
  'intro': ['Did you ever hear about the Princess who made friends with a real live #friend#? Their names were #princessName# and #friendName#. The #friend#\'s name was #friendName# and the Princess\'s name was #princessName#.'],

  'thing': ['arm', 'tree', 'window', 'dishwasher', 'road', 'sign', 'leaf'],
  'name': ['Amanda', 'Anna', 'Annabelle', 'Amy', 'Ayumi', 'Sarah', 'Wheetabix', 'Hannukah', 'Diamonds', 'Ice Skate'],

  'dayend': ['Finally, the day was done. #dayclose#'],
  'dayclose': ['And they had a sleepover!', 'And they had a campout!', 'So they both went home.'],

  // TODO: code-generation of repetition of events
  // eg, joke, joke, hide-n-seek, butterfiled, hide-n-seek, joke, etc.
  'ngames': new Array(10).fill().map((x, i) => new Array(i+1).fill('#gameplay#').join('')),
  // TODO: a picnic
  // TODO: dinner with parents
  'gameplay': ['#games#'],
  'games': ['#hide-and-seek#', '#tellingjokes#', '#catchingButterflies#'],// 'twenty questions'

  'hide-and-seek': ['And they played hide-and-seek.\n\n#princessName# said "First you hide, then I\'ll find you!" "Okay!" said #friendName#.\n\n'],

  'tellingjokes': ['And they decided to tell jokes jokes.\n\n#joketype#'],
  'joketype': ['#njokes#', '#[monster:#knockknockmonster#][#kkteller#]knockknock#'],
  'njokes': ['#joke#','#joke##joke#','#joke##joke##joke#','#joke##joke##joke##joke#','#joke##joke##joke##joke##joke#'],
  'joke': ['#friendName# told a joke. "Ha-hah-hah!" said #princessName#.\n\n', '#princessName# told a joke. "Ha-hah-hah!" said #friendName#.\n\n'],

  'kkteller': ['[Q:#princessName#][A:#friendName#]', '[Q:#friendName#][A:#princessName#]'],
  // TODO: banana joke, annoying animal [s/b interrupting, but it got mangled]
  // see also: http://shortestjokes.blogspot.com/2013/05/top-100-knock-knock-jokes.html
  'knockknock': ['#Q#: Knock-knock!\n#A#: Who\'s there?\n#Q#: #monster.capitalize#.\n#A#: #monster.capitalize# who?\n#Q#: Lovable #monster#!\n\n',
                 '#Q#: Knock-knock!\n#A#: Who\'s there?\n#Q#: (makes a raspberry noise).\n#A#: (makes a raspberry noise) who?\n#Q#: There\'s a fart at your door!\n\n',
                '#Q#: Knock-knock!\n#A#: Who\'s there?\n#Q#: Boo.\n#A#: Boo who?\n#Q#: Why are you crying, dearie?\n\n'],
  'knockknockmonster': ['Frankenstein', 'werewolf', 'zombie', 'skeleton'],

  'catchingButterflies': ['And they went to the garden to catch butterflies.\n\n#nbutterflies#That was fun!\n\n'],
  'nbutterflies': new Array(10).fill().map((x, i) => new Array(i+1).fill('#butterflies#').join('')),
  'butterflies': ['#princessName# caught #color.hyphenize.a# butterfly. #friendName# caught #color.hyphenize.a# butterfly.\n\n',
'#friendName# caught #color.hyphenize.a# butterfly. #princessName# caught #color.hyphenize.a# butterfly.\n\n'],
  'color': ["Almond", "Antique Brass", "Apricot", "Aquamarine", "Asparagus", "Atomic Tangerine", "Banana Mania", "Beaver", "Bittersweet", "Black", "Blue", "Blue Bell", "Blue Green", "Blue Violet", "Blush", "Brick Red", "Brown", "Burnt Orange", "Burnt Sienna", "Cadet Blue", "Canary", "Caribbean Green", "Carnation Pink", "Cerise", "Cerulean", "Chestnut", "Copper", "Cornflower", "Cotton Candy", "Dandelion", "Denim", "Desert Sand", "Eggplant", "Electric Lime", "Fern", "Forest Green", "Fuchsia", "Fuzzy Wuzzy", "Gold", "Goldenrod", "Granny Smith Apple", "Gray", "Green", "Green Yellow", "Hot Magenta", "Inchworm", "Indigo", "Jazzberry Jam", "Jungle Green", "Laser Lemon", "Lavender", "Macaroni and Cheese", "Magenta", "Mahogany", "Manatee", "Mango Tango", "Maroon", "Mauvelous", "Melon", "Midnight Blue", "Mountain Meadow", "Navy Blue", "Neon Carrot", "Olive Green", "Orange", "Orchid", "Outer Space", "Outrageous Orange", "Pacific Blue", "Peach", "Periwinkle", "Piggy Pink", "Pine Green", "Pink Flamingo", "Pink Sherbert", "Plum", "Purple Heart", "Purple Mountain's Majesty", "Purple Pizzazz", "Radical Red", "Raw Sienna", "Razzle Dazzle Rose", "Razzmatazz", "Red", "Red Orange", "Red Violet", "Robin's Egg Blue", "Royal Purple", "Salmon", "Scarlet", "Screamin' Green", "Sea Green", "Sepia", "Shadow", "Shamrock", "Shocking Pink", "Silver", "Sky Blue", "Spring Green", "Sunglow", "Sunset Orange", "Tan", "Tickle Me Pink", "Timberwolf", "Tropical Rain Forest", "Tumbleweed", "Turquoise Blue", "Unmellow Yellow", "Violet", "Violet Red", "Vivid Tangerine", "Vivid Violet", "White", "Wild Blue Yonder", "Wild Strawberry", "Wild Watermelon", "Wisteria", "Yellow", "Yellow Green", "Yellow Orange"],

  'wrapper': ['#[friend:#thing#][friendName:#name#][princessName:#name#][game:#games#]songstory#'],
  'songstory': ['#intro#\n\n#ngames##dayend#']
});

grammar.addModifiers(tracery.baseEngModifiers);
var customMods = {
  hyphenize: (s) => s.replace(/\s/g, `-`),
  repeat: (s,n) => {console.log(`${n}:${s}`); return new Array(parseInt(n,10)).fill(s).join(' '); }
};
grammar.addModifiers(customMods);

console.log(grammar.flatten('#wrapper#'));
