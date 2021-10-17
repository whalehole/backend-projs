const pool = require('./../db/pool');

class UserService {
    constructor( userEmail, userSub="" ) {
        this.userEmail = userEmail;
        this.userSub = userSub;
    }
    // check if user exists in the db
    isExist = () => 
        pool.query(`SELECT * FROM public.user WHERE email = $1 AND is_deleted = false`, [this.userEmail])
        .then(result => {
            console.log(result.rows);
            if (result.rows.length !== 0)
                return true;
            return false;
        })
        .catch(err => console.log(err.stack));
    
    // check if user password is correct
    isAuthenticated = (password) => 
        pool.query(`SELECT password FROM public.user WHERE email = $1 AND is_deleted = false`, [this.userEmail])
        .then(result => {
            console.log(result.rows);
            const pw = result.rows[0]['password'];
            if (pw === password)
                return true;
            return false;
        })
        .catch(err => console.log(err.stack));

    // get user id
    getId = () => 
        pool.query(`SELECT id FROM public.user WHERE email = $1 AND is_deleted = false`, [this.userEmail])
        .then(result => {
            console.log('userId: ', result.rows[0]['id']);
            return result.rows[0]['id'];
        })
        .catch(err => console.log(err.stack));
}

module.exports = UserService;