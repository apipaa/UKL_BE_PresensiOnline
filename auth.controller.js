const md5 = require('md5');
const jwt = require('jsonwebtoken');
const {User} = require('../models/index');

const authhenticate = async (request, response) => {
    // Hash the password and prepare the login data
    let dataLogin = {
        username: request.body.username,
        password: md5(request.body.password), // Hash the password before checking
    };

    console.log("Data Login:", dataLogin); // Debug log

    try {
        // Attempt to find the user based on the logfuin data (username + hashed password)
        let dataUser = await User.findOne({ where: dataLogin });

        if (dataUser) {
            console.log("User found:", dataUser); // Debug log

            // Prepare the payload for the JWT token
            let payload = JSON.stringify(dataUser);
            let secret = 'mokleters';  // Secret key for JWT signing
            let token = jwt.sign(payload, secret);

            // Send response with success and the generated token
            return response.json({
                success: true,
                logged: true,
                message: 'Authentication Succeeded',
                token: token
            });
        } else {
            console.log("No user found with provided credentials"); // Debug log for no match
            return response.status(401).json({
                success: false,
                logged: false,
                message: 'Authentication failed. Invalid username or password',
            });
        }
    } catch (error) {
        // Handle errors and log them
        console.log("Error:", error.message); // Debug log for any errors
        return response.status(500).json({
            success: false,
            message: 'An error occurred during authentication',
        });
    }
};

module.exports = { authhenticate };
