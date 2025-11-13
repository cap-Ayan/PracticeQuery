const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function  generateHashedPassword(password){
    const salt= await bcrypt.genSalt(10);
    const hashedPassword =await bcrypt.hash(password, salt);
    return hashedPassword;
}


async function verifyPassword(password, hashedPassword){
    try {
 return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
 console.error('Error verifying password:', error);
 throw new Error('Password verification failed');
    }
}

async function generateToken(payload){
    try {
 const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '10h'});
 return token;
    } catch (error) {
 console.error('Error generating token:', error);
 throw new Error('Token generation failed');
    }
}

async function verifyToken(token){
    try {
 const decoded =jwt.verify(token, process.env.JWT_SECRET);
 return decoded;
    } catch (error) {
 console.error('Error verifying token:', error);
 throw new Error('Token verification failed');
    }
}

module.exports = {
    generateHashedPassword,
    verifyPassword,
    generateToken,
    verifyToken
}