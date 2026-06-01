export interface ProductPhoto {
  id: string
  color: string
}

export interface Product {
  id: string
  name: string
  sku: string
  tags: string[]
  price: number
  is_active: boolean
  thumbnail_color: string
  initials: string
  description?: string
  category?: string
  is_live: boolean
  photos: ProductPhoto[]
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Ankara Midi Dress",
    sku: "AMD-001",
    tags: ["dress", "ankara"],
    price: 12500,
    is_active: true,
    thumbnail_color: "#7C2D5E",
    initials: "AM",
    description:
      "Hand-tailored midi dress in vibrant Ankara fabric. Cap sleeves, fitted waist. Available in multiple prints.",
    category: "Fashion",
    is_live: true,
    photos: [
      { id: "p1-a", color: "#7C2D5E" },
      { id: "p1-b", color: "#5C3B7E" },
    ],
  },
  {
    id: "2",
    name: "Senator Kaftan",
    sku: "SK-002",
    tags: ["kaftan", "men"],
    price: 18000,
    is_active: true,
    thumbnail_color: "#1F4D7A",
    initials: "SK",
    description: "Classic Nigerian senator kaftan, cotton blend. Tailored fit with embroidered collar.",
    category: "Fashion",
    is_live: true,
    photos: [{ id: "p2-a", color: "#1F4D7A" }],
  },
  {
    id: "3",
    name: "Lace Gown",
    sku: "LG-003",
    tags: ["gown", "lace"],
    price: 25000,
    is_active: true,
    thumbnail_color: "#5C3B7E",
    initials: "LG",
    description: "Floor-length lace gown for special occasions. Lined throughout, hand-finished.",
    category: "Fashion",
    is_live: true,
    photos: [
      { id: "p3-a", color: "#5C3B7E" },
      { id: "p3-b", color: "#7C2D5E" },
    ],
  },
  {
    id: "4",
    name: "Agbada Set",
    sku: "AS-004",
    tags: ["set", "formal"],
    price: 45000,
    is_active: true,
    thumbnail_color: "#7A4419",
    initials: "AS",
    description: "Premium three-piece agbada set for formal occasions. Embroidered accents.",
    category: "Fashion",
    is_live: true,
    photos: [
      { id: "p4-a", color: "#7A4419" },
      { id: "p4-b", color: "#1F4D7A" },
      { id: "p4-c", color: "#2A6E54" },
    ],
  },
  {
    id: "5",
    name: "Gele Headwrap",
    sku: "GH-005",
    tags: ["accessory"],
    price: 4500,
    is_active: true,
    thumbnail_color: "#2A6E54",
    initials: "GH",
    description: "Stiff fabric headwrap. Easy to shape, holds its form.",
    category: "Accessories",
    is_live: true,
    photos: [{ id: "p5-a", color: "#2A6E54" }],
  },
  {
    id: "6",
    name: "Vintage Sandal",
    sku: "VS-099",
    tags: ["shoe"],
    price: 8000,
    is_active: false,
    thumbnail_color: "#3A3D44",
    initials: "VS",
    description: "Discontinued style. No longer available for order.",
    category: "Footwear",
    is_live: false,
    photos: [{ id: "p6-a", color: "#3A3D44" }],
  },

  { id: "7", name: "Adire Boubou", sku: "AB-006", tags: ["dress", "casual"], price: 9500, is_active: true, thumbnail_color: "#7C2D5E", initials: "AB", description: "Tie-dye Adire fabric boubou. Loose silhouette, easy fit.", category: "Fashion", is_live: true, photos: [{ id: "p7-a", color: "#7C2D5E" }] },
  { id: "8", name: "Kente Wrapper", sku: "KW-007", tags: ["accessory", "occasion"], price: 15500, is_active: true, thumbnail_color: "#1F4D7A", initials: "KW", description: "Authentic Kente cloth wrapper. Suitable for traditional ceremonies.", category: "Accessories", is_live: true, photos: [{ id: "p8-a", color: "#1F4D7A" }] },
  { id: "9", name: "Velvet Sequin Gown", sku: "VG-008", tags: ["gown", "occasion"], price: 38000, is_active: true, thumbnail_color: "#5C3B7E", initials: "VG", description: "Velvet evening gown with sequin detailing. Floor-length.", category: "Fashion", is_live: true, photos: [{ id: "p9-a", color: "#5C3B7E" }, { id: "p9-b", color: "#7C2D5E" }] },
  { id: "10", name: "Aso Oke Cap", sku: "AO-009", tags: ["accessory", "men"], price: 5500, is_active: true, thumbnail_color: "#7A4419", initials: "AO", description: "Handwoven Aso Oke cap. Pairs with native attire.", category: "Accessories", is_live: true, photos: [{ id: "p10-a", color: "#7A4419" }] },
  { id: "11", name: "Bubu Dress", sku: "BD-010", tags: ["dress", "casual", "women"], price: 11000, is_active: true, thumbnail_color: "#2A6E54", initials: "BD", description: "Comfortable bubu in cotton. Ankle-length.", category: "Fashion", is_live: true, photos: [{ id: "p11-a", color: "#2A6E54" }] },
  { id: "12", name: "Plain Damask Kaftan", sku: "PD-011", tags: ["kaftan", "men"], price: 16500, is_active: true, thumbnail_color: "#3A3D44", initials: "PD", description: "Solid damask kaftan in classic cut. Lightweight.", category: "Fashion", is_live: true, photos: [{ id: "p12-a", color: "#3A3D44" }] },
  { id: "13", name: "Embellished Senator", sku: "ES-012", tags: ["set", "men", "occasion"], price: 32000, is_active: true, thumbnail_color: "#7C2D5E", initials: "ES", description: "Senator suit with embroidered cuffs and collar.", category: "Fashion", is_live: true, photos: [{ id: "p13-a", color: "#7C2D5E" }] },
  { id: "14", name: "Lace Aso Ebi Dress", sku: "LA-013", tags: ["dress", "lace", "occasion"], price: 28500, is_active: true, thumbnail_color: "#1F4D7A", initials: "LA", description: "Aso Ebi lace dress, tailored fit. Lined.", category: "Fashion", is_live: true, photos: [{ id: "p14-a", color: "#1F4D7A" }, { id: "p14-b", color: "#5C3B7E" }] },
  { id: "15", name: "Brocade Agbada", sku: "BA-014", tags: ["set", "men", "formal"], price: 52000, is_active: true, thumbnail_color: "#5C3B7E", initials: "BA", description: "Premium brocade fabric agbada. Hand-finished embroidery.", category: "Fashion", is_live: true, photos: [{ id: "p15-a", color: "#5C3B7E" }] },
  { id: "16", name: "Linen Boubou", sku: "LB-015", tags: ["dress", "casual"], price: 13500, is_active: true, thumbnail_color: "#7A4419", initials: "LB", description: "Lightweight linen boubou. Breathable for warm days.", category: "Fashion", is_live: true, photos: [{ id: "p16-a", color: "#7A4419" }] },
  { id: "17", name: "Print Maxi Dress", sku: "PM-016", tags: ["dress", "ankara", "women"], price: 14500, is_active: true, thumbnail_color: "#2A6E54", initials: "PM", description: "Bold print maxi dress. Cap sleeves, hidden zip.", category: "Fashion", is_live: true, photos: [{ id: "p17-a", color: "#2A6E54" }] },
  { id: "18", name: "Iro and Buba Set", sku: "IB-017", tags: ["set", "women", "occasion"], price: 24500, is_active: true, thumbnail_color: "#3A3D44", initials: "IB", description: "Traditional iro and buba pair. Wrapper plus top.", category: "Fashion", is_live: true, photos: [{ id: "p18-a", color: "#3A3D44" }, { id: "p18-b", color: "#7C2D5E" }] },

  { id: "19", name: "Native Cap", sku: "NC-018", tags: ["accessory", "men"], price: 4800, is_active: true, thumbnail_color: "#7C2D5E", initials: "NC", description: "Round native cap in plain fabric. Adjustable fit.", category: "Accessories", is_live: true, photos: [{ id: "p19-a", color: "#7C2D5E" }] },
  { id: "20", name: "Beaded Necklace", sku: "BN-019", tags: ["accessory", "women"], price: 7800, is_active: false, thumbnail_color: "#1F4D7A", initials: "BN", description: "Multi-strand beaded necklace. Discontinued color.", category: "Accessories", is_live: false, photos: [{ id: "p20-a", color: "#1F4D7A" }] },
  { id: "21", name: "Leather Sandal", sku: "LS-020", tags: ["shoe", "men"], price: 18500, is_active: true, thumbnail_color: "#5C3B7E", initials: "LS", description: "Leather sandal with cushioned sole. Men's sizing.", category: "Footwear", is_live: true, photos: [{ id: "p21-a", color: "#5C3B7E" }] },
  { id: "22", name: "Boys Senator Set", sku: "BS-021", tags: ["set", "kids"], price: 19000, is_active: true, thumbnail_color: "#7A4419", initials: "BS", description: "Mini senator set for boys. Two-piece, lined.", category: "Fashion", is_live: true, photos: [{ id: "p22-a", color: "#7A4419" }] },
  { id: "23", name: "Girls Ankara Dress", sku: "GA-022", tags: ["dress", "ankara", "kids"], price: 8500, is_active: true, thumbnail_color: "#2A6E54", initials: "GA", description: "Ankara print dress for girls. A-line silhouette.", category: "Fashion", is_live: true, photos: [{ id: "p23-a", color: "#2A6E54" }] },
  { id: "24", name: "Plain Slim Pants", sku: "PS-023", tags: ["casual", "men"], price: 12000, is_active: true, thumbnail_color: "#3A3D44", initials: "PS", description: "Slim-fit pants in cotton blend. Side pockets.", category: "Fashion", is_live: true, photos: [{ id: "p24-a", color: "#3A3D44" }] },

  { id: "25", name: "Statement Earrings", sku: "SE-024", tags: ["accessory", "women"], price: 6500, is_active: true, thumbnail_color: "#7C2D5E", initials: "SE", description: "Bold drop earrings. Hypoallergenic posts.", category: "Accessories", is_live: true, photos: [{ id: "p25-a", color: "#7C2D5E" }] },
  { id: "26", name: "Bridal Lace", sku: "BL-025", tags: ["lace", "occasion", "women"], price: 75000, is_active: true, thumbnail_color: "#1F4D7A", initials: "BL", description: "Premium bridal lace gown. Cathedral train, full lining.", category: "Fashion", is_live: true, photos: [{ id: "p26-a", color: "#1F4D7A" }, { id: "p26-b", color: "#5C3B7E" }] },
  { id: "27", name: "Tie-Dye Bubu", sku: "TB-026", tags: ["dress", "casual"], price: 10500, is_active: true, thumbnail_color: "#5C3B7E", initials: "TB", description: "Tie-dye bubu in soft jersey. Easy wear.", category: "Fashion", is_live: true, photos: [{ id: "p27-a", color: "#5C3B7E" }] },
  { id: "28", name: "Cotton Wrapper", sku: "CW-027", tags: ["accessory"], price: 6000, is_active: true, thumbnail_color: "#7A4419", initials: "CW", description: "Plain cotton wrapper. Two-yard length.", category: "Accessories", is_live: true, photos: [{ id: "p28-a", color: "#7A4419" }] },
  { id: "29", name: "Wedding Aso Ebi Pack", sku: "WA-028", tags: ["set", "occasion", "lace"], price: 62500, is_active: true, thumbnail_color: "#2A6E54", initials: "WA", description: "Aso Ebi family pack. Includes 3 yards lace + gele.", category: "Fashion", is_live: true, photos: [{ id: "p29-a", color: "#2A6E54" }] },
  { id: "30", name: "Casual T-Shirt Wrap", sku: "CT-029", tags: ["casual", "women"], price: 4800, is_active: true, thumbnail_color: "#3A3D44", initials: "CT", description: "Casual wrap top. Cotton blend, short sleeve.", category: "Fashion", is_live: true, photos: [{ id: "p30-a", color: "#3A3D44" }] },

  { id: "31", name: "Office Pencil Skirt", sku: "OP-030", tags: ["formal", "women"], price: 11500, is_active: false, thumbnail_color: "#7C2D5E", initials: "OP", description: "Knee-length pencil skirt. No longer in catalog.", category: "Fashion", is_live: false, photos: [{ id: "p31-a", color: "#7C2D5E" }] },
  { id: "32", name: "Native Embroidered Top", sku: "NE-031", tags: ["women", "casual"], price: 9800, is_active: true, thumbnail_color: "#1F4D7A", initials: "NE", description: "Embroidered native blouse. Cotton, machine-washable.", category: "Fashion", is_live: true, photos: [{ id: "p32-a", color: "#1F4D7A" }] },
  { id: "33", name: "Sequin Evening Dress", sku: "SQ-032", tags: ["dress", "gown", "occasion"], price: 42000, is_active: true, thumbnail_color: "#5C3B7E", initials: "SQ", description: "Sequin-covered evening dress. Lined throughout.", category: "Fashion", is_live: true, photos: [{ id: "p33-a", color: "#5C3B7E" }, { id: "p33-b", color: "#7C2D5E" }] },
  { id: "34", name: "Cape Sleeve Gown", sku: "CG-033", tags: ["gown", "women", "occasion"], price: 35500, is_active: true, thumbnail_color: "#7A4419", initials: "CG", description: "Floor-length gown with cape sleeves. Statement piece.", category: "Fashion", is_live: true, photos: [{ id: "p34-a", color: "#7A4419" }] },
  { id: "35", name: "Lace Skirt and Blouse", sku: "LK-034", tags: ["set", "lace", "women"], price: 27000, is_active: true, thumbnail_color: "#2A6E54", initials: "LK", description: "Two-piece lace set. Skirt and matching blouse.", category: "Fashion", is_live: true, photos: [{ id: "p35-a", color: "#2A6E54" }] },
  { id: "36", name: "Stretch Ankara Pants", sku: "SP-035", tags: ["ankara", "casual", "women"], price: 9000, is_active: true, thumbnail_color: "#3A3D44", initials: "SP", description: "Stretch Ankara pants. Slim fit, mid-rise.", category: "Fashion", is_live: true, photos: [{ id: "p36-a", color: "#3A3D44" }] },

  { id: "37", name: "Velvet Headwrap", sku: "VH-036", tags: ["accessory"], price: 7000, is_active: true, thumbnail_color: "#7C2D5E", initials: "VH", description: "Velvet headwrap. Soft drape, pre-formed.", category: "Accessories", is_live: true, photos: [{ id: "p37-a", color: "#7C2D5E" }] },
  { id: "38", name: "Coral Beads Set", sku: "CB-037", tags: ["accessory", "occasion"], price: 22000, is_active: false, thumbnail_color: "#1F4D7A", initials: "CB", description: "Traditional coral beads set. Currently unavailable.", category: "Accessories", is_live: false, photos: [{ id: "p38-a", color: "#1F4D7A" }] },
  { id: "39", name: "Native Slippers", sku: "NS-038", tags: ["shoe", "men"], price: 14000, is_active: true, thumbnail_color: "#5C3B7E", initials: "NS", description: "Native leather slippers. Hand-stitched.", category: "Footwear", is_live: true, photos: [{ id: "p39-a", color: "#5C3B7E" }] },
  { id: "40", name: "Embroidered Kaftan", sku: "EK-039", tags: ["kaftan", "women"], price: 21000, is_active: true, thumbnail_color: "#7A4419", initials: "EK", description: "Embroidered women's kaftan. Wide sleeve.", category: "Fashion", is_live: true, photos: [{ id: "p40-a", color: "#7A4419" }] },
  { id: "41", name: "Beaded Hand Fan", sku: "BH-040", tags: ["accessory", "occasion"], price: 3500, is_active: true, thumbnail_color: "#2A6E54", initials: "BH", description: "Beaded handheld fan. Wedding favor classic.", category: "Accessories", is_live: true, photos: [{ id: "p41-a", color: "#2A6E54" }] },
  { id: "42", name: "Long Sleeve Boubou", sku: "LL-041", tags: ["dress", "casual"], price: 17500, is_active: false, thumbnail_color: "#3A3D44", initials: "LL", description: "Long sleeve boubou. Discontinued cut.", category: "Fashion", is_live: false, photos: [{ id: "p42-a", color: "#3A3D44" }] },
]
