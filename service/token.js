const jwt = require('jsonwebtoken');
const UserService = require('./../service/user');

class TokenService {
    constructor( email="" ) {
        this.email = email;
    }

    // get jwt token
    getToken = async () => {
        const userService = new UserService(this.email);
        const userId = await userService.getId();
        console.log('getToken userId: ', userId);
        return jwt.sign({email: this.email, id: userId}, '1234567890');
    }

    verifyToken = (token) => 
        jwt.verify(token.split(' ')[1], '1234567890', (err, decoded) => {
            if (err)
                console.log(err.stack);
            console.log('Decoded Token: ', decoded);
            return decoded;
        })
    
}

module.exports = TokenService;