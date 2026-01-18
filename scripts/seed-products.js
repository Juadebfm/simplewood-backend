const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/Product.models");
const User = require("../models/User.models");

dotenv.config();

const products = [
  {
    name: "Arc Lounge Chair",
    description:
      "Low-profile lounge chair with solid oak frame and linen upholstery.",
    price: 399.99,
    originalPrice: 499.99,
    category: "chairs",
    collections: "Arc Series",
    sku: "ARC-CHAIR-001",
    images: [
      {
        url: "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=1200&q=80",
        alt: "Oak lounge chair in a bright living room",
      },
    ],
    inStock: true,
    stockQuantity: 12,
    features: [
      "Solid oak frame",
      "Removable cushion cover",
      "Floor-safe felt pads",
    ],
    dimensions: {
      height: 32,
      width: 28,
      depth: 30,
      unit: "inches",
    },
    weight: {
      value: 24,
      unit: "lbs",
    },
    materials: ["Oak wood", "Linen fabric", "Foam cushioning"],
    careInstructions: "Spot clean with mild soap; avoid direct sunlight.",
  },
  {
    name: "Ridge Dining Table",
    description:
      "Six-seat dining table made from reclaimed wood with a matte finish.",
    price: 899.0,
    originalPrice: 1099.0,
    category: "tables",
    collections: "Ridge Series",
    sku: "RIDGE-TABLE-001",
    images: [
      {
        url: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=80",
        alt: "Reclaimed wood dining table with seating",
      },
    ],
    inStock: true,
    stockQuantity: 7,
    features: ["Reclaimed timber", "Seats six", "Protective sealant"],
    dimensions: {
      height: 30,
      width: 72,
      depth: 38,
      unit: "inches",
    },
    weight: {
      value: 110,
      unit: "lbs",
    },
    materials: ["Reclaimed wood", "Steel fasteners"],
    careInstructions: "Wipe with a dry cloth; use coasters for hot items.",
  },
  {
    name: "Harbor 3-Seat Sofa",
    description:
      "Deep-seat sofa with performance fabric and a kiln-dried frame.",
    price: 1299.0,
    originalPrice: 1499.0,
    category: "sofas",
    collections: "Harbor Series",
    sku: "HARBOR-SOFA-001",
    images: [
      {
        url: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
        alt: "Neutral toned three-seat sofa",
      },
    ],
    inStock: true,
    stockQuantity: 5,
    features: ["Kiln-dried hardwood", "Performance fabric", "Loose cushions"],
    dimensions: {
      height: 34,
      width: 84,
      depth: 36,
      unit: "inches",
    },
    weight: {
      value: 145,
      unit: "lbs",
    },
    materials: ["Hardwood", "Polyester blend", "Foam"],
    careInstructions: "Vacuum regularly; blot spills immediately.",
  },
  {
    name: "Moss Platform Bed (Queen)",
    description: "Minimalist platform bed with upholstered headboard.",
    price: 1099.0,
    originalPrice: 1299.0,
    category: "beds",
    collections: "Moss Series",
    sku: "MOSS-BED-001",
    images: [
      {
        url: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=80",
        alt: "Upholstered platform bed in a bright bedroom",
      },
    ],
    inStock: true,
    stockQuantity: 4,
    features: ["Padded headboard", "Solid slat system", "Low profile"],
    dimensions: {
      height: 40,
      width: 64,
      depth: 85,
      unit: "inches",
    },
    weight: {
      value: 120,
      unit: "lbs",
    },
    materials: ["Plywood", "Upholstery fabric", "Foam"],
    careInstructions: "Vacuum fabric weekly; spot clean as needed.",
  },
  {
    name: "Cove Storage Cabinet",
    description: "Compact storage cabinet with adjustable shelves.",
    price: 649.0,
    originalPrice: 749.0,
    category: "storage",
    collections: "Cove Series",
    sku: "COVE-STORAGE-001",
    images: [
      {
        url: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
        alt: "Wood storage cabinet against a wall",
      },
    ],
    inStock: true,
    stockQuantity: 9,
    features: ["Adjustable shelves", "Soft-close doors", "Cable cutout"],
    dimensions: {
      height: 34,
      width: 42,
      depth: 18,
      unit: "inches",
    },
    weight: {
      value: 68,
      unit: "lbs",
    },
    materials: ["Walnut veneer", "Steel hardware"],
    careInstructions: "Dust with a microfiber cloth; avoid harsh cleaners.",
  },
  {
    name: "Orbit Pendant Light",
    description: "Matte black pendant light with warm brass accents.",
    price: 189.0,
    originalPrice: 249.0,
    category: "lighting",
    collections: "Orbit Series",
    sku: "ORBIT-LIGHT-001",
    images: [
      {
        url: "https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=1200&q=80",
        alt: "Minimal pendant light over a table",
      },
    ],
    inStock: true,
    stockQuantity: 15,
    features: ["Dimmable", "E26 base", "Adjustable cord length"],
    dimensions: {
      height: 12,
      width: 12,
      depth: 12,
      unit: "inches",
    },
    weight: {
      value: 6,
      unit: "lbs",
    },
    materials: ["Steel", "Brass"],
    careInstructions: "Turn off power before cleaning; wipe with dry cloth.",
  },
  {
    name: "Slate Wall Mirror",
    description: "Rounded wall mirror with a slim metal frame.",
    price: 159.0,
    originalPrice: 199.0,
    category: "decor",
    collections: "Slate Series",
    sku: "SLATE-DECOR-001",
    images: [
      {
        url: "https://images.unsplash.com/photo-1472224371017-08207f84aaae?auto=format&fit=crop&w=1200&q=80",
        alt: "Round wall mirror above a console table",
      },
    ],
    inStock: true,
    stockQuantity: 20,
    features: ["Metal frame", "Wall anchor kit", "Portrait or landscape mount"],
    dimensions: {
      height: 36,
      width: 36,
      depth: 2,
      unit: "inches",
    },
    weight: {
      value: 14,
      unit: "lbs",
    },
    materials: ["Glass", "Powder-coated steel"],
    careInstructions: "Clean glass with a lint-free cloth and cleaner.",
  },
  {
    name: "Kite Side Table",
    description: "Compact side table with triangular legs and a smooth top.",
    price: 229.0,
    originalPrice: 279.0,
    category: "tables",
    collections: "Kite Series",
    sku: "KITE-TABLE-001",
    images: [
      {
        url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
        alt: "Side table beside a sofa",
      },
    ],
    inStock: true,
    stockQuantity: 11,
    features: ["Compact footprint", "Scratch-resistant top", "Easy assembly"],
    dimensions: {
      height: 22,
      width: 18,
      depth: 18,
      unit: "inches",
    },
    weight: {
      value: 14,
      unit: "lbs",
    },
    materials: ["Ash wood", "Water-based finish"],
    careInstructions: "Wipe clean with a damp cloth; dry immediately.",
  },
  {
    name: "Fold Entry Bench",
    description: "Slim entry bench with a lower shelf for storage.",
    price: 249.0,
    originalPrice: 319.0,
    category: "chairs",
    collections: "Fold Series",
    sku: "FOLD-BENCH-001",
    images: [
      {
        url: "https://images.unsplash.com/photo-1475856034137-6bce9f17930c?auto=format&fit=crop&w=1200&q=80",
        alt: "Wood bench in a hallway",
      },
    ],
    inStock: false,
    stockQuantity: 0,
    features: ["Lower storage shelf", "Reinforced joints", "Easy to move"],
    dimensions: {
      height: 18,
      width: 42,
      depth: 15,
      unit: "inches",
    },
    weight: {
      value: 22,
      unit: "lbs",
    },
    materials: ["Pine wood", "Matte lacquer"],
    careInstructions: "Keep dry; avoid prolonged moisture exposure.",
  },
  {
    name: "Drift Nightstand",
    description: "Two-drawer nightstand with soft-close runners.",
    price: 329.0,
    originalPrice: 389.0,
    category: "storage",
    collections: "Drift Series",
    sku: "DRIFT-NIGHT-001",
    images: [
      {
        url: "https://images.unsplash.com/photo-1469796466635-455ede028aca?auto=format&fit=crop&w=1200&q=80",
        alt: "Minimal nightstand with drawers",
      },
    ],
    inStock: true,
    stockQuantity: 8,
    features: ["Soft-close drawers", "Integrated pulls", "Anti-tip kit"],
    dimensions: {
      height: 24,
      width: 20,
      depth: 16,
      unit: "inches",
    },
    weight: {
      value: 32,
      unit: "lbs",
    },
    materials: ["Oak veneer", "Steel runners"],
    careInstructions: "Use a soft cloth; avoid abrasive cleaners.",
  },
];

