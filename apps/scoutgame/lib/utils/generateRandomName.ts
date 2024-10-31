const randomAnimalNames = [
  'Lion',
  'Giraffe',
  'Elephant',
  'Dolphin',
  'Koala',
  'Zebra',
  'Kangaroo',
  'Cheetah',
  'Gorilla',
  'Panda',
  'Wolf',
  'Shark',
  'Owl',
  'Crocodile',
  'Tiger',
  'Eagle',
  'Penguin',
  'Chimpanzee',
  'Rhino',
  'Jaguar',
  'Polar Bear',
  'Bat',
  'Falcon',
  'Sloth',
  'Whale',
  'Octopus',
  'Leopard',
  'Otter',
  'Hippo',
  'Bison',
  'Flamingo',
  'Porcupine',
  'Antelope',
  'Hyena',
  'Armadillo',
  'Squirrel',
  'Meerkat',
  'Fox',
  'Ocelot',
  'Turtle',
  'Pelican',
  'Raccoon',
  'Hedgehog',
  'Platypus',
  'Beaver',
  'Lynx',
  'Moose',
  'Skunk',
  'Lemur',
  'Rabbit'
];

const randomColorNames = [
  'Crimson',
  'Cerulean',
  'Emerald',
  'Lavender',
  'Charcoal',
  'Mustard',
  'Periwinkle',
  'Salmon',
  'Coral',
  'Turquoise',
  'Burgundy',
  'Fuchsia',
  'Olive',
  'Saffron',
  'Indigo',
  'Teal',
  'Magenta',
  'Mint',
  'Peach',
  'Maroon',
  'Aqua',
  'Amber',
  'Navy',
  'Blush',
  'Lilac',
  'Slate',
  'Rosewood',
  'Ivory',
  'Denim',
  'Plum',
  'Canary',
  'Mahogany',
  'Sage',
  'Rust',
  'Taupe',
  'Champagne',
  'Pistachio',
  'Jade',
  'Azure',
  'Copper',
  'Mauve',
  'Pearl',
  'Graphite',
  'Ruby',
  'Daffodil',
  'Topaz',
  'Cobalt',
  'Tangerine',
  'Amethyst',
  'Onyx'
];

export function generateRandomName() {
  const animal = randomAnimalNames[Math.floor(Math.random() * randomAnimalNames.length)];
  const color = randomColorNames[Math.floor(Math.random() * randomColorNames.length)];
  return `${color} ${animal}`;
}
