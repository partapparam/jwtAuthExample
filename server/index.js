const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const cors = require('cors');
const saltRounds = 10;
const RSA_PRIVATE_KEY = fs.readFileSync('./jwtRS256.key');
const db = require('./db/db');
const checkIfAuth = require('./lib/authMiddleware');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const validate = (email) => {
    return db.findUser(email);
};

const createToken = user => {
    return jwt.sign( { id: user._id }, RSA_PRIVATE_KEY, {
        algorithm: 'RS256',
        expiresIn: 12000,
        subject: 'Login Details'
    });
};

app.get('/api/users', (req, res) => {
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
    const { email, password, firstName, lastName } = req.body.data;
    bcrypt.hash(password, saltRounds)
        .then(result => {
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
    validate(email)
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
app.get('/api/admin', checkIfAuth, (req, res) => {
    return res.json({message: 'success', data: 'We passed the middleware test'});
});

app.delete('/api/delete', checkIfAuth,(req, res) => {
    const idArray = req.query.id;
    db.deleteUsers(idArray)
        .then(result => {
            return res.json({message: 'success', data: 'Users Deleted'});
        })
        .catch(err => {
            console.log(err);
            return res.json({message: 'error', data: 'Failed to delete.'})
        });
})

app.use((req, res) => {
    res.status(404).json({message: 'error', data: 'Not Found - 400'})
})
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        console.log(err.message);
        return res.json({message: 'error', data: '500 - server error - access not allowed'});
    }
    console.log(err.message);
    return res.status(500).json({message: 'error', data: '500 - server error'});
});

app.listen(3000, () => console.log('server is on'));
