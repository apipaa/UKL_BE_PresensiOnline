// routes/auth.route.js
const express = require('express');
const router = express.Router();
const { authhenticate } = require('../controllers/auth.controller');

// Rute POST untuk autentikasi
router.post('/auth', authhenticate);

module.exports = router;
