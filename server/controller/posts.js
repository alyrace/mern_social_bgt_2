const User = require('../models/user');
const Post = require('../models/post');

module.exports.createPostContoller = async(req, res, next => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports.getPostContoller = async(req, res, next => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports.updatePostContoller = async(req, res, next => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({$set:req.body});
            res.status(200).json('Post has been updated');
        } else {
            return res.status(403).json({
                errors: [{ msg: 'You can only update one post' }],
            });
        }
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports.deletePostContoller = async(req, res, next => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json('Post has been deleted');
        } else {
            return res.status(403).json({
                errors: [{ msg: 'You can only delete one post' }],
            });
        }
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports.likePostContoller = async(req, res, next => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)){
            await post.updateOne({$push: {likes: req.body.userId}});
            res.status(200).json('Post has been liked');
        } else {
            await post.updateOne({$pull: {likes: req.body.userId}});
            res.status(200).json('Post has been disliked');
        }
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports.getAllPostsContoller = async(req, res, next => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let postArray = [];
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({userId: currentUser._id});
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({userId: friendId});
            })
        );
        res.json(userPosts.concat(...friendPosts));
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});