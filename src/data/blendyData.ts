import mangoPhoto from '../assets/images/blendy_mango_bottle_1794920600503.jpg';
import detoxPhoto from '../assets/images/blendy_detox_green_bottle_1794920600918.jpg';
import pomegranatePhoto from '../assets/images/blendy_pomegranate_acai_1794920602460.jpg';

export type FlavourKey = 'berry' | 'kiwi' | 'banana' | 'strawberry';

export interface ItemBox {
  bx: number;
  by: number;
  bw: number;
  bh: number;
}

export interface FruitPieceSpec {
  id: string;
  item: 1 | 2 | 3;
  x: number;
  y: number;
  w: number;
  rotation: number;
  mirror: boolean;
  layer: 'fruit' | 'corner';
  bobDuration: number;
  bobDelay: number;
}

export interface HeroFlavourSpec {
  key: FlavourKey;
  arabicName: string;
  backdrop: string;
  sheetUrl: string;
  items: [ItemBox, ItemBox, ItemBox, ItemBox];
  bottle: {
    x: number;
    y: number;
    w: number;
  };
  pieces: FruitPieceSpec[];
}

const proxyUrl = (raw: string) =>
  `https://images.higgs.ai/?default=1&output=webp&w=2048&q=85&url=${encodeURIComponent(raw)}`;

export const FLOOR_SHADOWS = [
  { id: 'left-fruit', cx: 345, cy: 650, w: 170, h: 24 },
  { id: 'bottle', cx: 720, cy: 708, w: 320, h: 30 },
  { id: 'right-fruit', cx: 1318, cy: 638, w: 160, h: 22 },
  { id: 'bottom-right-fruit', cx: 1045, cy: 760, w: 150, h: 22 },
] as const;

