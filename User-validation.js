const { request, response } = require("express");
const joi = require("joi"); // Pastikan ini sudah diinstal dengan perintah: npm install joi

const validateUser = (request, response, next) => {
    const rules = joi
        .object()
        .keys({
            name: joi.string().required(),
            username: joi.string().required(),
            password: joi.string().required(),
            role: joi.string().required()
        })
        .options({ abortEarly: false });

    const { error } = rules.validate(request.body);

    if (error) {
        // Typo diperbaiki dari errMessege ke errMessage
        const errMessage = error.details.map(it => it.message).join(", ");
        return response.status(422).json({
            success: false,
            message: errMessage // Typo diperbaiki
        });
    }

    next();
};

module.exports = { validateUser };
