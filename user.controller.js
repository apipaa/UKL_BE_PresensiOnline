const md5 = require('md5');  // Pastikan untuk mengimpor md5
const { request, response } = require("express");
const { where } = require("sequelize");

const { User } = require('../models/index'); // User diambil dari models

exports.createUser = async (req, res) => {
    try {
      const { name, username, password, role } = req.body;
  
      // Validasi data
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required.',
        });
      }
  
      // Hash password menggunakan md5
      const hashedPassword = md5(password); 
  
      // Membuat user baru dengan password yang sudah di-hash
      const newUser = await User.create({
        name,
        username,
        password: hashedPassword,  // Simpan password yang sudah di-hash
        role,
      });
  
      // Kirimkan respons jika berhasil
      res.status(201).json({
        success: true,
        message: 'User created successfully.',
        data: { 
            id: newUser.id, // Menyertakan ID dalam data respons
                name: newUser.name,
                username: newUser.username,
                role: newUser.role
         },
      });
    } catch (error) {
      // Jika ada error, kirimkan respons dengan status 500
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };     


exports.getAllUser = async (request, response) => {
    try {
        let users = await User.findOne();
        return response.json({
            success: true,
            data: users,
            message: `All users have been loaded`,
        });
    } catch (error) {
        return response.json({
            success: false,
            message: error.message,
        });
    }
};
const { user } = require('../models');
exports.findUser = async (request, response) => {
    try {
        let keyword = request.body.keyword;
        let users = await User.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.substring]: keyword } },
                    { username: { [Op.substring]: keyword } },
                    { password: { [Op.substring]: keyword } },
                    { role: { [Op.substring]: keyword } },
                ],
            },
        });
        return response.json({
            success: true,
            data: users,
            message: `Users matching keyword '${keyword}' have been loaded`,
        });
    }
    catch (error) {
        return response.json({
            success: false,
            message: error.message,
        });
    }
};

exports.addUser = (request, response) => {
    try {
        let newUser = {
            name: request.body.name,
            username: request.body.username,
            password: request.body.password,
            role: request.body.role,
            createdAt: new Date(),
            updateAt: new Date()
        };
        User
            .create(newUser)
            .then((result) => {
                return response.json({
                    success: true,
                    data: result,
                    message: `New user has been inserted`,
                });
            })
            .catch((error) => {
                return response.json({
                    success: false,
                    message: error.message,
                });
            });
    } catch (error) {
        return response.json({
            success: false,
            message: error.message,
        });
    }
};

exports.updateUser = async (request, response) => {
    try {
        // Ambil data dari request body
        const { name, username, password, role } = request.body;

        // Validasi input
        if (!name || !username || !password || !role) {
            return response.status(400).json({
                success: false,
                message: `"name", "username", "password", and "role" are required`,
            });
        }

        // Ambil ID user dari parameter
        const idUser = request.params.id;

        // Data yang akan diperbarui
        const dataUser = { name, username, password, role };

        // Update user di database
        const result = await User.update(dataUser, { where: { id: idUser } });

        if (result[0] === 0) {
            // Jika tidak ada row yang diperbarui
            return response.status(404).json({
                success: false,
                message: `User with id ${idUser} not found`,
            });
        }

        // Jika berhasil diupdate
        return response.json({
            success: true,
            message: 'User created successfully.',
            data: dataUser,      
        });
    } catch (error) {
        // Handle error
        return response.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


exports.deleteUser = (request, response) => {
    try {
        let idUser = request.params.id;

        User
            .destroy({ where: { id: idUser } })
            .then((result) => {
                return response.json({
                    success: true,
                    message: `User data has been deleted`,
                });
            })
            .catch((error) => {
                return response.json({
                    success: false,
                    message: error.message,
                });
            });
    } catch (error) {
        return response.json({
            success: false,
            message: error.message,
        });
    }
};
exports.authenticateUser = (req, res) => {
    const { username, password } = req.body;

    // Validasi: Pastikan username dan password ada di request body
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required.'  // Kirimkan pesan kesalahan jika ada field yang kosong
        });
    }

    // Jika semua field ada, lanjutkan logika lainnya
    // Misalnya, autentikasi pengguna dengan memeriksa ke database
    if (username === 'user' && password === 'password') {
        return res.status(200).json({
            success: true,
            message: 'Authenticated successfully'
        });
    } else {
        return res.status(401).json({
            success: false,
            message: 'Invalid username or password'
        });
    }
};

