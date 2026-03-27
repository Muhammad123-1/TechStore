import express from 'express';
import {
    getSitemapIndex,
    getProductsSitemap,
    getCategoriesSitemap,
    getBrandsSitemap
} from '../controllers/sitemapController.js';

const router = express.Router();

router.get('/sitemap.xml', getSitemapIndex);
router.get('/sitemap-products.xml', getProductsSitemap);
router.get('/sitemap-categories.xml', getCategoriesSitemap);
router.get('/sitemap-brands.xml', getBrandsSitemap);

export default router;