const ensureSeedUser = async () => {
  const seedEmail = process.env.SEED_USER_EMAIL;
  const seedName = process.env.SEED_USER_NAME || "Seed User";
  const seedPassword = process.env.SEED_USER_PASSWORD || "SeedPassword123!";

  if (seedEmail) {
    const existing = await User.findOne({ email: seedEmail });
    if (existing) return existing;

    return User.create({
      name: seedName,
      email: seedEmail,
      password: seedPassword,
    });
  }

  const firstUser = await User.findOne().sort({ createdAt: 1 });
  if (firstUser) return firstUser;

  return User.create({
    name: seedName,
    email: "seed@example.com",
    password: seedPassword,
  });
};

const run = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set.");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const user = await ensureSeedUser();
  const operations = products.map((product) => ({
    updateOne: {
      filter: { sku: product.sku },
      update: {
        $set: {
          ...product,
          createdBy: user._id,
        },
      },
      upsert: true,
    },
  }));

  const result = await Product.bulkWrite(operations);
  const totalUpserted = Object.keys(result.upsertedIds || {}).length;
  console.log(
    `Seed complete. Upserted: ${totalUpserted}, matched: ${result.matchedCount}, modified: ${result.modifiedCount}`
  );

  await mongoose.disconnect();
};

run().catch((error) => {
  console.error("Seeding failed:", error.message);
  process.exitCode = 1;
});
