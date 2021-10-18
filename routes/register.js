const express = require('express');
const router = express.Router();
const pool = require('./../db/pool');
const UserService = require('./../service/user');

const userService = new UserService();

// CREATE NEW USER
router.post('/', async (req, res)=>{
    const user = await userService.create(req.body.email, req.body.password);
    res.send(user);
})

module.exports = router;