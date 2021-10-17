const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    res.status(200).send(`
        <form action="http://localhost:5000" method="POST">
            <input name="name" type="text" />
            <button type="submit">SUBMIT</button>
        </form>
    `)
})

router.post('/', (req, res)=>{
    if (req.body.name) {
        res.status(200).send(`
            <h1>Welcome ${req.body.name}</h1>
        `);
    }
    else {
        res.status(401).send('Please provide something!');
    }

})

module.exports = router