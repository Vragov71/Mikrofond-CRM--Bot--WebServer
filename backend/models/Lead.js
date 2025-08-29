const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contactInfo: { type: String, required: true, unique: true, trim: true }, // Email or Phone
    company: { type: String, default: '' },
    interest: { type: String, default: '' },
    budget: { type: Number, default: 0 },
    urgency: { type: String, default: '' },
    source: { type: String, default: 'chatbot' },
    status: { type: String, default: 'new', enum: ['new', 'contacted', 'qualified', 'lost', 'won'] },
    history: [{
        timestamp: { type: Date, default: Date.now },
        note: { type: String }
    }],
}, { timestamps: true }); // timestamps adds createdAt and updatedAt

module.exports = mongoose.model('Lead', leadSchema);