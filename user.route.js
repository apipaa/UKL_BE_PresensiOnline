// routes/user.route.js
const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
let { validateUser } = require('../middleware/User-validation');

// Mendefinisikan rute
router.get("/:id", userController.getAllUser);
router.post("/", userController.createUser);  // Pastikan fungsi 'createUser' ada di controller

// Menambahkan middleware validasi pada rute tertentu
router.post("/", [validateUser], userController.createUser);
router.post("/find", userController.findUser);
router.put("/:id", [validateUser], userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.post("/auth", [validateUser], userController.authenticateUser);

router.get("/auth", (req, res) => {
    res.status(200).json({
        success: true,
        message: "This is the /auth GET route."
    });
});

// Mengekspor router
module.exports = router;
