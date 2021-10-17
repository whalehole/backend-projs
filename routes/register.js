const express = require('express');
const router = express.Router();
const pool = require('./../db/pool');

// CREATE NEW USER
router.post('/', (req, res)=>{
    pool.query(`INSERT INTO public.user(email, password) VALUES($1, $2) RETURNING *`, [req.body.email, req.body.password])
    .then(result => {
        console.log('Account created!');
        console.log(result.rows);
        res.status(200).send("Account created!");
    })
    .catch(err => {
        console.log(err.stack);
        res.status(400).send(err);
    });
})

module.exports = router;