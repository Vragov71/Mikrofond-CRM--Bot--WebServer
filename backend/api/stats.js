const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// GET /api/stats - Get aggregated lead data
router.get('/', async (req, res) => {
    try {
        const leadsByStatus = await Lead.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const leadsBySource = await Lead.aggregate([
            { $group: { _id: '$source', count: { $sum: 1 } } }
        ]);

        const totalLeads = await Lead.countDocuments();

        res.json({
            totalLeads,
            leadsByStatus,
            leadsBySource
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;