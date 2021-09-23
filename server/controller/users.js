const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports.getUserController = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.findById(req.params.id);
        const {passsword, updatedAt, ...args} = user._doc;
        res.status(200).json(args);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports.userUpdateController = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if(req.body.userId ===  req.params.id || req.body.isAdmin) {
        if(req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hasd(req.body.password, salt);
            } catch(err) {
                console.error(err.message);
                res.status(500).send('Server error');    
            }
        } 
        try {
            await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json('Account Updated');
        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }       
    } else {
        return res.status(400).json({
          errors: [{ msg: 'Invalid credentials' }],
        });
    }

};
module.exports.userDeleteController = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if(req.body.userId ===  req.params.id || req.body.isAdmin) {
        if(req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hasd(req.body.password, salt);
            } catch(err) {
                console.error(err.message);
                res.status(500).send('Server error');    
            }
        } 
        try {
            await User.findByIdAndDelete(req.params.id);
            return res.status(200).json('Account Deleted');
        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }       
    } else {
        return res.status(400).json({
          errors: [{ msg: 'Invalid credentials' }],
        });
    }

};

module.exports.followController = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.params.userId);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({$push: { followers: req.body.userId}});
                await currentUser.updateOne({$push: { followings: req.body.userId}});
                res.status(200).json('Following User');
            } else {
                return res.status(403).json({
                errors: [{ msg: 'Already following this user' }],
                });        
            }
        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    } else {
        return res.status(403).json({
        errors: [{ msg: 'You cannot follow yourself' }],
        });
    }
};

module.exports.unfollowController = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.params.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({$pull: { followers: req.body.userId}});
                await currentUser.updateOne({$pull: { followings: req.body.userId}});
                res.status(200).json('Unfollowed User');
            } else {
                return res.status(403).json({
                errors: [{ msg: 'You do not follow this user' }],
                });        
            }
        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    } else {
        return res.status(403).json({
        errors: [{ msg: 'You cannot unfollow yourself' }],
        });
    }
};