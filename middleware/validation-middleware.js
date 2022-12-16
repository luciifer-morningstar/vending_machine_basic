const validator = require('../helpers/validate');
const Users = require('../models/users')
var jwt = require('jsonwebtoken');
const { ObjectId } = require('bson');
const secret = 'BHRTPO(TY&'

const register = (req, res, next) => {
    const validationRule = {
        "username": "required|string|space_not",
        "password": "required|string|min:6",
        "role":"required|string|role"
    }
    
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            return res.status(406)
                .send({
                    success: false,
                    message: 'Errors',
                    data: err
                });
        } else {
            next();
        }
    });
}

const loginUser = (req, res, next) => {
    const validationRule = {
        "username": "required|string|space_not",
        "password": "required|string|min:6"
    }
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(406)
                .send({
                    success: false,
                    message: 'Errors',
                    data: err
                });
        } else {
            next();
        }
    });
}

const checkAuthForUser = (req, res, next) => {
    var token = req.headers['authorization'];
    if (!token){
        res.status(401).send({ message: "Unauthorized User"});
    } else {
        jwt.verify(token, secret, async function(err, decoded) {
            if (err) return res.status(406).send({ message: 'Invalid Token.' });
            let user = await Users.findOne({_id:ObjectId(decoded['id']), role:"USER"});
            if(!user) return res.status(401).send({ message: "Unauthorized User"});
            req['authInfo'] = user['_doc'];
            next();
        });
        }
}

const checkAuthForVendor = (req, res, next) => {
    var token = req.headers['authorization'];
    if (!token){
        res.status(401).send({ message: "Unauthorized User"});
    } else {
        jwt.verify(token, secret, async function(err, decoded) {
            if (err) return res.status(406).send({ message: 'Invalid Token.' });
            let user = await Users.findOne({_id:ObjectId(decoded['id']), role:"VENDOR"});
            if(!user) return res.status(401).send({ message: "Unauthorized User"});
            req['authInfo'] = user['_doc'];
            next();
        });
    }
}

const checkAuth = (req, res, next) => {
    var token = req.headers['authorization'];
    if (!token){
        res.status(401).send({ message: "Unauthorized User"});
    } else {
        jwt.verify(token, secret, async function(err, decoded) {
            if (err) return res.status(406).send({ message: 'Invalid Token.' });
            let user = await Users.findOne({_id:ObjectId(decoded['id'])});
            if(!user) res.status(401).send({ message: "Unauthorized User"});
            req['authInfo'] = user['_doc'];
            console.log("req['authInfo']", req['authInfo'])
            next();
        });
    }
}

const updateProfile = (req, res, next) => {
    const validationRule = {
        "username": "required|string|space_not"
    }

    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            return res.status(406)
                .send({
                    success: false,
                    message: 'Errors',
                    data: err
                });
        } else {
            next();
        }
    });
}


module.exports = { 
    register,
    loginUser,
    checkAuthForUser,
    checkAuthForVendor,
    updateProfile,
    checkAuth
  }