import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    productSnapshot: {
        name: String,
        price: Number,
        image: String,
        sku: String
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    }
});

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function () { return this.sales_channel === 'online'; }
    },
    items: [orderItemSchema],
    sales_channel: {
        type: String,
        enum: ['online', 'pos'],
        default: 'online'
    },
    customerInfo: {
        name: {
            type: String,
            required: function () { return this.sales_channel === 'online'; }
        },
        email: {
            type: String,
            required: function () { return this.sales_channel === 'online'; }
        },
        phone: {
            type: String,
            required: function () { return this.sales_channel === 'online'; }
        }
    },
    shippingAddress: {
        street: { type: String, required: function () { return this.sales_channel === 'online'; } },
        city: { type: String, required: function () { return this.sales_channel === 'online'; } },
        state: String,
        country: { type: String, required: function () { return this.sales_channel === 'online'; }, default: 'Uzbekistan' },
        zipCode: String
    },
    geoLocation: {
        lat: Number,
        lng: Number
    },
    deliveryOption: {
        type: String,
        enum: ['standard', 'express', 'pickup'],
        default: 'standard'
    },
    deliveryFee: {
        type: Number,
        default: 0
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'online', 'cash'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentId: String,
    subtotal: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    promoCode: String,
    total: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    notes: String,
    statusHistory: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String
    }]
}, {
    timestamps: true
});

// Auto-generate order number
orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const count = await mongoose.model('Order').countDocuments();
        this.orderNumber = `TS${Date.now()}${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
