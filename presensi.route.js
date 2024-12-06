const express = require('express');
const app = express();
app.use(express.json());
const router = express.Router(); // Inisialisasi router

const attendanceController = require('../controllers/presensi.controller.js'); // Import presensi.controller.js
const { authorize } = require('../controllers/auth.controller.js'); // Pastikan authorize di-import dengan benar
const presensiController = require('../controllers/presensi.controller.js');


// *Routes untuk presensi*
app.post('/', attendanceController.addAttendance); // Menambahkan data presensi baru
app.post('/kehadiran', presensiController.addAttendance); // Menambahkan presensi
app.get('/history/:iduser', presensiController.history);
app.get('/monthly/:iduser/:month/:year', presensiController.getAttendanceForMonth); // Menampilkan data presensi selama satu bulan

module.exports = app