// Shared placeholder data. Each export here is a stand in for a Supabase
// query, the comment above each one names the table it will come from.

// hero_slides, ordered by sort_order, where is_active = true
export const founderPhoto = "https://i.pinimg.com/736x/51/06/24/5106240b2e4d0aa59525b8fcfed11062.jpg";

export const heroSlides = [
  {
    headline: "Enhancing Beauty,",
    accent: "Elevating Confidence",
    subtext: "Luxury braiding, wigs and hair care delivered with the calm precision of a five star studio.",
    image: "https://i.pinimg.com/736x/b7/0f/e8/b70fe8ec02c35f110af19749796c94f1.jpg",
  },
  {
    headline: "Book a seat,",
    accent: "not a guess",
    subtext: "Real time availability for every service, so you always know exactly when your stylist is free.",
    image: "https://i.pinimg.com/736x/f2/e0/3e/f2e03e3b1b22cf66a7e9d37ad93a097b.jpg",
  },
  {
    headline: "Products made",
    accent: "for your texture",
    subtext: "Take the studio home with hair care built for braids, silk press and natural styles alike.",
    image: "https://i.pinimg.com/736x/97/d1/28/97d1282f8ca318d1a3e43660b91e640c.jpg",
  },
];

// service_categories, ordered by sort_order
export const serviceCategories = [
  { key: "braiding", label: "Braiding" },
  { key: "wigs", label: "Wig installation" },
  { key: "treatment", label: "Hair treatment" },
  { key: "natural", label: "Natural hair" },
  { key: "bridal", label: "Bridal" },
  { key: "makeup", label: "Makeup" },
  { key: "lashes", label: "Lashes" },
  { key: "nails", label: "Nails" },
];

