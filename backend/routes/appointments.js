const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment'); // Assuming you have an Appointment model

// Schedule a new appointment
router.post('/schedule-appointment', async (req, res) => {
    try {
        const appointment = new Appointment(req.body);
        await appointment.save();
        res.status(201).json(appointment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all appointments
router.get('/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete an appointment
router.delete('/appointments/:appointmentId', async (req, res) => {
    try {
        const result = await Appointment.deleteOne({ _id: req.params.appointmentId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.status(200).json({ message: 'Appointment canceled' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
