require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5000', optionsSuccessStatus: 200 }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital', {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        if (err.message.includes('conflicting non-empty namespace')) {
            console.error('Error: Target cluster has conflicting non-empty namespace with the dataset');
        } else {
            console.error('Error connecting to MongoDB:', err.message);
        }
        process.exit(1);
    });

// Patient Schema
const patientSchema = new mongoose.Schema({
    patientId: String,
    patientName: String,
    patientCondition: String,
    patientAge: Number,
    patientPhone: String,
    patientEmail: String,
    patientAddress: String,
    bloodGroup: String,
});

const Patient = mongoose.model('Patient', patientSchema);

// Doctor Schema
const doctorSchema = new mongoose.Schema({
    doctorName: String,
    doctorSpecialty: String,
    doctorAge: Number,
    doctorPhone: String,
    doctorAddress: String,
});

const Doctor = mongoose.model('Doctor', doctorSchema);

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
    patientId: String,
    doctorId: String,
    dateTime: String,
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Routes
app.post('/add-patient', async (req, res) => {
    const patient = new Patient(req.body);
    await patient.save();
    console.log('Patient added:', patient); // Log the added patient
    res.send(patient);
});

app.post('/add-doctor', async (req, res) => {
    const doctor = new Doctor(req.body);
    await doctor.save();
    console.log('Doctor added:', doctor); // Log the added doctor
    res.send(doctor);
});

app.post('/schedule-appointment', async (req, res) => {
    const appointment = new Appointment(req.body);
    await appointment.save();
    console.log('Appointment scheduled:', appointment); // Log the scheduled appointment
    res.send(appointment);
});

app.get('/patients', async (req, res) => {
    const patients = await Patient.find();
    res.send(patients);
});

app.get('/patients/:patientId', async (req, res) => {
    const patient = await Patient.findOne({ patientId: req.params.patientId });
    res.send(patient);
});

app.get('/doctors', async (req, res) => {
    const doctors = await Doctor.find();
    res.send(doctors);
});

app.get('/appointments', async (req, res) => {
    const appointments = await Appointment.find(req.query);
    res.send(appointments);
});

app.delete('/appointments/:appointmentId', async (req, res) => {
    try {
        const result = await Appointment.deleteOne({ _id: req.params.appointmentId });
        if (result.deletedCount === 0) {
            return res.status(404).send({ error: 'Appointment not found' });
        }
        res.send({ message: 'Appointment canceled' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
