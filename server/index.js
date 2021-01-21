const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const saltRounds = 10;
const RSA_PRIVATE_KEY = fs.readFileSync('./jwtRS256.key');
const db = require('./db/db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const validate = async (email) => {
    return await db.findUser(email);
};

const createToken = user => {
    return jwt.sign( { id: user._id }, RSA_PRIVATE_KEY, {
        algorithm: 'RS256',
        expiresIn: 12000,
        subject: 'Login Details'
    });
};

app.get('/api/', (req, res) => {
    db.getUsers()
        .then(data => {
            // remove the has from the return object
            data.forEach(x => x.hash = undefined);
            return res.json({message: 'success', data: data});
        })
        .catch(err => {
            console.log(err.message);
            return res.json({message: 'error', data: 'Error'})
        })
})
app.post('/api/signup', (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    bcrypt.hash(password, saltRounds)
        .then(result => {
            console.log(result)
            db.newUser({email: email, hash: result, firstName: firstName, lastName: lastName})
                .then(result => {
                    const token = createToken(result);
                    return res.json({message: 'success', data: token, expiresIn: 12000});
                })
        })
        .catch(err => {
            console.log(err.message);
            return res.json({message: 'error', data: 'Error'})
        })
});
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.findUser(email)
        .then(user => {
            if (!user) return res.json({message: 'error', data: 'Incorrect login'});
            bcrypt.compare(password, user.hash)
                .then(result => {
                    if (!result) return res.json({message: 'error', data: 'Incorrect password'});
                    const token = createToken(user);
                    return res.json({message: 'success', data: token, expiresIn: 12000 });
                })
        })
        .catch(err => {
            console.log(err.message);
            return res.json({message: 'error'});
        })
});
app.get('/api/admin', (req, res) => {
    return res.json({message: 'success', data: 'We passed the middleware test'});
});

app.use((req, res) => {
    res.status(404).json({message: 'error', data: 'Not Found - 400'})
})
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        console.log(err.message);
        return res.json({message: 'error', data: '500 - server error - access not allowed'});
    }
    return res.status(500).json({message: 'error', data: '500 - server error'});
});

app.listen(3000, () => console.log('server is on'));
