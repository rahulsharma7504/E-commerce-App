const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    Products: [{
        ProductName: {
            type: String,
            required: true
        },
        ProductID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "products" // Adjust the reference model name as needed
        }
    }],
    UserID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user" // Adjust the reference model name as needed
    },
    TransactionID: {
        type: String,
    },
    Status: {
        type: String,
        default: "Pending"
    },
    Amount: {
        type: Number,
        required: true
    },
    Currency: {
        type: String,
        required: true
    }
},
 {strict:false},
 
{ timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
