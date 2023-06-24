const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    username: {
        type: String,
    },
    name: {
        type: String,
    }, 
    phone: {
        type: String,
    },
    password: {
        type: String,
    }, 
});
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);

const orderSchema = new Schema({
    user_id: {
        type: String,
        required: true,
    },
    name: {
        type: [String],
        required: true,
    }, 
    quantity: {
        type: [Number],
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    }, 
}, {timestamps: true});
const Order = mongoose.model('Order', orderSchema);

const menuItemSchema = new Schema({
    name: {
        type: String,
        required: true,
    }, 
    imageLink: {
        type: String,
        required: true,
    }, 
    price: {
        type: Number,
        required: true,
    }, 
});
const MenuItem = mongoose.model('MenuItem', menuItemSchema);

const cartItemSchema = new Schema({
    name: {
        type: String,
        required: true,
    }, 
    imageLink: {
        type: String,
        required: true,
    }, 
    price: {
        type: Number,
        required: true,
    }, 
    quantity: {
        type: Number,
        default: 1
    }
});
const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = {
    CartItem,
    MenuItem,
    Order,
    User,
}