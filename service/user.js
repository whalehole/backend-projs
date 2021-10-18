const pool = require('./../db/pool');

class UserService {
    constructor( userEmail, userSub="" ) {
        this.userEmail = userEmail;
        this.userSub = userSub;
    }
    // check if user exists in the db
    isExist = (userEmail) => 
        pool.query(`SELECT * FROM users WHERE email = $1 AND is_deleted = false`, [userEmail])
        .then(result => {
            console.log(result.rows);
            if (result.rows.length !== 0)
                return true;
            return false;
        })
        .catch(err => console.log(err.stack));
    
    // check if user password is correct
    isAuthenticated = (userEmail, password) => 
        pool.query(`SELECT password FROM users WHERE email = $1 AND is_deleted = false`, [userEmail])
        .then(result => {
            console.log(result.rows);
            const pw = result.rows[0]['password'];
            if (pw === password)
                return true;
            return false;
        })
        .catch(err => console.log(err.stack));

    // get user id
    getId = (userEmail) => 
        pool.query(`SELECT id FROM users WHERE email = $1 AND is_deleted = false`, [userEmail])
        .then(result => {
            console.log('userId: ', result.rows[0]['id']);
            return result.rows[0]['id'];
        })
        .catch(err => console.log(err.stack));
    
    // create user
    create = (email, password) =>
        pool.query(`INSERT INTO users(email, password) VALUES($1, $2) RETURNING *`, [email, password])
        .then(result => {
            console.log('Account created!');
            console.log(result.rows);
            return result.rows[0];
        })
        .catch(err => {
            console.log(err.stack);
            return err;
        });
}

module.exports = UserService;