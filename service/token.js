require('dotenv').config();
const jwt = require('jsonwebtoken');
const UserService = require('./../service/user');

const userService = new UserService();

class TokenService {
    constructor( email="" ) {
        this.email = email;
    }

    // get jwt token
    getToken = async (userEmail) => {
        const userId = await userService.getId(userEmail);
        console.log('getToken userId: ', userId);
        return jwt.sign({email: userEmail, id: userId}, process.env.JWTSECRET);
    }

    verifyToken = (token) => 
        jwt.verify(token.split(' ')[1], process.env.JWTSECRET, (err, decoded) => {
            if (err)
                console.log(err.stack);
            console.log('Decoded Token: ', decoded);
            return decoded;
        })
    
}

module.exports = TokenService;