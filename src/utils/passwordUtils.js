const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

/**
 * Hash a plain text password
 * @param {string} plainPassword
 * @returns {Promise<string>}
 */
const hashPassword = async (plainPassword) => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(plainPassword, salt);
};

/**
 * Compare plain text password with hashed password
 * @param {string} plainPassword
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
const comparePasswords = async (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
};

function isSafePassword(plainPassword) {
    const minLength = 8;

    // RegEx Breakdown:
    // (?=.*[a-z])        --> at least one lowercase
    // (?=.*[A-Z])        --> at least one uppercase
    // (?=.*\d)           --> at least one digit
    // (?=.*[!@#%^&*()_+=\-{}\[\]:;"'<>,?/|\\])  --> at least one "safe" special char
    // ^.{8,}$            --> minimum 8 characters

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#%^&*()_+=\-{}\[\]:;"'<>,?/|\\]).{8,}$/;

    // Avoid potentially dangerous characters for MongoDB ($, .)
    const mongoSafe = !/[\$\.]/.test(plainPassword);

    return strongPasswordRegex.test(plainPassword) && mongoSafe;
}

module.exports = {
    hashPassword,
    comparePasswords,
    isSafePassword,
};
