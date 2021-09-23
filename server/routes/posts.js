const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const auth = require('../middleware/auth');
const {
    createPostContoller,
    getPostContoller,
    updatePostContoller,
    deletePostContoller,
    likePostContoller,
    getAllPostsContoller

} = require('../controller/posts');
//create post
router.post('/', auth, createPostContoller);
//get post
router.get('/:id', auth, getPostContoller);
//update post
router.put('/:id', auth, updatePostContoller);
//delete post
router.delete('/:id', auth, deletePostContoller);
//like post
router.post('/:id/like', auth, likePostContoller);

//get a list of posts
router.get('/timeline/all', auth, getAllPostsContoller);


module.exports = router;