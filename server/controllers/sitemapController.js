import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Brand from '../models/Brand.js';
import config from '../config/config.js';

// Simple memory caches for each sitemap piece (1 hour cache)
const CACHE_TTL = 60 * 60 * 1000;
const caches = {
    index: { data: null, time: 0 },
    products: { data: null, time: 0 },
    categories: { data: null, time: 0 },
    brands: { data: null, time: 0 }
};

const getBaseUrl = () => {
    // Return primary production domain or config client URL
    return 'https://techstores.uz';
};

export const getSitemapIndex = asyncHandler(async (req, res) => {
    if (caches.index.data && (Date.now() - caches.index.time < CACHE_TTL)) {
        res.header('Content-Type', 'application/xml');
        return res.send(caches.index.data);
    }

    const baseUrl = getBaseUrl();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-products.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-categories.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-brands.xml</loc>
  </sitemap>
</sitemapindex>`;

    caches.index.data = xml;
    caches.index.time = Date.now();

    res.header('Content-Type', 'application/xml');
    res.send(xml);
});

export const getProductsSitemap = asyncHandler(async (req, res) => {
    if (caches.products.data && (Date.now() - caches.products.time < CACHE_TTL)) {
        res.header('Content-Type', 'application/xml');
        return res.send(caches.products.data);
    }

    try {
        const baseUrl = getBaseUrl();
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        const addUrl = (path, priority = 0.5, changefreq = 'weekly', lastmod = new Date()) => {
            const dateStr = new Date(lastmod).toISOString();
            xml += `  <url>\n    <loc>${baseUrl}${path}</loc>\n    <lastmod>${dateStr}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority.toFixed(1)}</priority>\n  </url>\n`;
        };

        // Static Pages that relate to primary product browsing can go here or their own page. 
        // We'll add the main static pages to products sitemap or index them here for simplicity
        addUrl('/', 1.0, 'daily');
        addUrl('/products', 0.9, 'daily');
        addUrl('/about', 0.5, 'monthly');
        addUrl('/contact', 0.5, 'monthly');
        addUrl('/faq', 0.5, 'monthly');

        const products = await Product.find({ isActive: true }).select('slug updatedAt');
        products.forEach(product => {
            addUrl(`/product/${product.slug}`, 0.8, 'weekly', product.updatedAt);
        });

        xml += `</urlset>`;

        caches.products.data = xml;
        caches.products.time = Date.now();

        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        console.error('Error generating products sitemap:', error);
        res.status(500).json({ error: 'Sitemap generation failed' });
    }
});

export const getCategoriesSitemap = asyncHandler(async (req, res) => {
    if (caches.categories.data && (Date.now() - caches.categories.time < CACHE_TTL)) {
        res.header('Content-Type', 'application/xml');
        return res.send(caches.categories.data);
    }

    try {
        const baseUrl = getBaseUrl();
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        const addUrl = (path, priority = 0.7, changefreq = 'weekly', lastmod = new Date()) => {
            const dateStr = new Date(lastmod).toISOString();
            xml += `  <url>\n    <loc>${baseUrl}${path}</loc>\n    <lastmod>${dateStr}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority.toFixed(1)}</priority>\n  </url>\n`;
        };

        const categories = await Category.find({ isActive: true }).select('slug updatedAt');
        categories.forEach(category => {
            addUrl(`/category/${category.slug}`, 0.7, 'weekly', category.updatedAt);
        });

        xml += `</urlset>`;

        caches.categories.data = xml;
        caches.categories.time = Date.now();

        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        console.error('Error generating categories sitemap:', error);
        res.status(500).json({ error: 'Sitemap generation failed' });
    }
});

export const getBrandsSitemap = asyncHandler(async (req, res) => {
    if (caches.brands.data && (Date.now() - caches.brands.time < CACHE_TTL)) {
        res.header('Content-Type', 'application/xml');
        return res.send(caches.brands.data);
    }

    try {
        const baseUrl = getBaseUrl();
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        const addUrl = (path, priority = 0.7, changefreq = 'weekly', lastmod = new Date()) => {
            const dateStr = new Date(lastmod).toISOString();
            xml += `  <url>\n    <loc>${baseUrl}${path}</loc>\n    <lastmod>${dateStr}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority.toFixed(1)}</priority>\n  </url>\n`;
        };

        const brands = await Brand.find({ isActive: true }).select('slug updatedAt');
        brands.forEach(brand => {
            addUrl(`/brand/${brand.slug}`, 0.7, 'weekly', brand.updatedAt);
        });

        xml += `</urlset>`;

        caches.brands.data = xml;
        caches.brands.time = Date.now();

        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        console.error('Error generating brands sitemap:', error);
        res.status(500).json({ error: 'Sitemap generation failed' });
    }
});
