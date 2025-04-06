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

module.exports = {
    hashPassword,
    comparePasswords,
};