// services, ordered by sort_order, where is_active = true
export const services = [
  {
    id: "tiny-knotless-braids", name: "Tiny Knotless Braids", category: "braiding",
    duration: "5 to 8 hrs", priceMin: 350, priceMax: 550, tag: "Signature", dailyCapacity: 3,
    description: "Fine, tension free knotless braids built to last six to eight weeks without pulling on the scalp.",
    prepTips: "Come with freshly washed, blow dried hair. Eat beforehand, sessions run long.",
    aftercare: "Sleep with a satin bonnet, moisturize your scalp every two to three days, avoid heavy gel at the roots.",
    image: "https://i.pinimg.com/736x/1a/a6/1b/1aa61b3748135c3b3b41039020efd0d3.jpg",
  },
  {
    id: "frontal-wig-install", name: "Frontal Wig Install", category: "wigs",
    duration: "2 to 4 hrs", priceMin: 250, priceMax: 400, tag: "Popular", dailyCapacity: 6,
    description: "A melted, natural hairline install using your unit, includes plucking and baby hair styling.",
    prepTips: "Bring your wig pre washed and detangled, or add on a wash service.",
    aftercare: "Avoid heavy sweating for the first 48 hours while the adhesive sets fully.",
    image: "https://i.pinimg.com/736x/4e/24/99/4e2499d8818538bc993777502a72f17b.jpg",
  },
  {
    id: "bohemian-braids", name: "Bohemian Braids", category: "braiding",
    duration: "4 to 6 hrs", priceMin: 400, priceMax: 600, tag: "New", dailyCapacity: 4,
    description: "Loose, curly pieces woven through braids for a soft, undone finish.",
    prepTips: "Detangled, stretched hair helps us finish faster and cleaner.",
    aftercare: "Refresh curls lightly with water and leave in conditioner, avoid brushing through the curly pieces.",
    image: "https://i.pinimg.com/736x/75/7f/52/757f52b22a7a003833175496e95f8848.jpg",
  },
  {
    id: "silk-press", name: "Silk Press", category: "treatment",
    duration: "1 to 2 hrs", priceMin: 150, priceMax: 220, tag: "Quick", dailyCapacity: 8,
    description: "A smooth, bouncy blowout using heat protectant and a ceramic flat iron for a silky finish.",
    prepTips: "Come with clarified, product free hair for the straightest result.",
    aftercare: "Wrap at night, avoid humidity and moisture for four to five days.",
    image: "https://i.pinimg.com/736x/98/81/f2/9881f29c63d42d350a3ff86a96cc7531.jpg",
  },
  {
    id: "hair-treatment", name: "Hair Treatment", category: "treatment",
    duration: "1 hr", priceMin: 120, priceMax: 180, tag: "Add on", dailyCapacity: 10,
    description: "A deep conditioning and scalp treatment to restore moisture between protective styles.",
    prepTips: "No prep needed, this pairs well as an add on before any other service.",
    aftercare: "Follow up with a light leave in for the next few days.",
    image: "https://i.pinimg.com/736x/76/86/92/768692647f0527030ff9f8f2bfd11cf9.jpg",
  },
  {
    id: "natural-hair-cut", name: "Natural Hair Cut and Style", category: "natural",
    duration: "1 to 2 hrs", priceMin: 130, priceMax: 200, tag: "Popular", dailyCapacity: 6,
    description: "A shape cut tailored to your curl pattern, finished with a wash and go or twist out.",
    prepTips: "Come with hair in its natural state, freshly washed if possible.",
    aftercare: "Use a satin pillowcase and refresh curls with a light water and leave in mix.",
    image: "https://i.pinimg.com/736x/ce/a3/33/cea333f9349acbf83d196a633cf14a4d.jpg",
  },
  {
    id: "bridal-updo", name: "Bridal Updo", category: "bridal",
    duration: "2 to 3 hrs", priceMin: 450, priceMax: 700, tag: "Bridal", dailyCapacity: 2,
    description: "A trial and day of styling package for brides, includes accessories consultation.",
    prepTips: "Book a trial at least three weeks before the wedding date.",
    aftercare: "We recommend a touch up kit for long receptions, ask your stylist on the day.",
    image: "https://picsum.photos/id/1035/800/800",
  },
  // Placeholder pricing and duration below, swap for Beryl's real numbers
  {
    id: "signature-makeup", name: "Signature Makeup", category: "makeup",
    duration: "1 to 1.5 hrs", priceMin: 150, priceMax: 300, tag: "Popular", dailyCapacity: 6,
    description: "A full face application tailored to your event, from soft everyday glam to a bold night out look.",
    prepTips: "Come with clean, moisturized skin, no foundation or makeup on beforehand.",
    aftercare: "Avoid touching your face for the first hour, blot rather than rub if needed.",
    image: "https://i.pinimg.com/736x/4c/b2/9d/4cb29dbc23d583e9b7e6616973759217.jpg",
  },
  {
    id: "classic-lash-extensions", name: "Classic Lash Extensions", category: "lashes",
    duration: "1 to 2 hrs", priceMin: 100, priceMax: 250, tag: "New", dailyCapacity: 6,
    description: "Individual lashes applied one by one for a natural, full lash line that lasts two to three weeks.",
    prepTips: "Arrive with clean lashes, no mascara or eye makeup on the day.",
    aftercare: "Avoid water and steam for the first 24 hours, brush through daily with a spoolie.",
    image: "https://i.pinimg.com/736x/7c/05/31/7c05311ad2cdeed8cb674fb9643d48f4.jpg",
  },
  {
    id: "gel-manicure", name: "Gel Manicure", category: "nails",
    duration: "45 min to 1 hr", priceMin: 80, priceMax: 150, tag: "Quick", dailyCapacity: 8,
    description: "A long lasting gel finish with shape, cuticle care, and your choice of color or simple nail art.",
    prepTips: "Come with polish removed if possible, this saves time in your session.",
    aftercare: "Wear gloves for cleaning or dishes, moisturize cuticles daily to extend wear.",
    image: "https://i.pinimg.com/1200x/aa/a9/27/aaa927451f4383aaa41079d8b9e78711.jpg",
  },
];