export const HERO_FLAVOURS: HeroFlavourSpec[] = [
  {
    key: 'berry',
    arabicName: 'توت',
    backdrop: '#C2B0DC',
    sheetUrl: proxyUrl(
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261117_053958_8803e421-29b1-4c24-8efd-54cae3f479b4.png'
    ),
    items: [
      { bx: 233, by: 60, bw: 598, bh: 917 },
      { bx: 1209, by: 272, bw: 569, bh: 573 },
      { bx: 265, by: 1230, bw: 579, bh: 572 },
      { bx: 1192, by: 1192, bw: 626, bh: 641 },
    ],
    bottle: { x: 518, y: 138, w: 372 },
    pieces: [
      { id: 'b1', item: 2, x: 383, y: 178, w: 104, rotation: 0, mirror: false, layer: 'fruit', bobDuration: 3.6, bobDelay: -1.1 },
      { id: 'b2', item: 3, x: 960, y: 232, w: 118, rotation: 0, mirror: false, layer: 'fruit', bobDuration: 4.3, bobDelay: -2.7 },
      { id: 'b3', item: 1, x: 295, y: 478, w: 129, rotation: -8, mirror: false, layer: 'fruit', bobDuration: 3.9, bobDelay: -0.5 },
      { id: 'b4', item: 1, x: 1247, y: 455, w: 123, rotation: 15, mirror: false, layer: 'fruit', bobDuration: 4.7, bobDelay: -3.2 },
      { id: 'b5', item: 2, x: 968, y: 590, w: 110, rotation: 30, mirror: false, layer: 'fruit', bobDuration: 3.4, bobDelay: -1.9 },
      { id: 'b6', item: 1, x: -15, y: 590, w: 255, rotation: 0, mirror: false, layer: 'corner', bobDuration: 4.8, bobDelay: -2.2 },
      { id: 'b7', item: 3, x: 1282, y: 40, w: 200, rotation: 0, mirror: false, layer: 'corner', bobDuration: 4.1, bobDelay: -0.9 },
    ],
  },
  {
    key: 'kiwi',
    arabicName: 'كيوي',
    backdrop: '#B4D58A',
    sheetUrl: proxyUrl(
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261117_053958_b5695e60-72da-4b5b-bfb7-a091d528af75.png'
    ),
    items: [
      { bx: 217, by: 90, bw: 610, bh: 874 },
      { bx: 1204, by: 257, bw: 619, bh: 601 },
      { bx: 250, by: 1197, bw: 619, bh: 522 },
      { bx: 1200, by: 1186, bw: 633, bh: 650 },
    ],
    bottle: { x: 504, y: 135, w: 403 },
    pieces: [
      { id: 'k1', item: 2, x: 376, y: 170, w: 144, rotation: -150, mirror: true, layer: 'fruit', bobDuration: 4.2, bobDelay: -1.6 },
      { id: 'k2', item: 3, x: 960, y: 228, w: 152, rotation: 0, mirror: false, layer: 'fruit', bobDuration: 3.5, bobDelay: -2.9 },
      { id: 'k3', item: 1, x: 303, y: 460, w: 168, rotation: 0, mirror: false, layer: 'fruit', bobDuration: 4.6, bobDelay: -0.7 },
      { id: 'k4', item: 2, x: 1187, y: 462, w: 148, rotation: -25, mirror: false, layer: 'fruit', bobDuration: 3.8, bobDelay: -3.5 },
      { id: 'k5', item: 2, x: 946, y: 606, w: 150, rotation: 10, mirror: true, layer: 'fruit', bobDuration: 4.4, bobDelay: -1.2 },
      { id: 'k6', item: 1, x: -10, y: 575, w: 260, rotation: 0, mirror: false, layer: 'corner', bobDuration: 4.9, bobDelay: -2.4 },
      { id: 'k7', item: 3, x: 1285, y: 30, w: 200, rotation: 0, mirror: false, layer: 'corner', bobDuration: 3.7, bobDelay: -0.4 },
    ],
  },
  {
    key: 'banana',
    arabicName: 'موز',
    backdrop: '#F3DA8A',
    sheetUrl: proxyUrl(
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261117_053958_6cf14029-4bce-4c9a-b9fc-1c5b185082e3.png'
    ),
    items: [
      { bx: 194, by: 76, bw: 579, bh: 873 },
      { bx: 1205, by: 228, bw: 596, bh: 597 },
      { bx: 230, by: 1181, bw: 624, bh: 648 },
      { bx: 1193, by: 1182, bw: 646, bh: 659 },
    ],
    bottle: { x: 512, y: 135, w: 383 },
    pieces: [
      { id: 'n1', item: 1, x: 387, y: 147, w: 123, rotation: 0, mirror: false, layer: 'fruit', bobDuration: 3.7, bobDelay: -0.8 },
      { id: 'n2', item: 2, x: 970, y: 223, w: 136, rotation: -10, mirror: true, layer: 'fruit', bobDuration: 4.5, bobDelay: -2.1 },
      { id: 'n3', item: 3, x: 298, y: 483, w: 132, rotation: 15, mirror: false, layer: 'fruit', bobDuration: 3.3, bobDelay: -3.4 },
      { id: 'n4', item: 2, x: 1245, y: 462, w: 150, rotation: 20, mirror: false, layer: 'fruit', bobDuration: 4.8, bobDelay: -1.4 },
      { id: 'n5', item: 3, x: 950, y: 582, w: 130, rotation: -12, mirror: false, layer: 'fruit', bobDuration: 4.0, bobDelay: -2.8 },
      { id: 'n6', item: 3, x: 0, y: 585, w: 235, rotation: 0, mirror: false, layer: 'corner', bobDuration: 4.6, bobDelay: -0.3 },
      { id: 'n7', item: 1, x: 1280, y: 30, w: 190, rotation: 0, mirror: false, layer: 'corner', bobDuration: 3.9, bobDelay: -1.7 },
    ],
  },
  {
    key: 'strawberry',
    arabicName: 'فراولة',
    backdrop: '#F2AFC0',
    sheetUrl: proxyUrl(
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261117_055135_cbfb5a8d-c52b-4358-a6ee-d941c6c42285.png'
    ),
    items: [
      { bx: 226, by: 88, bw: 594, bh: 887 },
      { bx: 1190, by: 216, bw: 561, bh: 653 },
      { bx: 257, by: 1168, bw: 604, bh: 662 },
      { bx: 1240, by: 1169, bw: 632, bh: 686 },
    ],
    bottle: { x: 512, y: 135, w: 386 },
    pieces: [
      { id: 's1', item: 1, x: 372, y: 142, w: 128, rotation: 0, mirror: false, layer: 'fruit', bobDuration: 4.1, bobDelay: -2.0 },
      { id: 's2', item: 2, x: 955, y: 225, w: 117, rotation: 20, mirror: false, layer: 'fruit', bobDuration: 3.4, bobDelay: -0.6 },
      { id: 's3', item: 3, x: 290, y: 455, w: 140, rotation: -10, mirror: false, layer: 'fruit', bobDuration: 4.7, bobDelay: -3.1 },
      { id: 's4', item: 3, x: 1250, y: 432, w: 135, rotation: 15, mirror: false, layer: 'fruit', bobDuration: 3.8, bobDelay: -1.5 },
      { id: 's5', item: 2, x: 962, y: 558, w: 146, rotation: -15, mirror: false, layer: 'fruit', bobDuration: 4.4, bobDelay: -2.6 },
      { id: 's6', item: 1, x: -10, y: 555, w: 245, rotation: 0, mirror: false, layer: 'corner', bobDuration: 4.9, bobDelay: -0.9 },
      { id: 's7', item: 1, x: 1285, y: 35, w: 200, rotation: 20, mirror: false, layer: 'corner', bobDuration: 3.6, bobDelay: -3.7 },
    ],
  },
];

