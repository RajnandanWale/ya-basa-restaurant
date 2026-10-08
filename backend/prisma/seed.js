import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// ==========================================
// MENU CATEGORIES
// ==========================================

const cats = [
  'Starters',
  'Seafood',
  'Crab',
  'Prawns',
  'Fish',
  'Chicken',
  'Mutton',
  'Vegetarian',
  'Rice & Biryani',
  'Thali',
  'Drinks',
  'Desserts'
];

// ==========================================
// MENU ITEMS
// ==========================================

const items = [
  [
    'Tandoori Crab',
    'Char-grilled crab marinated in coastal spices.',
    649,
    'Crab'
  ],
  [
    'Prawn Biryani',
    'Fragrant basmati rice with juicy prawns.',
    449,
    'Rice & Biryani'
  ],
  [
    'Malvani Fish Curry',
    'Traditional coconut-rich Malvani curry.',
    399,
    'Fish'
  ],
  [
    'Prawns Masala',
    'Succulent prawns in roasted masala.',
    469,
    'Prawns'
  ],
  [
    'Fish Fry',
    'Crispy coastal fish fry.',
    329,
    'Seafood'
  ],
  [
    'Sol Kadhi',
    'Kokum and coconut digestive.',
    129,
    'Drinks'
  ]
];

// ==========================================
// CREATE CATEGORIES
// ==========================================

for (const name of cats) {
  await prisma.menuCategory.upsert({
    where: {
      name
    },
    update: {},
    create: {
      name
    }
  });
}

// ==========================================
// CREATE / UPDATE MENU ITEMS
// ==========================================

for (const [
  name,
  description,
  price,
  category
] of items) {
  const c = await prisma.menuCategory.findUnique({
    where: {
      name: category
    }
  });

  if (!c) {
    console.log(`Category not found: ${category}`);
    continue;
  }

  const existing = await prisma.menuItem.findFirst({
    where: {
      name,
      categoryId: c.id
    }
  });

  if (existing) {
    await prisma.menuItem.update({
      where: {
        id: existing.id
      },
      data: {
        description,
        price,
        isBestseller: name === 'Tandoori Crab',
        isAvailable: true
      }
    });
  } else {
    await prisma.menuItem.create({
      data: {
        name,
        description,
        price,
        categoryId: c.id,
        isBestseller: name === 'Tandoori Crab',
        isAvailable: true
      }
    });
  }
}

// ==========================================
// RESTAURANT SETTINGS
// ==========================================

const settings =
  await prisma.restaurantSettings.findFirst();

if (settings) {
  await prisma.restaurantSettings.update({
    where: {
      id: settings.id
    },
    data: {
      phone: '7058485934'
    }
  });
} else {
  await prisma.restaurantSettings.create({
    data: {
      address:
        'Murkute Complex, 45, Baner DP Road, near Vijay Sales, Pallod Farms, Baner, Pune, Maharashtra 411069',
      phone: '7058485934'
    }
  });
}

// ==========================================
// CREATE ADMIN USER
// ==========================================

const adminEmail = 'admin@yabasa.com';
const adminPassword = 'Admin@123';

const passwordHash = await bcrypt.hash(
  adminPassword,
  12
);

const existingAdmin =
  await prisma.user.findUnique({
    where: {
      email: adminEmail
    }
  });

if (existingAdmin) {
  await prisma.user.update({
    where: {
      id: existingAdmin.id
    },
    data: {
      name: 'Ya Basa Admin',
      passwordHash,
      role: 'ADMIN'
    }
  });

  console.log('Admin user updated.');
} else {
  await prisma.user.create({
    data: {
      name: 'Ya Basa Admin',
      email: adminEmail,
      passwordHash,
      role: 'ADMIN'
    }
  });

  console.log('Admin user created.');
}

// ==========================================
// FINISH
// ==========================================

console.log('');
console.log('====================================');
console.log('Ya Basa Seed Complete');
console.log('====================================');
console.log(`Admin Email: ${adminEmail}`);
console.log(`Admin Password: ${adminPassword}`);
console.log('====================================');

await prisma.$disconnect();