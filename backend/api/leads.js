const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// POST /api/leads - Create or Update a lead
router.post('/', async (req, res) => {
    const { contactInfo, name, company, interest, budget, urgency } = req.body;
    if (!contactInfo) {
        return res.status(400).json({ message: 'Contact info is required.' });
    }

    try {
        let lead = await Lead.findOneAndUpdate(
            { contactInfo },
            { name, company, interest, budget, urgency, $push: { history: { note: 'Lead data updated via chatbot.' } } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.status(201).json(lead);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// GET /api/leads - Search and filter leads
router.get('/', async (req, res) => {
    try {
        const { contactInfo, status } = req.query;
        let filter = {};
        if (contactInfo) filter.contactInfo = contactInfo;
        if (status) filter.status = status;

        const leads = await Lead.find(filter).sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// GET /api/leads/:id - Get lead details
router.get('/:id', async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) return res.status(404).json({ message: 'Lead not found' });
        res.json(lead);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// PATCH /api/leads/:id - Update lead status or data
router.patch('/:id', async (req, res) => {
    try {
        const { status, note } = req.body;
        const updateData = {};
        if (status) updateData.status = status;
        if (note) updateData.$push = { history: { note } };

        const lead = await Lead.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!lead) return res.status(404).json({ message: 'Lead not found' });
        res.json(lead);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;