export type ProductCategory =
  | 'الكل'
  | 'سموذي الفواكه'
  | 'ديتوكس وخضار'
  | 'طاقة وبروتين'
  | 'باقات التوفير';

export interface ProductItem {
  id: string;
  name: string;
  subtitle: string;
  category: Exclude<ProductCategory, 'الكل'>;
  flavourTag: FlavourKey | 'mango' | 'detox' | 'pomegranate' | 'pack';
  price: number;
  oldPrice?: number;
  volume: string;
  calories: number;
  proteinGrams: number;
  vitaminC: string;
  ingredients: string[];
  description: string;
  note?: string;
  visualType: 'cutout-single' | 'studio-photo' | 'cutout-pack';
  sheetKey?: FlavourKey;
  fruitAccentItems?: Array<{ item: 1 | 2 | 3; rot: number }>;
  packSheets?: FlavourKey[];
  photoSrc?: string;
  accentBg: string;
}

export const CATEGORIES: ProductCategory[] = [
  'الكل',
  'سموذي الفواكه',
  'ديتوكس وخضار',
  'طاقة وبروتين',
  'باقات التوفير',
];

export const PRODUCTS: ProductItem[] = [
  {
    id: 'p-berry-royal',
    name: 'سموذي التوت البري الملكي',
    subtitle: 'توت أزرق · توت أسود · توت العليق',
    category: 'سموذي الفواكه',
    flavourTag: 'berry',
    price: 24,
    volume: '٣٥٠ مل',
    calories: 145,
    proteinGrams: 3,
    vitaminC: '١٢٠٪',
    ingredients: ['توت أزرق طازج', 'توت أسود بري', 'توت العليق الأحمر', 'عصير تفاح طبيعي معصور على البارد'],
    description: 'مزيج غني بمضادات الأكسدة من ثلاثة أنواع توت برية معصورة طازجة دون أي سكريات مضافة.',
    note: 'الأكثر طلباً',
    visualType: 'cutout-single',
    sheetKey: 'berry',
    fruitAccentItems: [
      { item: 1, rot: -12 },
      { item: 2, rot: 14 },
    ],
    accentBg: '#EDE7F6',
  },
  {
    id: 'p-kiwi-mint',
    name: 'سموذي الكيوي الأخضر المنعش',
    subtitle: 'كيوي ذهبي · نعناع بري · تفاح أخضر',
    category: 'ديتوكس وخضار',
    flavourTag: 'kiwi',
    price: 22,
    volume: '٣٥٠ مل',
    calories: 120,
    proteinGrams: 2,
    vitaminC: '١٨٠٪',
    ingredients: ['كيوي أخضر ناضج', 'أوراق نعناع طازجة', 'تفاح أخضر مقرمش', 'قطرات ليمون أخضر'],
    description: 'انتعاش فوري بفضل فيتامين سي المركز من الكيوي الطبيعي مع لمسة نعناع باردة تنشط الجسم.',
    note: 'غني بفيتامين C',
    visualType: 'cutout-single',
    sheetKey: 'kiwi',
    fruitAccentItems: [
      { item: 1, rot: -8 },
      { item: 3, rot: 18 },
    ],
    accentBg: '#EBF4DE',
  },
  {
    id: 'p-banana-velvet',
    name: 'سموذي الموز المخملي بالعسل',
    subtitle: 'موز استوائي · حليب اللوز · عسل سدر',
    category: 'طاقة وبروتين',
    flavourTag: 'banana',
    price: 21,
    volume: '٣٥٠ مل',
    calories: 190,
    proteinGrams: 6,
    vitaminC: '٤٥٪',
    ingredients: ['موز ناضج حلو', 'حليب لوز محمص منزلياً', 'عسل سدر طبيعي', 'رشة فانيليا مدغشقر'],
    description: 'قوام كريمي ناعم يمنحك طاقة مستدامة قبل التمرين أو في بداية صباحك.',
    note: 'طاقة طبيعية',
    visualType: 'cutout-single',
    sheetKey: 'banana',
    fruitAccentItems: [
      { item: 2, rot: -10 },
      { item: 3, rot: 12 },
    ],
    accentBg: '#FCF4D9',
  },
  {
    id: 'p-strawberry-wild',
    name: 'سموذي الفراولة البرية النقية',
    subtitle: 'فراولة مزارع طازجة · رمان · زبادي يوناني',
    category: 'سموذي الفواكه',
    flavourTag: 'strawberry',
    price: 23,
    volume: '٣٥٠ مل',
    calories: 155,
    proteinGrams: 5,
    vitaminC: '١٣٥٪',
    ingredients: ['فراولة طازجة منتقاة', 'عصير رمان طبيعي', 'زبادي يوناني خفيف', 'بذور شيا بيضاء'],
    description: 'حلاوة الفراولة الطبيعية مع قوام ناعم متوازن يناسب كل الأوقات.',
    note: 'وصل حديثاً',
    visualType: 'cutout-single',
    sheetKey: 'strawberry',
    fruitAccentItems: [
      { item: 1, rot: -14 },
      { item: 2, rot: 16 },
    ],
    accentBg: '#FCE7ED',
  },
  {
    id: 'p-mango-passion',
    name: 'سموذي المانجو ألفونسو والباشن فروت',
    subtitle: 'مانجو هندية فاخرة · باشن فروت · برتقال',
    category: 'سموذي الفواكه',
    flavourTag: 'mango',
    price: 26,
    volume: '٣٥٠ مل',
    calories: 170,
    proteinGrams: 2,
    vitaminC: '١٤٠٪',
    ingredients: ['مانجو ألفونسو ناضجة', 'لب الباشن فروت الطازج', 'عصير برتقال فالنسيا', 'نعناع طازج'],
    description: 'نكهة استوائية غنية بلب المانجو الفاخر مع حموضة الباشن فروت المتوازنة.',
    note: 'إصدار خاص',
    visualType: 'studio-photo',
    photoSrc: mangoPhoto,
    accentBg: '#FBEBD6',
  },
  {
    id: 'p-matcha-avocado',
    name: 'ديتوكس الماتشا والأفوكادو الأخضر',
    subtitle: 'ماتشا يابانية · أفوكادو · تفاح أخضر وسبانخ',
    category: 'ديتوكس وخضار',
    flavourTag: 'detox',
    price: 28,
    volume: '٣٥٠ مل',
    calories: 165,
    proteinGrams: 5,
    vitaminC: '٩٥٪',
    ingredients: ['شاي ماتشا احتفالي', 'نصف حبة أفوكادو كريمية', 'تفاح أخضر', 'سبانخ صغيرة وليمون'],
    description: 'خلطة تنقية متكاملة تمنحك تركيزاً عالياً وشبعاً يدوم لساعات دون ثقل.',
    note: 'ديتوكس يومي',
    visualType: 'studio-photo',
    photoSrc: detoxPhoto,
    accentBg: '#E3EFE6',
  },
  {
    id: 'p-pomegranate-acai',
    name: 'رمان ياقوتي وتوت الأساي البرازيلي',
    subtitle: 'رمان طازج · أساي عضوي · توت أزرق',
    category: 'سموذي الفواكه',
    flavourTag: 'pomegranate',
    price: 27,
    volume: '٣٥٠ مل',
    calories: 150,
    proteinGrams: 3,
    vitaminC: '١١٥٪',
    ingredients: ['حبات رمان طازج', 'لب أساي عضوي نقي', 'توت أزرق', 'ماء جوز الهند'],
    description: 'قنبلة مضادات أكسدة بلون ياقوتي داكن، مثالي لاستعادة النشاط ونضارة البشرة.',
    note: 'مضاد أكسدة',
    visualType: 'studio-photo',
    photoSrc: pomegranatePhoto,
    accentBg: '#F2E5EE',
  },
  {
    id: 'p-family-pack-6',
    name: 'باقة العائلة الكاملة (٦ زجاجات)',
    subtitle: 'توت · كيوي · موز · فراولة · مضاعفة التوفير',
    category: 'باقات التوفير',
    flavourTag: 'pack',
    price: 118,
    oldPrice: 142,
    volume: '٦ × ٣٥٠ مل',
    calories: 150,
    proteinGrams: 4,
    vitaminC: '١٣٠٪',
    ingredients: ['تشكيلة مختارة من أشهر نكهات بليندي الطازجة في عبوة مبردة'],
    description: 'باقة أسبوعية أو عائلية تجمع أفضل ٦ زجاجات سموذي طبيعي بخصم ١٧٪ وتوصيل مجاني سريع.',
    note: 'وفر ٢٤ ر.س',
    visualType: 'cutout-pack',
    packSheets: ['berry', 'kiwi', 'banana', 'strawberry'],
    accentBg: '#F3EFF9',
  },
  {
    id: 'p-blueberry-chia',
    name: 'توت أزرق وبذور الشيا واللافندر',
    subtitle: 'توت أزرق · بذور شيا منقوعة · قطرة لافندر',
    category: 'سموذي الفواكه',
    flavourTag: 'berry',
    price: 25,
    volume: '٣٥٠ مل',
    calories: 158,
    proteinGrams: 5,
    vitaminC: '١٠٠٪',
    ingredients: ['توت أزرق بري', 'بذور شيا عضوية', 'حليب شوفان', 'مستخلص لافندر عطري'],
    description: 'توليفة هادئة غنية بالألياف والأوميغا ٣، مثالية لفترة المساء أو كوجبة خفيفة.',
    visualType: 'cutout-single',
    sheetKey: 'berry',
    fruitAccentItems: [
      { item: 2, rot: 22 },
      { item: 3, rot: -16 },
    ],
    accentBg: '#EBE4F5',
  },
  {
    id: 'p-kiwi-pineapple',
    name: 'كيوي وأناناس استوائي مع الزنجبيل',
    subtitle: 'كيوي طازج · أناناس ذهبي · زنجبيل حار',
    category: 'ديتوكس وخضار',
    flavourTag: 'kiwi',
    price: 24,
    volume: '٣٥٠ مل',
    calories: 130,
    proteinGrams: 2,
    vitaminC: '١٩٥٪',
    ingredients: ['كيوي', 'أناناس طازج', 'جذر زنجبيل مبشور', 'خيار بارد'],
    description: 'يعزز الهضم والمناعة بلمسة زنجبيل منعشة مع حلاوة الأناناس الطبيعية.',
    visualType: 'cutout-single',
    sheetKey: 'kiwi',
    fruitAccentItems: [
      { item: 2, rot: 15 },
      { item: 3, rot: -12 },
    ],
    accentBg: '#E7F2D9',
  },
  {
    id: 'p-banana-oat-protein',
    name: 'موز بالشوفان المحمص وبروتين الفول السوداني',
    subtitle: 'موز · شوفان عضوي · زبدة فول سوداني · ٢٢غ بروتين',
    category: 'طاقة وبروتين',
    flavourTag: 'banana',
    price: 29,
    volume: '٤٥٠ مل',
    calories: 295,
    proteinGrams: 22,
    vitaminC: '٢٥٪',
    ingredients: ['موز ناضج', 'شوفان عضوي مطحون', 'زبدة فول سوداني طبيعية', 'بروتين نباتي نقي', 'قرفة سيلانية'],
    description: 'وجبة متكاملة للرياضيين بعد التمرين لتغذية العضلات بطعم الموز والكراميل الطبيعي.',
    note: '٢٢ غ بروتين',
    visualType: 'cutout-single',
    sheetKey: 'banana',
    fruitAccentItems: [
      { item: 1, rot: 18 },
      { item: 2, rot: -14 },
    ],
    accentBg: '#F9F0D0',
  },
  {
    id: 'p-strawberry-hibiscus',
    name: 'فراولة وكركديه بارد بالرمان',
    subtitle: 'فراولة حمراء · زهرة الكركديه · عسل زهور',
    category: 'سموذي الفواكه',
    flavourTag: 'strawberry',
    price: 24,
    volume: '٣٥٠ مل',
    calories: 138,
    proteinGrams: 2,
    vitaminC: '١٥٠٪',
    ingredients: ['فراولة طازجة', 'منقوع كركديه بارد', 'رمان طبيعي', 'عسل أبيض'],
    description: 'نكهة شرقية عصرية تجمع حموضة الكركديه المنعشة مع طراوة الفراولة.',
    visualType: 'cutout-single',
    sheetKey: 'strawberry',
    fruitAccentItems: [
      { item: 2, rot: -20 },
      { item: 3, rot: 12 },
    ],
    accentBg: '#FAE1E8',
  },
  {
    id: 'p-green-spiral',
    name: 'سوبر جرين سبيرولينا والليمون',
    subtitle: 'سبيرولينا زرقاء · خيار · تفاح · ليمون أخضر',
    category: 'ديتوكس وخضار',
    flavourTag: 'detox',
    price: 29,
    volume: '٣٥٠ مل',
    calories: 110,
    proteinGrams: 6,
    vitaminC: '١١٠٪',
    ingredients: ['سبيرولينا نقية', 'كرفس عضوي', 'خيار', 'تفاح أخضر وليمون'],
    description: 'تركيبة خضراء عالية التركيز بالمعادن والكلوروفيل لإعادة توازن الجسم.',
    visualType: 'studio-photo',
    photoSrc: detoxPhoto,
    accentBg: '#DFECE2',
  },
  {
    id: 'p-mango-turmeric',
    name: 'مانجو والكركم الذهبي بالزنجبيل',
    subtitle: 'مانجو طازجة · جذور كركم · فلفل أسود · برتقال',
    category: 'ديتوكس وخضار',
    flavourTag: 'mango',
    price: 26,
    volume: '٣٥٠ مل',
    calories: 160,
    proteinGrams: 2,
    vitaminC: '١٦٠٪',
    ingredients: ['مانجو ألفونسو', 'كركم طازج', 'زنجبيل', 'حليب جوز الهند'],
    description: 'جرعة مناعة ذهبية مضادة للالتهابات بنكهة مانجو استوائية ناعمة.',
    visualType: 'studio-photo',
    photoSrc: mangoPhoto,
    accentBg: '#FAECD4',
  },
  {
    id: 'p-acai-protein',
    name: 'سموذي الأساي وبروتين التوت المضاعف',
    subtitle: 'أساي · توت أسود · ٢٠غ بروتين نباتي',
    category: 'طاقة وبروتين',
    flavourTag: 'pomegranate',
    price: 31,
    volume: '٤٥٠ مل',
    calories: 240,
    proteinGrams: 20,
    vitaminC: '١٠٥٪',
    ingredients: ['توت أساي', 'توت العليق', 'بروتين البازلاء الذهبية', 'موز'],
    description: 'مشروب استشفاء عضلي غني بالأنثوسيانين والبروتين سريع الامتصاص.',
    note: '٢٠ غ بروتين',
    visualType: 'studio-photo',
    photoSrc: pomegranatePhoto,
    accentBg: '#EFE2EB',
  },
  {
    id: 'p-duo-berry-kiwi',
    name: 'ثنائي الانتعاش (توت + كيوي)',
    subtitle: 'زجاجة توت بري + زجاجة كيوي نعناع',
    category: 'باقات التوفير',
    flavourTag: 'pack',
    price: 42,
    oldPrice: 46,
    volume: '٢ × ٣٥٠ مل',
    calories: 132,
    proteinGrams: 3,
    vitaminC: '١٥٠٪',
    ingredients: ['زجاجة سموذي التوت البري الملكي', 'زجاجة سموذي الكيوي الأخضر المنعش'],
    description: 'ثنائي الصباح والمساء المثالي لتجربة نكهتين متناقضتين ومنعشتين.',
    visualType: 'cutout-pack',
    packSheets: ['berry', 'kiwi'],
    accentBg: '#EFEBF7',
  },
  {
    id: 'p-duo-banana-straw',
    name: 'ثنائي الكلاسيك (موز + فراولة)',
    subtitle: 'زجاجة موز بالعسل + زجاجة فراولة برية',
    category: 'باقات التوفير',
    flavourTag: 'pack',
    price: 40,
    oldPrice: 44,
    volume: '٢ × ٣٥٠ مل',
    calories: 172,
    proteinGrams: 5,
    vitaminC: '٩٠٪',
    ingredients: ['زجاجة سموذي الموز المخملي', 'زجاجة سموذي الفراولة البرية'],
    description: 'المزيج الكلاسيكي المحبوب لدى الجميع بطعم غني وقوام حريري.',
    visualType: 'cutout-pack',
    packSheets: ['banana', 'strawberry'],
    accentBg: '#FBF1E3',
  },
  {
    id: 'p-blackberry-mint',
    name: 'بلاك بيري وليمون بالنعناع الداكن',
    subtitle: 'توت أسود مركز · ليمون بنزهير · نعناع',
    category: 'سموذي الفواكه',
    flavourTag: 'berry',
    price: 25,
    volume: '٣٥٠ مل',
    calories: 135,
    proteinGrams: 2,
    vitaminC: '١٢٥٪',
    ingredients: ['توت أسود بري', 'عصير ليمون طازج', 'نعناع مفروم', 'ماء نقي بارد'],
    description: 'نكهة جريئة عميقة مع حموضة منعشة تكسر العطش في الأيام الحارة.',
    visualType: 'cutout-single',
    sheetKey: 'berry',
    fruitAccentItems: [
      { item: 3, rot: 8 },
      { item: 1, rot: -10 },
    ],
    accentBg: '#EAE2F5',
  },
  {
    id: 'p-kiwi-spinach-light',
    name: 'كيوي لايت بالخيار والريحان',
    subtitle: 'كيوي · خيار · أوراق ريحان · ٩٥ سعرة فقط',
    category: 'ديتوكس وخضار',
    flavourTag: 'kiwi',
    price: 23,
    volume: '٣٥٠ مل',
    calories: 95,
    proteinGrams: 2,
    vitaminC: '١٧٠٪',
    ingredients: ['كيوي', 'خيار إنجليزي', 'ريحان طازج', 'ليمون'],
    description: 'أخف سموذي في القائمة بسعرات حرارية منخفضة وانتعاش عشبي فريد.',
    note: '٩٥ سعرة فقط',
    visualType: 'cutout-single',
    sheetKey: 'kiwi',
    fruitAccentItems: [
      { item: 1, rot: 14 },
      { item: 2, rot: -18 },
    ],
    accentBg: '#E9F3DC',
  },
  {
    id: 'p-banana-dates-tahini',
    name: 'موز بتمر السكري والطحينة الفاخرة',
    subtitle: 'موز · تمر سكري · طحينة سمسم · هيل',
    category: 'طاقة وبروتين',
    flavourTag: 'banana',
    price: 27,
    volume: '٤٠٠ مل',
    calories: 270,
    proteinGrams: 9,
    vitaminC: '٣٠٪',
    ingredients: ['موز طازج', 'تمر سكري مخلّى', 'طحينة سمسم نقية', 'حليب لوز', 'رشة هيل'],
    description: 'نكهة عربية أصيلة بطاقة عالية ومعادن طبيعية من التمر والسمسم.',
    note: 'نكهة عربية',
    visualType: 'cutout-single',
    sheetKey: 'banana',
    fruitAccentItems: [
      { item: 3, rot: -8 },
      { item: 1, rot: 22 },
    ],
    accentBg: '#FAF1D3',
  },
  {
    id: 'p-strawberry-protein-milk',
    name: 'ميلك شيك الفراولة بالبروتين الصافي',
    subtitle: 'فراولة · واي بروتين نقي · فانيليا · ٢٤غ بروتين',
    category: 'طاقة وبروتين',
    flavourTag: 'strawberry',
    price: 30,
    volume: '٤٥٠ مل',
    calories: 230,
    proteinGrams: 24,
    vitaminC: '١١٠٪',
    ingredients: ['فراولة طازجة', 'بروتين حليب صافي', 'حليب لوز', 'فانيليا طبيعية'],
    description: 'مخفوق بروتين فاخر بطعم حليب الفراولة الطبيعي دون أي محليات صناعية.',
    note: '٢٤ غ بروتين',
    visualType: 'cutout-single',
    sheetKey: 'strawberry',
    fruitAccentItems: [
      { item: 1, rot: 12 },
      { item: 3, rot: -15 },
    ],
    accentBg: '#FBE5EC',
  },
  {
    id: 'p-detox-3day-box',
    name: 'باقة الديتوكس الثلاثية (٤ زجاجات)',
    subtitle: 'تطهير وانتعاش متكامل بنكهات الكيوي والتوت',
    category: 'باقات التوفير',
    flavourTag: 'pack',
    price: 84,
    oldPrice: 96,
    volume: '٤ × ٣٥٠ مل',
    calories: 125,
    proteinGrams: 3,
    vitaminC: '١٦٥٪',
    ingredients: ['زجاجتا كيوي ديتوكس', 'زجاجة توت مضاد أكسدة', 'زجاجة فراولة خفيفة'],
    description: 'برنامج خفيف ومنعش ليومين من التغذية السائلة النقية والفيتامينات.',
    visualType: 'cutout-pack',
    packSheets: ['kiwi', 'berry', 'kiwi', 'strawberry'],
    accentBg: '#ECF3E5',
  },
  {
    id: 'p-office-box-8',
    name: 'صندوق المكتب والجمعات (٨ زجاجات)',
    subtitle: 'زجاجتان من كل نكهة أساسية · توصيل مجاني',
    category: 'باقات التوفير',
    flavourTag: 'pack',
    price: 152,
    oldPrice: 184,
    volume: '٨ × ٣٥٠ مل',
    calories: 150,
    proteinGrams: 4,
    vitaminC: '١٣٥٪',
    ingredients: ['٢ توت بري', '٢ كيوي منعش', '٢ موز بالعسل', '٢ فراولة برية'],
    description: 'الخيار الأفضل لاجتماعات العمل أو التجمعات العائلية بنكهات ترضي كل الأذواق.',
    note: 'الأكثر توفيراً',
    visualType: 'cutout-pack',
    packSheets: ['berry', 'kiwi', 'banana', 'strawberry'],
    accentBg: '#F4F1FA',
  },
  {
    id: 'p-kids-rainbow-4',
    name: 'باقة الصغار الصحية (٤ زجاجات)',
    subtitle: 'نكهات حلوة طبيعية ١٠٠٪ بدون أي إضافات',
    category: 'باقات التوفير',
    flavourTag: 'pack',
    price: 78,
    oldPrice: 90,
    volume: '٤ × ٣٥٠ مل',
    calories: 145,
    proteinGrams: 3,
    vitaminC: '١٣٠٪',
    ingredients: ['توت بري حلو', 'موز بالعسل', 'فراولة ناعمة', 'كيوي بالتفاح'],
    description: 'وجبة مدرسية مثالية محببة للأطفال ومليئة بالفيتامينات الطبيعية.',
    visualType: 'cutout-pack',
    packSheets: ['strawberry', 'banana', 'berry', 'kiwi'],
    accentBg: '#FDF3E7',
  },
];

export function normalizeArabic(text: string): string {
  return text
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F]/g, '')
    .trim();
}
