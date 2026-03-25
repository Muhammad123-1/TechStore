import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';
import IPBlock from './models/IPBlock.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

async function unblockAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // 1. Unblock all IPs (to be safe)
        const blockResult = await IPBlock.deleteMany({});
        console.log(`Unblocked ${blockResult.deletedCount} IP(s)`);

        // 2. Clear failed attempts for admin
        const adminEmail = 'admin@techstore.uz';
        const user = await User.findOne({ email: adminEmail });

        if (user) {
            user.failedLoginAttempts = 0;
            user.accountLockedUntil = undefined;
            await user.save();
            console.log(`Cleared failed attempts for ${adminEmail}`);
        } else {
            console.log(`User ${adminEmail} not found`);
        }

        console.log('Unblock process completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error during unblocking:', error);
        process.exit(1);
    }
}

unblockAdmin();
