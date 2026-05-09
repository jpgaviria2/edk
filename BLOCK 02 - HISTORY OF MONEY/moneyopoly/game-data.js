window.MONEYOPOLY_DATA = {
  resources: {
    mangoes: { label: 'Mangoes', icon: '🥭', category: 'food' },
    cows: { label: 'Cows', icon: '🐄', category: 'food' },
    water: { label: 'Water', icon: '💧', category: 'water' },
    fish: { label: 'Fish', icon: '🐟', category: 'food' },
    shells: { label: 'Shells', icon: '🐚', category: 'money' },
    shelter: { label: 'Shelter', icon: '🏠', category: 'shelter' }
  },
  players: [
    {
      id: 'maya',
      name: 'Maya',
      role: 'Mango farmer',
      icon: '🥭',
      inventory: { mangoes: 8, cows: 1, water: 1, fish: 0, shells: 0, shelter: 0 },
      wants: ['shelter', 'water'],
      survival: { mangoes: 1, water: 1, shelter: 1 }
    },
    {
      id: 'cora',
      name: 'Cora',
      role: 'Cattle herder',
      icon: '🐄',
      inventory: { mangoes: 1, cows: 7, water: 0, fish: 0, shells: 0, shelter: 1 },
      wants: ['water', 'mangoes'],
      survival: { cows: 1, water: 1, shelter: 1 }
    },
    {
      id: 'Wes',
      name: 'Wes',
      role: 'Water keeper',
      icon: '💧',
      inventory: { mangoes: 1, cows: 0, water: 8, fish: 1, shells: 0, shelter: 0 },
      wants: ['cows', 'shelter'],
      survival: { mangoes: 1, water: 1, shelter: 1 }
    },
    {
      id: 'Bina',
      name: 'Bina',
      role: 'Builder',
      icon: '🏠',
      inventory: { mangoes: 0, cows: 1, water: 1, fish: 0, shells: 0, shelter: 7 },
      wants: ['mangoes', 'water'],
      survival: { cows: 1, water: 1, shelter: 1 }
    }
  ],
  events: [
    {
      title: 'Flood hits the lowlands',
      icon: '🌊',
      description: 'Shelter is damaged. Builders become more important, but some stored goods are lost.',
      effects: [{ resource: 'shelter', delta: -1 }, { resource: 'mangoes', delta: -1 }]
    },
    {
      title: 'Drought dries the river',
      icon: '☀️',
      description: 'Water gets scarce. Everyone suddenly wants the same good.',
      effects: [{ resource: 'water', delta: -1 }]
    },
    {
      title: 'Pests attack the fruit trees',
      icon: '🐛',
      description: 'Mangoes spoil. Perishable wealth is not perfect savings.',
      effects: [{ resource: 'mangoes', delta: -2 }]
    },
    {
      title: 'Cattle sickness spreads',
      icon: '🦠',
      description: 'Cows are valuable, but they are living goods with storage risk.',
      effects: [{ resource: 'cows', delta: -1 }]
    }
  ],
  board: ['Village', 'River', 'Farm', 'Pasture', 'Workshop', 'Market', 'Forest', 'Hill']
};
