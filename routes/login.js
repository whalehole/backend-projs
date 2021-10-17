const express = require('express');
const router = express.Router();
const pool = require('./../db/pool');
const UserService = require('./../service/user');
const TokenService = require('./../service/token');

// LOGIN USER
router.get('/', async (req, res)=>{
    const userService = new UserService(req.body.email);
    const userIsExist = await userService.isExist();
    if (!userIsExist)
        res.status(400).send({status: 'User does not exist', token: null});

    const userIsAuthenticated = await userService.isAuthenticated(req.body.password);
    if (!userIsAuthenticated)
        res.status(401).send({status: 'User credentials are incorrect', token: null});

    const tokenService = new TokenService(req.body.email);
    const token = await tokenService.getToken();
    console.log('Token: ', token);
    res.status(200).send({status: 'User is authenticated', token: token});
})

module.exports = router;