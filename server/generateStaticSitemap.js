import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from './models/Product.js';
import Category from './models/Category.js';
import Brand from './models/Brand.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const generateSitemap = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const baseUrl = 'https://techstores.uz';
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        const addUrl = (path, priority = 0.5, changefreq = 'weekly', lastmod = new Date()) => {
            const dateStr = new Date(lastmod).toISOString().split('T')[0];
            xml += `  <url>\n    <loc>${baseUrl}${path}</loc>\n    <lastmod>${dateStr}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority.toFixed(1)}</priority>\n  </url>\n`;
        };

        // Static Pages
        addUrl('/', 1.0, 'daily');
        addUrl('/products', 0.9, 'daily');
        addUrl('/about', 0.5, 'monthly');
        addUrl('/contact', 0.5, 'monthly');
        addUrl('/faq', 0.5, 'monthly');

        console.log('Fetching products...');
        const products = await Product.find({}).select('slug updatedAt');
        products.forEach(product => {
            addUrl(`/product/${product.slug}`, 0.8, 'weekly', product.updatedAt);
        });

        console.log('Fetching categories...');
        const categories = await Category.find({}).select('slug updatedAt');
        categories.forEach(category => {
            addUrl(`/category/${category.slug}`, 0.7, 'weekly', category.updatedAt);
        });

        console.log('Fetching brands...');
        const brands = await Brand.find({}).select('slug updatedAt');
        brands.forEach(brand => {
            addUrl(`/brand/${brand.slug}`, 0.7, 'weekly', brand.updatedAt);
        });

        xml += `</urlset>`;

        // Save to server/sitemap.xml (the file the user has open)
        const serverSitemapPath = path.join(__dirname, 'sitemap.xml');
        fs.writeFileSync(serverSitemapPath, xml);
        console.log(`Saved sitemap to ${serverSitemapPath}`);

        // Save to client/public/sitemap.xml (for frontend deployment)
        const clientSitemapPath = path.join(__dirname, '..', 'client', 'public', 'sitemap.xml');
        if (fs.existsSync(path.dirname(clientSitemapPath))) {
            fs.writeFileSync(clientSitemapPath, xml);
            console.log(`Saved sitemap to ${clientSitemapPath}`);
        } else {
            console.log(`Could not find client/public directory, skipping client save.`);
        }

        console.log('Sitemap generated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error generating sitemap:', error);
        process.exit(1);
    }
};

generateSitemap();