// gallery, ordered by sort_order
export const galleryItems = [
  { id: 1, category: "braiding", caption: "Tiny knotless, six weeks fresh", image: "https://i.pinimg.com/736x/1e/41/0f/1e410f20465843563715a6936f080d22.jpg" },
  { id: 2, category: "wigs", caption: "13 by 4 frontal, natural part", image: "https://i.pinimg.com/736x/39/af/e2/39afe215c115bb17e04866b7bce87dd5.jpg" },
  { id: 3, category: "bridal", caption: "Wedding day updo, Ama and Kwame", image: "https://i.pinimg.com/1200x/bf/b1/68/bfb168a45be958c61f9bff5afa636a6c.jpg" },
  { id: 4, category: "treatment", caption: "Silk press, one length blowout", image: "https://i.pinimg.com/1200x/d2/7a/44/d27a440035bdd1c25fc9f31c570be1a2.jpg" },
  { id: 5, category: "natural", caption: "Wash and go, twist out set", image: "https://i.pinimg.com/736x/0c/0e/7b/0c0e7bf6340157ade2a0d625eecf3472.jpg" },
  { id: 6, category: "braiding", caption: "Bohemian braids, honey highlights", image: "https://i.pinimg.com/1200x/40/a3/21/40a3211faaaba4ab8479697b41deb8c0.jpg" },
  { id: 7, category: "wigs", caption: "Bob install, side part", image: "https://i.pinimg.com/736x/e3/88/77/e38877f3c4cc71a1df499a18c1a5da95.jpg" },
  { id: 8, category: "bridal", caption: "Trial run, low bun with veil", image: "https://i.pinimg.com/736x/5b/58/82/5b58821d295ec44388552c158af5ee6a.jpg" },
  { id: 9, category: "treatment", caption: "Deep conditioning, before and after", image: "https://i.pinimg.com/1200x/5e/d3/49/5ed3496165903b919724ab41147f82b2.jpg" },
  { id: 10, category: "makeup", caption: "Soft glam, everyday look", image: "https://i.pinimg.com/1200x/a3/73/c6/a373c6649b60bbf18b7d6dbeb1ab3c41.jpg" },
  { id: 11, category: "makeup", caption: "Bold night out application", image: "https://i.pinimg.com/736x/01/47/6c/01476c773d5cd12c57ed5c765de69617.jpg" },
  { id: 12, category: "lashes", caption: "Classic set, full lash line", image: "https://i.pinimg.com/736x/5a/e9/ac/5ae9acfaeb22dc8f970a9196ce9cf28c.jpg" },
  { id: 13, category: "lashes", caption: "Natural everyday lashes", image: "https://i.pinimg.com/736x/bd/59/69/bd596942a0b8344727ffb16993399906.jpg" },
  { id: 14, category: "nails", caption: "Gel manicure, fresh set", image: "https://i.pinimg.com/1200x/1c/53/e9/1c53e9eac4e29e724541cb4b3763fe37.jpg" },
  { id: 15, category: "nails", caption: "Simple nail art finish", image: "https://i.pinimg.com/736x/a4/df/9f/a4df9f9f740b8138195b369b67de1d22.jpg" },
];

// products, where is_active = true
export const products = [
  { id: "beryls-hair-oil", name: "Beryl's Hair Oil", price: 85, rating: 4.9, stock: 18, description: "A lightweight blend of jojoba and castor oil that seals moisture without weighing curls down.", howToUse: "Warm a small amount between your palms and work through damp or dry hair, focusing on ends.", image: "https://i.pinimg.com/736x/96/85/eb/9685eb55270da806b1ceed5f9ddd43e2.jpg" },
  { id: "moisture-shampoo", name: "Moisture Shampoo", price: 70, rating: 4.8, stock: 24, description: "A sulfate free cleanser that lifts product buildup while keeping natural oils intact.", howToUse: "Apply to wet hair, massage into the scalp for one minute, then rinse thoroughly.", image: "https://i.pinimg.com/1200x/48/c1/79/48c17976d6022620a533d69e078ea2fe.jpg" },
  { id: "curl-defining-cream", name: "Curl Defining Cream", price: 60, rating: 4.7, stock: 9, description: "Shea butter based cream that locks in definition and cuts down on frizz through humidity.", howToUse: "Scrunch through soaking wet hair from root to tip, then air dry or diffuse.", image: "https://picsum.photos/id/110/700/700" },
  { id: "edge-control", name: "Edge Control", price: 40, rating: 4.9, stock: 15, description: "A strong hold gel made for laying edges without flaking or leaving white residue.", howToUse: "Use a soft brush to smooth a small amount along the hairline.", image: "https://picsum.photos/id/117/700/700" },
  { id: "hair-growth-serum", name: "Hair Growth Serum", price: 95, rating: 4.6, stock: 0, description: "A nightly scalp serum with peppermint and biotin to support thicker, longer growth over time.", howToUse: "Apply directly to the scalp before bed and massage for two minutes.", image: "https://picsum.photos/id/129/700/700" },
];

