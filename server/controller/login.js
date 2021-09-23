const User = require('../models/user');

const loginController = async(req, res, next) => {
    try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

module.exports  = loginController;