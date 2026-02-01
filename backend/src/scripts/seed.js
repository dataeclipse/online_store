import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  await User.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});

  const admin = await User.create({
    email: 'admin@store.com',
    password: 'admin123',
    name: 'Nurbolat Adminov',
    role: 'admin',
  });

  const customerData = [
    { email: 'dias@store.com', password: 'user123', name: 'Dias', role: 'customer' },
    { email: 'aigerim.s@mail.kz', password: 'user123', name: 'Aigerim Suleimenova', role: 'customer' },
    { email: 'damir.k@mail.kz', password: 'user123', name: 'Damir Kenzhebekov', role: 'customer' },
    { email: 'aruzhan.m@mail.kz', password: 'user123', name: 'Aruzhan Mukhtarova', role: 'customer' },
    { email: 'erlan.t@mail.kz', password: 'user123', name: 'Erlan Tolegenov', role: 'customer' },
    { email: 'dana.n@mail.kz', password: 'user123', name: 'Dana Nurgaliyeva', role: 'customer' },
    { email: 'askar.b@mail.kz', password: 'user123', name: 'Askar Bekturov', role: 'customer' },
    { email: 'user@store.com', password: 'user123', name: 'Bakhytzhan Yerzhanov', role: 'customer' },
  ];
  const customers = await Promise.all(customerData.map((c) => User.create(c)));

  const categories = await Category.insertMany([
    { name: 'Electronics', slug: 'electronics', description: 'Devices and gadgets' },
    { name: 'Clothing', slug: 'clothing', description: 'Apparel and fashion' },
    { name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Home appliances and kitchen' },
    { name: 'Sports & Outdoors', slug: 'sports-outdoors', description: 'Sports gear and outdoor' },
    { name: 'Books & Stationery', slug: 'books-stationery', description: 'Books and office supplies' },
    { name: 'Food & Beverages', slug: 'food-beverages', description: 'Groceries and drinks' },
    { name: 'Beauty & Health', slug: 'beauty-health', description: 'Cosmetics and wellness' },
  ]);

  const [elec, clothing, home, sports, books, food, beauty] = categories;

  const productImages = {
    'Wireless Mouse': 'https://m.media-amazon.com/images/I/51Wm0wuA53L._AC_UF894,1000_QL80_.jpg',
    'USB-C Cable 2m': 'https://m.media-amazon.com/images/I/61LDwBRLG3L.jpg',
    'Bluetooth Earbuds': 'https://m.media-amazon.com/images/I/61eKn1D9vrL._AC_UF894,1000_QL80_.jpg',
    'Power Bank 10000mAh': 'https://m.media-amazon.com/images/I/61n2oW8Xb1L._AC_UF894,1000_QL80_.jpg',
    'Keyboard Mechanical': 'https://m.media-amazon.com/images/I/71GTESZlpGL.jpg',
    'Webcam HD': 'https://m.media-amazon.com/images/I/81-rvqTiJnL.jpg',
    'Phone Stand': 'https://m.media-amazon.com/images/I/61KD4hoirXL.jpg',
    'Cotton T-Shirt': 'https://m.media-amazon.com/images/I/41uF42-1WwL._AC_UY1000_.jpg',
    'Denim Jacket': 'https://cdn11.bigcommerce.com/s-luvww1semp/images/stencil/1280x1280/products/2076/12530/as930-dnm%202020%20(2)__02752.1757416681.jpg?c=2',
    'Winter Scarf': 'https://m.media-amazon.com/images/I/51qcJRujFqL._AC_UF894,1000_QL80_.jpg',
    'Sports Leggings': 'https://www.zensah.com/cdn/shop/products/SeamlessBlack.jpg?v=1756475784',
    'Baseball Cap': 'https://m.media-amazon.com/images/I/81Yemj7PtNL._AC_UY1000_.jpg',
    'Socks Pack 5': 'https://cdn11.bigcommerce.com/s-n9rxa9j1s3/images/stencil/1280x1280/products/1473/2431/Subject_2048x2048_WhiteBG__77862.1752837260.jpg?c=1',
    'Coffee Maker': 'https://images.thdstatic.com/productImages/bacb76bc-3fbe-4f85-b89c-556f424b9d8a/svn/matte-black-cafe-drip-coffee-makers-c7cdaas3pd3-64_1000.jpg',
    'Desk Lamp LED': 'https://m.media-amazon.com/images/I/71XYgkTpyTL._AC_UF894,1000_QL80_.jpg',
    'Kitchen Scale': 'https://m.media-amazon.com/images/I/71OOqPk1fcL._AC_UF1000,1000_QL80_.jpg',
    'Storage Baskets Set': 'https://m.media-amazon.com/images/I/817Ci+HQuhL.jpg',
    'Water Kettle 1.7L': 'https://m.media-amazon.com/images/I/61V625Mo59L._AC_UF894,1000_QL80_.jpg',
    'Cutting Board Set': 'https://m.media-amazon.com/images/I/81RxQVl0guL._AC_UF894,1000_QL80_.jpg',
    'Yoga Mat': 'https://sunnyhealthfitness.com/cdn/shop/files/sunny-health-fitness-accessories-yoga-mat-sf-em02-gy-03_931fe43d-76e9-41a0-8521-01dd9157bc6c_750x.jpg?v=1745008225',
    'Dumbbells 2kg Pair': 'https://m.media-amazon.com/images/I/51Fbso74ZdL._AC_UF894,1000_QL80_.jpg',
    'Running Shoes': 'https://hips.hearstapps.com/hmg-prod/images/run-lightweight-running-shoes-682b51023eccc.jpg?crop=0.670xw:1.00xh;0.0994xw,0&resize=1200:*',
    'Water Bottle 750ml': 'https://m.media-amazon.com/images/I/51ZZTzM3rPL._AC_UF894,1000_QL80_.jpg',
    'Resistance Bands Set': 'https://blackmountainproducts.com/wp-content/uploads/2015/04/17.jpg',
    'Jump Rope': 'https://nwscdn.com/media/catalog/product/cache/h900xw900/n/e/newmain_1.jpg',
    'Notebook A5': 'https://www.atlasstationers.com/cdn/shop/products/notebook-medium-a5-edition-120-hardcover-203-numbered-pages-black-ruled_bfa4cb4b-1874-4a58-bd4e-749dcdae2be9.jpg?v=1751028129&width=1214',
    'Ballpoint Pens Pack 10': 'https://i5.walmartimages.com/seo/BIC-Cristal-Xtra-Smooth-Stic-Blue-Ball-Pens-Medium-Point-1-0mm-10-Count-Pack_193328c1-d376-4cb1-abeb-56695fb557ff.bd4ce175106169b5d56ac6d9b88f180d.jpeg',
    'Sticky Notes Set': 'https://i5.walmartimages.com/seo/Post-it-Super-Sticky-Notes-Lined-4-in-x-4-in-Assorted-Brights-3-Pads_770d62bd-0c2e-4c98-a07f-a1b2b0b2ff98.35198499d3f22780d6a988a8a1b0ec3e.jpeg',
    'Desk Organizer': 'https://m.media-amazon.com/images/I/61G6PeIO+QL._AC_UF894,1000_QL80_.jpg',
    'Calculator': 'https://m.media-amazon.com/images/I/61sr+e5rRXL._AC_UF894,1000_QL80_.jpg',
    'Folder with Clips': 'https://m.media-amazon.com/images/I/41IbcCYXQTL._AC_UF894,1000_QL80_.jpg',
    'Green Tea Box 20': 'https://m.media-amazon.com/images/I/81R7a2k+aaL.jpg',
    'Honey Jar 500g': 'https://i5.walmartimages.com/seo/Alshifa-Natural-Honey-500g_581d28d6-d9dd-4ecb-a839-d899ab69873f.2ff994f9cddc61300a1fe7273778cfa7.jpeg',
    'Instant Coffee 200g': 'https://m.media-amazon.com/images/I/81AQKqXjUrL._AC_UF894,1000_QL80_.jpg',
    'Mixed Nuts 200g': 'https://heeraimpex.com/wp-content/uploads/2025/03/DM_RS-Mix-Dryfruits_200g.png',
    'Chocolate Bar': 'https://www.lindtusa.com/media/catalog/product/c/7/c73a3c9c226510eef3239f649c4f3be6eefebfe3df16a77c86b11652933d38a0.jpeg?quality=80&fit=bounds&height=500&width=500&canvas=500:500',
    'Dried Fruits 300g': 'https://profoodcorp.com/wp-content/uploads/2020/04/abgb300g.jpg',
    'Hand Cream 100ml': 'https://m.media-amazon.com/images/I/61zZz75-XQL._AC_UF894,1000_QL80_.jpg',
    'Shampoo 400ml': 'https://m.media-amazon.com/images/I/71C+08MDDFL._AC_UF1000,1000_QL80_.jpg',
    'Toothbrush Set 4': 'https://m.media-amazon.com/images/I/71DKqWJzFGL._AC_UF1000,1000_QL80_.jpg',
    'Face Mask Sheet 5pk': 'https://www.drjart.com/media/export/cms/products/1000x1000/dj_sku_H7HX01_1000x1000_1.jpg',
    'Sunscreen SPF50': 'https://m.media-amazon.com/images/I/51vmyJz0waL._AC_UF1000,1000_QL80_.jpg',
    'Lip Balm Set 3': 'https://m.media-amazon.com/images/I/713h4R5MIfL._AC_UF1000,1000_QL80_.jpg',
  };

  const products = [
    { name: 'Wireless Mouse', description: 'Ergonomic wireless mouse', price: 8500, stock: 50, category: elec._id, images: [productImages['Wireless Mouse']] },
    { name: 'USB-C Cable 2m', description: 'Fast charging cable', price: 3200, stock: 100, category: elec._id, images: [productImages['USB-C Cable 2m']] },
    { name: 'Bluetooth Earbuds', description: 'Noise cancelling earbuds', price: 25000, stock: 40, category: elec._id, images: [productImages['Bluetooth Earbuds']] },
    { name: 'Power Bank 10000mAh', description: 'Portable charger', price: 12000, stock: 60, category: elec._id, images: [productImages['Power Bank 10000mAh']] },
    { name: 'Keyboard Mechanical', description: 'RGB mechanical keyboard', price: 45000, stock: 25, category: elec._id, images: [productImages['Keyboard Mechanical']] },
    { name: 'Webcam HD', description: '1080p webcam for video calls', price: 28000, stock: 35, category: elec._id, images: [productImages['Webcam HD']] },
    { name: 'Phone Stand', description: 'Adjustable desk phone stand', price: 5500, stock: 80, category: elec._id, images: [productImages['Phone Stand']] },
    { name: 'Cotton T-Shirt', description: 'Comfortable cotton tee', price: 6500, stock: 80, category: clothing._id, images: [productImages['Cotton T-Shirt']] },
    { name: 'Denim Jacket', description: 'Classic denim jacket', price: 22000, stock: 30, category: clothing._id, images: [productImages['Denim Jacket']] },
    { name: 'Winter Scarf', description: 'Warm wool scarf', price: 8900, stock: 45, category: clothing._id, images: [productImages['Winter Scarf']] },
    { name: 'Sports Leggings', description: 'Stretch athletic leggings', price: 11000, stock: 55, category: clothing._id, images: [productImages['Sports Leggings']] },
    { name: 'Baseball Cap', description: 'Unisex cotton cap', price: 4500, stock: 70, category: clothing._id, images: [productImages['Baseball Cap']] },
    { name: 'Socks Pack 5', description: 'Pack of 5 cotton socks', price: 3800, stock: 100, category: clothing._id, images: [productImages['Socks Pack 5']] },
    { name: 'Coffee Maker', description: 'Drip coffee maker 1.2L', price: 35000, stock: 20, category: home._id, images: [productImages['Coffee Maker']] },
    { name: 'Desk Lamp LED', description: 'Adjustable LED desk lamp', price: 15000, stock: 40, category: home._id, images: [productImages['Desk Lamp LED']] },
    { name: 'Kitchen Scale', description: 'Digital kitchen scale', price: 7500, stock: 50, category: home._id, images: [productImages['Kitchen Scale']] },
    { name: 'Storage Baskets Set', description: 'Set of 3 woven baskets', price: 12000, stock: 35, category: home._id, images: [productImages['Storage Baskets Set']] },
    { name: 'Water Kettle 1.7L', description: 'Electric kettle', price: 18000, stock: 30, category: home._id, images: [productImages['Water Kettle 1.7L']] },
    { name: 'Cutting Board Set', description: '3-piece bamboo cutting boards', price: 9500, stock: 45, category: home._id, images: [productImages['Cutting Board Set']] },
    { name: 'Yoga Mat', description: 'Non-slip yoga mat 6mm', price: 14000, stock: 40, category: sports._id, images: [productImages['Yoga Mat']] },
    { name: 'Dumbbells 2kg Pair', description: 'Pair of 2kg dumbbells', price: 8500, stock: 35, category: sports._id, images: [productImages['Dumbbells 2kg Pair']] },
    { name: 'Running Shoes', description: 'Lightweight running shoes', price: 42000, stock: 25, category: sports._id, images: [productImages['Running Shoes']] },
    { name: 'Water Bottle 750ml', description: 'Insulated stainless steel', price: 6500, stock: 60, category: sports._id, images: [productImages['Water Bottle 750ml']] },
    { name: 'Resistance Bands Set', description: 'Set of 5 resistance bands', price: 11000, stock: 50, category: sports._id, images: [productImages['Resistance Bands Set']] },
    { name: 'Jump Rope', description: 'Adjustable speed jump rope', price: 3500, stock: 70, category: sports._id, images: [productImages['Jump Rope']] },
    { name: 'Notebook A5', description: 'Hardcover ruled notebook', price: 2500, stock: 100, category: books._id, images: [productImages['Notebook A5']] },
    { name: 'Ballpoint Pens Pack 10', description: 'Pack of 10 blue pens', price: 1800, stock: 120, category: books._id, images: [productImages['Ballpoint Pens Pack 10']] },
    { name: 'Sticky Notes Set', description: 'Assorted sticky notes 6 packs', price: 4200, stock: 65, category: books._id, images: [productImages['Sticky Notes Set']] },
    { name: 'Desk Organizer', description: 'Multipurpose desk organizer', price: 9500, stock: 40, category: books._id, images: [productImages['Desk Organizer']] },
    { name: 'Calculator', description: 'Scientific calculator', price: 7500, stock: 30, category: books._id, images: [productImages['Calculator']] },
    { name: 'Folder with Clips', description: 'A4 folder with clips', price: 1500, stock: 90, category: books._id, images: [productImages['Folder with Clips']] },
    { name: 'Green Tea Box 20', description: 'Green tea bags 20 count', price: 2800, stock: 80, category: food._id, images: [productImages['Green Tea Box 20']] },
    { name: 'Honey Jar 500g', description: 'Natural honey', price: 4500, stock: 45, category: food._id, images: [productImages['Honey Jar 500g']] },
    { name: 'Instant Coffee 200g', description: 'Instant coffee jar', price: 5500, stock: 60, category: food._id, images: [productImages['Instant Coffee 200g']] },
    { name: 'Mixed Nuts 200g', description: 'Roasted mixed nuts', price: 3800, stock: 70, category: food._id, images: [productImages['Mixed Nuts 200g']] },
    { name: 'Chocolate Bar', description: 'Dark chocolate 100g', price: 2200, stock: 100, category: food._id, images: [productImages['Chocolate Bar']] },
    { name: 'Dried Fruits 300g', description: 'Assorted dried fruits', price: 4200, stock: 55, category: food._id, images: [productImages['Dried Fruits 300g']] },
    { name: 'Hand Cream 100ml', description: 'Moisturizing hand cream', price: 3500, stock: 65, category: beauty._id, images: [productImages['Hand Cream 100ml']] },
    { name: 'Shampoo 400ml', description: 'Nourishing shampoo', price: 6500, stock: 50, category: beauty._id, images: [productImages['Shampoo 400ml']] },
    { name: 'Toothbrush Set 4', description: 'Soft bristle toothbrushes', price: 2800, stock: 80, category: beauty._id, images: [productImages['Toothbrush Set 4']] },
    { name: 'Face Mask Sheet 5pk', description: 'Hydrating sheet masks', price: 5500, stock: 45, category: beauty._id, images: [productImages['Face Mask Sheet 5pk']] },
    { name: 'Sunscreen SPF50', description: 'Face sunscreen 50ml', price: 8500, stock: 40, category: beauty._id, images: [productImages['Sunscreen SPF50']] },
    { name: 'Lip Balm Set 3', description: 'Assorted lip balms', price: 3200, stock: 70, category: beauty._id, images: [productImages['Lip Balm Set 3']] },
  ];

  await Product.insertMany(products);

  console.log('Seed done.');
  console.log('Admin: admin@store.com / admin123 (Nurbolat Adminov)');
  console.log('Customers (Kazakh names): aigerim.s@mail.kz, damir.k@mail.kz, aruzhan.m@mail.kz, etc. / user123');
  console.log(`Created: ${categories.length} categories, ${products.length} products, ${1 + customers.length} users. All prices in KZT.`);
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