// customer_reviews, where status = approved, most recent first
export const photoReviews = [
  { name: "Ama Serwaa", rating: 5, comment: "Two weeks in and still perfect. Worth every cedi." },
  { name: "Efua Mensah", rating: 5, comment: "My frontal has never looked this natural." },
];

// appointments, joined with profiles and services, for today
export const appointments = [
  { client: "Ama Serwaa", service: "Tiny Knotless Braids", time: "Today, 10:30 AM", status: "Confirmed" },
  { client: "Efua Mensah", service: "Frontal Wig Install", time: "Today, 12:00 PM", status: "Pending" },
  { client: "Yaa Asantewaa", service: "Silk Press", time: "Today, 1:30 PM", status: "Confirmed" },
  { client: "Abena Owusu", service: "Hair Treatment", time: "Today, 3:00 PM", status: "Completed" },
];

// products, sorted by stock_quantity ascending, for the low stock panel
export const inventory = [
  { name: "Hair Wax", left: 56, total: 60 },
  { name: "Edge Control", left: 5, total: 40 },
  { name: "Moisture Shampoo", left: 3, total: 30 },
  { name: "Hair Growth Serum", left: 0, total: 25 },
];

// customer_reviews, where status = pending
export const initialPendingReviews = [
  { id: 1, name: "Naomi Owusu", service: "Bohemian Braids", rating: 5, comment: "Loved how gentle my stylist was with my edges." },
  { id: 2, name: "Adjoa Boateng", service: "Silk Press", rating: 4, comment: "Great finish, wish the wait was a little shorter." },
];

export const timeSlots = ["09:00 AM", "10:30 AM", "12:00 PM", "01:30 PM", "03:00 PM", "04:30 PM", "06:00 PM"];

// appointments, where customer_id = the signed in user, ordered by appointment_date
export const myAppointments = [
  { id: "a1", service: "Tiny Knotless Braids", date: "28 Jul 2026", time: "10:30 AM", status: "Upcoming", price: 400 },
  { id: "a2", service: "Hair Treatment", date: "12 Jul 2026", time: "02:00 PM", status: "Completed", price: 120 },
  { id: "a3", service: "Silk Press", date: "30 Jun 2026", time: "11:00 AM", status: "Completed", price: 180 },
  { id: "a4", service: "Frontal Wig Install", date: "18 Jun 2026", time: "09:00 AM", status: "Cancelled", price: 300 },
];

// orders, where customer_id = the signed in user, joined with order_items, ordered by created_at
export const myOrders = [
  {
    id: "ORD-1042", date: "15 Jul 2026", status: "Delivered", total: 155,
    items: [{ name: "Beryl's Hair Oil", qty: 1, price: 85 }, { name: "Edge Control", qty: 1, price: 40 }],
  },
  {
    id: "ORD-1036", date: "02 Jul 2026", status: "Processing", total: 70,
    items: [{ name: "Moisture Shampoo", qty: 1, price: 70 }],
  },
  {
    id: "ORD-1021", date: "19 Jun 2026", status: "Cancelled", total: 60,
    items: [{ name: "Curl Defining Cream", qty: 1, price: 60 }],
  },
];

// products a customer has wishlisted, ids referencing the products table
export const myWishlist = ["hair-growth-serum", "curl-defining-cream"];