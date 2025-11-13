const {getUser,registerUser,loginUser,logoutUser} = require('../controllers/userController.js');

const authenticateUser = require('../middlewares/authMiddleware.js');


const express = require('express');
const router = express.Router();


router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/getUser',authenticateUser, getUser);

router.delete('/logout', logoutUser);

module.exports = router;



