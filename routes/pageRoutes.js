var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = require('../lib/User');
 
bcrypt = require('bcrypt'),
SALT_WORK_FACTOR = 10;

mongoose.connect('mongodb://heroku_gcnjfqcs:l71nq4et2psh13qf3gn2rhrgen@ds145010.mlab.com:45010/heroku_gcnjfqcs');
// for local database testing
// mongoose.connect('localhost:27017');

router.get('/', function(req, res) {
    res.render('index');
});

router.get('/about', function(req, res) {
    res.render('about');
});

router.get('/forum', function(req, res) {
    res.render('forum');
});

router.get('/gallery', function(req, res) {
    res.render('gallery');
});

router.get('/shop', function(req, res) {
    res.render('shop');
});

router.get('/articles/:articleName', function(req, res) {
    var articleName = req.params.articleName;
    res.render('articles/' + articleName);
});

router.post('/login', function(req, res) {
    var userName = req.body.userName;
    var password = req.body.password;

    User.findOne({ userNameLowercase: userName.toLowerCase()}, function(err, user) {
        if(err) {
            console.error(err);
            return res.status(500).send();
        }
        if(!user) {
            return res.status(404).send();
        }

        user.comparePassword(password, function(err, isMatch) {
            if (isMatch && isMatch == true) {
                req.session.user = user;
                return res.status(200).send(req.body.userName);
            }
            else {
                return res.status(401).send();
            }
        })

    });
});

router.get('/logout', function(req, res) {
    req.session.destroy();
    return res.status(200).send();
});

router.get('/dashboard', function(req, res) {
    if (!req.session.user) {
        return res.status(401).send();
    }
    else if(req.session.user.adminPrivileges == "full") {
        return res.status(200).send("Hello " + req.session.user.userName + " Welcome to my dashboard.");
    }
    else if (!req.session.user.adminPrivileges) {
        return res.status(404).send();
    }
});

router.get('/userPresent', function(req, res) {
    if (!req.session.user) {
        return res.status(401).send();
    }
    return res.status(200).send(req.session.user.userName);
});

router.post('/register', function(req, res) {
    var userName = req.body.userName;
    var userNameLowercase = userName.toLowerCase();
    var password = req.body.password;

    var newuser = new User();
    newuser.userName = userName;
    newuser.userNameLowercase = userNameLowercase;
    newuser.password = password;
    newuser.firstName = "firstName";
    newuser.lastName = "lastName";
    newuser.email = "email";
    newuser.pets = [""];
    newuser.profileImgPath = "path/to/image";

    newuser.save(function(err, savedUser) {
        if(err) {
            console.error(err);
            return res.status(500).send();
        }

        return res.status(200).send();
    });
});

module.exports = router;