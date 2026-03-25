import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';
import Category from './models/Category.js';
import Brand from './models/Brand.js';
import Product from './models/Product.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

async function checkCounts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const users = await User.countDocuments();
        const categories = await Category.countDocuments();
        const brands = await Brand.countDocuments();
        const products = await Product.countDocuments();

        console.log(`📊 Current Counts:`);
        console.log(`   - Users: ${users}`);
        console.log(`   - Categories: ${categories}`);
        console.log(`   - Brands: ${brands}`);
        console.log(`   - Products: ${products}`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkCounts();
