/**
 * Swad Restaurant - Initial Sample Data
 * Realistic ingredients, menu items, and waste logs
 */

const TODAY = new Date().toISOString().split('T')[0];

function getDateOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

const INITIAL_INVENTORY = [
  {
    id: "inv-1",
    name: "Basmati Rice (Royal Feast)",
    category: "Grains & Staples",
    quantity: 28,
    unit: "kg",
    minStock: 12,
    costPerUnit: 85,
    expiryDate: getDateOffset(120),
    notes: "For Biryani, Pulao and Steamed Rice"
  },
  {
    id: "inv-2",
    name: "Fresh Malai Paneer",
    category: "Dairy",
    quantity: 3.5,
    unit: "kg",
    minStock: 6,
    costPerUnit: 340,
    expiryDate: getDateOffset(2), // Near expiry & low stock!
    notes: "High turnover ingredient, refrigerated at 4°C"
  },
  {
    id: "inv-3",
    name: "Full Cream Dairy Milk",
    category: "Dairy",
    quantity: 2.0,
    unit: "L",
    minStock: 8,
    costPerUnit: 68,
    expiryDate: getDateOffset(-2), // Expired!
    notes: "Used for tea, coffee, gravies, desserts"
  },
  {
    id: "inv-4",
    name: "Chakki Fresh Atta (Flour)",
    category: "Grains & Staples",
    quantity: 42,
    unit: "kg",
    minStock: 20,
    costPerUnit: 44,
    expiryDate: getDateOffset(75),
    notes: "For Tandoori Roti, Naan and Parathas"
  },
  {
    id: "inv-5",
    name: "Farm Fresh Hybrid Tomatoes",
    category: "Vegetables",
    quantity: 11,
    unit: "kg",
    minStock: 15,
    costPerUnit: 35,
    expiryDate: getDateOffset(3), // Low stock & near expiry
    notes: "Base for Makhani and Masala gravies"
  },
  {
    id: "inv-6",
    name: "Pahadi Aloo (Potatoes)",
    category: "Vegetables",
    quantity: 45,
    unit: "kg",
    minStock: 20,
    costPerUnit: 28,
    expiryDate: getDateOffset(30),
    notes: "Cool dry storage, for Dosa filling & Samosas"
  },
  {
    id: "inv-7",
    name: "Refined Sunflower Cooking Oil",
    category: "Oils & Spices",
    quantity: 24,
    unit: "L",
    minStock: 12,
    costPerUnit: 145,
    expiryDate: getDateOffset(180),
    notes: "For deep frying and tempering"
  },
  {
    id: "inv-8",
    name: "Shahi Garam Masala Blend",
    category: "Oils & Spices",
    quantity: 2.5,
    unit: "kg",
    minStock: 1.0,
    costPerUnit: 650,
    expiryDate: getDateOffset(150),
    notes: "Aromatic restaurant secret spice mix"
  },
  {
    id: "inv-9",
    name: "Nashik Red Onions",
    category: "Vegetables",
    quantity: 8,
    unit: "kg",
    minStock: 20,
    costPerUnit: 42,
    expiryDate: getDateOffset(18), // Low Stock!
    notes: "High daily usage for gravies and salads"
  },
  {
    id: "inv-10",
    name: "Salted Cooking Butter (Amul)",
    category: "Dairy",
    quantity: 5,
    unit: "kg",
    minStock: 4,
    costPerUnit: 520,
    expiryDate: getDateOffset(45),
    notes: "For Butter Naan, Paneer Butter Masala"
  },
  {
    id: "inv-11",
    name: "Rich Cooking Cream",
    category: "Dairy",
    quantity: 1.2,
    unit: "L",
    minStock: 3.0,
    costPerUnit: 240,
    expiryDate: getDateOffset(4), // Low stock & near expiry
    notes: "For finishing gravies and rich curries"
  },
  {
    id: "inv-12",
    name: "Thick Natural Dahi (Yoghurt)",
    category: "Dairy",
    quantity: 2.5,
    unit: "kg",
    minStock: 5.0,
    costPerUnit: 65,
    expiryDate: getDateOffset(-4), // Expired!
    notes: "For Raita, Lassi, Biryani marinade"
  },
  {
    id: "inv-13",
    name: "Toor Dal (Pigeon Pea)",
    category: "Grains & Staples",
    quantity: 16,
    unit: "kg",
    minStock: 8,
    costPerUnit: 160,
    expiryDate: getDateOffset(150),
    notes: "For Dal Tadka and Dal Fry"
  },
  {
    id: "inv-14",
    name: "Fresh Green Coriander & Mint",
    category: "Vegetables",
    quantity: 0.8,
    unit: "kg",
    minStock: 1.5,
    costPerUnit: 90,
    expiryDate: getDateOffset(1), // Near expiry & low stock
    notes: "Perishable garnish and green chutney"
  }
];

