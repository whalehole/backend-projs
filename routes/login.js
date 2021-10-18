const express = require('express');
const router = express.Router();
const UserService = require('./../service/user');
const TokenService = require('./../service/token');

const userService = new UserService();
const tokenService = new TokenService();

// LOGIN USER
router.get('/', async (req, res)=>{
    const userIsExist = await userService.isExist(req.body.email);
    if (!userIsExist)
        res.status(400).send({status: 'User does not exist', token: null});

    const userIsAuthenticated = await userService.isAuthenticated(req.body.email, req.body.password);
    if (!userIsAuthenticated)
        res.status(401).send({status: 'User credentials are incorrect', token: null});

    const token = await tokenService.getToken(req.body.email);
    console.log('Token: ', token);
    res.status(200).send({status: 'User is authenticated', token: token});
})

module.exports = router;