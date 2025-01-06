// Doctor form handling
const addDoctorForm = document.getElementById('addDoctorForm');
const doctorTable = document.getElementById('doctorTable').getElementsByTagName('tbody')[0];

addDoctorForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const doctorData = {
        doctorName: document.getElementById('doctorName').value,
        doctorSpecialty: document.getElementById('doctorSpecialty').value,
        doctorAge: parseInt(document.getElementById('doctorAge').value),
        doctorPhone: document.getElementById('doctorPhone').value,
        doctorAddress: document.getElementById('doctorAddress').value
    };

    try {
        const response = await fetch('http://localhost:5000/add-doctor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(doctorData)
        });

        const newDoctor = await response.json();
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${newDoctor.doctorName}</td>
            <td>${newDoctor.doctorSpecialty}</td>
            <td>${newDoctor.doctorAge}</td>
            <td>${newDoctor.doctorPhone}</td>
            <td>${newDoctor.doctorAddress}</td>
            <td><button onclick="removeDoctor(this)">Remove</button></td>
        `;
        doctorTable.appendChild(row);
        addDoctorForm.reset();
    } catch (error) {
        console.error('Error adding doctor:', error);
    }
});

// Function to remove a doctor
function removeDoctor(button) {
    const row = button.parentElement.parentElement;
    row.remove();
}

// Function to fetch and display doctors
async function fetchDoctors() {
    try {
        const response = await fetch('http://localhost:5000/doctors');
        const doctors = await response.json();

        doctors.forEach(doctor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${doctor.doctorName}</td>
                <td>${doctor.doctorSpecialty}</td>
                <td>${doctor.doctorAge}</td>
                <td>${doctor.doctorPhone}</td>
                <td>${doctor.doctorAddress}</td>
                <td><button onclick="removeDoctor(this)">Remove</button></td>
            `;
            doctorTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching doctors:', error);
    }
}
fetchDoctors();

const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor'); // Assuming you have a Doctor model

// Add a new doctor
router.post('/add-doctor', async (req, res) => {
    try {
        const doctor = new Doctor(req.body);
        await doctor.save();
        res.status(201).json(doctor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all doctors
router.get('/doctors', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