const INITIAL_MENU = [
  {
    id: "menu-1",
    name: "Paneer Butter Masala",
    category: "Main Course",
    price: 280,
    isAvailable: true,
    description: "Cubes of soft paneer simmered in a rich, velvety tomato, butter, and cashew gravy infused with fenugreek.",
    ingredients: ["Fresh Malai Paneer", "Tomatoes", "Salted Cooking Butter", "Rich Cooking Cream"],
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
    fallbackImage: "assets/paneer_butter_masala.svg"
  },
  {
    id: "menu-2",
    name: "Hyderabadi Veg Dum Biryani",
    category: "Main Course",
    price: 240,
    isAvailable: true,
    description: "Fragrant long-grain basmati rice layered with spiced garden vegetables, saffron milk, and slow cooked in sealed pot.",
    ingredients: ["Basmati Rice", "Vegetables", "Shahi Garam Masala", "Thick Natural Dahi"],
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
    fallbackImage: "assets/veg_biryani.svg"
  },
  {
    id: "menu-3",
    name: "Mysore Masala Dosa",
    category: "Starters",
    price: 130,
    isAvailable: true,
    description: "Crispy fermented rice and lentil crepe smeared with spicy red chutney and stuffed with seasoned potato mash.",
    ingredients: ["Pahadi Aloo", "Refined Sunflower Oil", "Spices", "Onions"],
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80",
    fallbackImage: "assets/masala_dosa.svg"
  },
  {
    id: "menu-4",
    name: "Tandoori Butter Naan",
    category: "Breads",
    price: 45,
    isAvailable: true,
    description: "Traditional clay-oven baked leavened bread brushed with melted butter and charred garlic flakes.",
    ingredients: ["Chakki Fresh Atta", "Salted Cooking Butter", "Milk"],
    image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80",
    fallbackImage: "assets/butter_naan.svg"
  },
  {
    id: "menu-5",
    name: "Dhaba Style Dal Tadka",
    category: "Main Course",
    price: 190,
    isAvailable: true,
    description: "Yellow toor lentils tempered with cumin seeds, garlic, dried red chillies, and freshly chopped tomatoes in desi ghee.",
    ingredients: ["Toor Dal", "Nashik Red Onions", "Tomatoes", "Spices"],
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80",
    fallbackImage: "assets/dal_tadka.svg"
  },
  {
    id: "menu-6",
    name: "Royal Swad Veg Thali",
    category: "Main Course",
    price: 330,
    isAvailable: true,
    description: "Deluxe dining platter with Paneer curry, Dal Tadka, Veg Biryani, 2 Butter Naans, Raita, Salad, and Gulab Jamun.",
    ingredients: ["Basmati Rice", "Paneer", "Dal", "Flour", "Butter"],
    image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80",
    fallbackImage: "assets/veg_thali.svg"
  },
  {
    id: "menu-7",
    name: "Crispy Paneer Pakora",
    category: "Starters",
    price: 180,
    isAvailable: true,
    description: "Golden fried batter-coated cottage cheese fritters spiced with chaat masala, served with mint chutney.",
    ingredients: ["Fresh Malai Paneer", "Refined Sunflower Oil", "Spices"],
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
    fallbackImage: "assets/paneer_pakora.svg"
  },
  {
    id: "menu-8",
    name: "Amritsari Kulcha",
    category: "Breads",
    price: 70,
    isAvailable: true,
    description: "Crispy stuffed leavened flatbread with seasoned potato and crushed coriander seeds baked in tandoor.",
    ingredients: ["Chakki Fresh Atta", "Pahadi Aloo", "Butter"],
    image: "https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&w=800&q=80",
    fallbackImage: "assets/kulcha.svg"
  },
  {
    id: "menu-9",
    name: "Kesar Mango Lassi",
    category: "Beverages",
    price: 90,
    isAvailable: true,
    description: "Thick chilled creamy churned yoghurt drink infused with Alphonso mango pulp and saffron strands.",
    ingredients: ["Thick Natural Dahi", "Milk", "Sugar"],
    image: "https://images.unsplash.com/photo-1571006682878-1f5a544d6db8?auto=format&fit=crop&w=800&q=80",
    fallbackImage: "assets/mango_lassi.svg"
  },
  {
    id: "menu-10",
    name: "Warm Gulab Jamun (2 Pcs)",
    category: "Desserts",
    price: 85,
    isAvailable: true,
    description: "Golden fried milk dumplings soaked in aromatic cardamom and rosewater sugar syrup.",
    ingredients: ["Milk", "Flour", "Refined Sunflower Oil", "Sugar"],
    image: "https://images.unsplash.com/photo-1593701461250-d7b22dfd3a77?auto=format&fit=crop&w=800&q=80",
    fallbackImage: "assets/gulab_jamun.svg"
  }
];

const INITIAL_WASTE = [
  {
    id: "w-1",
    productName: "Full Cream Dairy Milk",
    category: "Dairy",
    quantity: 2.0,
    unit: "L",
    reason: "Spoilage",
    date: getDateOffset(-2),
    estimatedLoss: 136,
    notes: "Refrigerator temperature spike overnight"
  },
  {
    id: "w-2",
    productName: "Thick Natural Dahi (Yoghurt)",
    category: "Dairy",
    quantity: 2.5,
    unit: "kg",
    reason: "Overstocking",
    date: getDateOffset(-3),
    estimatedLoss: 162.5,
    notes: "Weekday footfall lower than projected weekend batch"
  },
  {
    id: "w-3",
    productName: "Farm Fresh Hybrid Tomatoes",
    category: "Vegetables",
    quantity: 4.0,
    unit: "kg",
    reason: "Improper Storage",
    date: getDateOffset(-5),
    estimatedLoss: 140,
    notes: "Bottom crate bruised during transit"
  },
  {
    id: "w-4",
    productName: "Basmati Rice (Prepared Batch)",
    category: "Unsold Food",
    quantity: 3.2,
    unit: "kg",
    reason: "Unsold Food",
    date: getDateOffset(-6),
    estimatedLoss: 272,
    notes: "End-of-day excess cooked buffet rice"
  },
  {
    id: "w-5",
    productName: "Naan Dough Batch",
    category: "Grains & Staples",
    quantity: 2.0,
    unit: "kg",
    reason: "Preparation Spill",
    date: getDateOffset(-8),
    estimatedLoss: 88,
    notes: "Over-fermented due to warm kitchen ambient temp"
  }
];
