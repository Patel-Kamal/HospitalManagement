// Patient form handling
const addPatientForm = document.getElementById('addPatientForm');
const patientTable = document.getElementById('patientTable').getElementsByTagName('tbody')[0];

addPatientForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const patientData = {
        patientId: document.getElementById('patientId').value,
        patientName: document.getElementById('patientName').value,
        patientCondition: document.getElementById('patientCondition').value,
        patientAge: parseInt(document.getElementById('patientAge').value),
        patientPhone: document.getElementById('patientPhone').value,
        patientEmail: document.getElementById('patientEmail').value,
        patientAddress: document.getElementById('patientAddress').value,
        bloodGroup: document.getElementById('bloodGroup').value
    };

    try {
        const response = await fetch('http://localhost:5000/add-patient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(patientData)
        });

        const newPatient = await response.json();
        console.log('Added patient:', newPatient);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${newPatient.patientId}</td>
            <td>${newPatient.patientName}</td>
            <td>${newPatient.patientCondition}</td>
            <td>${newPatient.patientAge}</td>
            <td>${newPatient.patientPhone}</td>
            <td>${newPatient.patientEmail}</td>
            <td>${newPatient.patientAddress}</td>
            <td>${newPatient.bloodGroup}</td>
            <td><button onclick="removePatient(this)">Remove</button></td>
        `;
        patientTable.appendChild(row);
        addPatientForm.reset();
    } catch (error) {
        console.error('Error adding patient:', error);
    }
});

// Function to remove a patient
function removePatient(button) {
    const row = button.parentElement.parentElement;
    row.remove();
}

// Function to fetch and display patients
async function fetchPatients() {
    try {
        const response = await fetch('http://localhost:5000/patients');
        const patients = await response.json();

        patients.forEach(patient => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${patient.patientId}</td>
                <td>${patient.patientName}</td>
                <td>${patient.patientCondition}</td>
                <td>${patient.patientAge}</td>
                <td>${patient.patientPhone}</td>
                <td>${patient.patientEmail}</td>
                <td>${patient.patientAddress}</td>
                <td>${patient.bloodGroup}</td>
                <td><button onclick="removePatient(this)">Remove</button></td>
            `;
            patientTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching patients:', error);
    }
}
fetchPatients();

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

// Appointment form handling
const appointmentForm = document.getElementById('appointmentForm');
const appointmentTable = document.getElementById('appointmentTable').getElementsByTagName('tbody')[0];

appointmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const appointmentData = {
        patientId: document.getElementById('appointmentPatientId').value,
        doctorId: document.getElementById('appointmentDoctorId').value,
        dateTime: document.getElementById('appointmentDateTime').value
    };

    try {
        const response = await fetch('http://localhost:5000/schedule-appointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointmentData)
        });

        const newAppointment = await response.json();

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${newAppointment.id}</td>
            <td>${newAppointment.patientId}</td>
            <td>${newAppointment.doctorId}</td>
            <td>${newAppointment.dateTime}</td>
            <td><button onclick="removeAppointment(${newAppointment.id})">Cancel</button></td>
        `;
        appointmentTable.appendChild(row);
        appointmentForm.reset();
    } catch (error) {
        console.error('Error scheduling appointment:', error);
    }
});

// Function to remove an appointment
async function removeAppointment(appointmentId) {
    try {
        await fetch(`http://localhost:5000/appointments/${appointmentId}`, {
            method: 'DELETE'
        });
        fetchAppointments();
    } catch (error) {
        console.error('Error removing appointment:', error);
    }
}

// Function to fetch and display appointments
async function fetchAppointments() {
    try {
        const response = await fetch('http://localhost:5000/appointments');
        const appointments = await response.json();

        appointmentTable.innerHTML = '';
        appointments.forEach(appointment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${appointment.id}</td>
                <td>${appointment.patientId}</td>
                <td>${appointment.doctorId}</td>
                <td>${appointment.dateTime}</td>
                <td><button onclick="removeAppointment(${appointment.id})">Cancel</button></td>
            `;
            appointmentTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
    }
}
fetchAppointments();

// Medical history viewing
document.getElementById('viewHistoryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const patientId = document.getElementById('patientId').value;

    try {
        const response = await fetch(`http://localhost:5000/patients/${patientId}`);
        const patient = await response.json();

        if (patient) {
            document.getElementById('noHistoryMessage').style.display = 'none';
            document.getElementById('updateHistorySection').style.display = 'block';
        } else {
            document.getElementById('noHistoryMessage').style.display = 'block';
            document.getElementById('updateHistorySection').style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching medical history:', error);
    }
});

// Function to toggle dark mode
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}
