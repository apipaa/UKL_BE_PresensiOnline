/** load library express */
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

// Inisialisasi server
const app = express();
const PORT = 8000;

// Middleware
app.use(cors()); // Aktifkan CORS untuk akses lintas domain
app.use(express.json()); // Untuk memproses JSON
app.use(express.urlencoded({ extended: true })); // Untuk memproses URL-encoded data

// Rute
const authRoute = require('./routes/auth.route'); // Path ke file auth.route.js
const userRoute = require('./routes/user.route'); // Path ke file user.route.js
const presensiRoute = require('./routes/presensi.route'); // Path ke file presensi.route.js

app.use('/api', authRoute); // Rute untuk autentikasi
app.use('/user', userRoute); // Rute untuk user
app.use('/api/presensi', presensiRoute); // Rute untuk presensi

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
