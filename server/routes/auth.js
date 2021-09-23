const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authRouter = ('../controller/register');
const loginRouter = ('../controller/login');
const auth = require('../middleware/auth');

router.get('/login', auth, loginRouter)

router.post('/register', [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').exists(),
  ], authRouter
);

module.exports = router;