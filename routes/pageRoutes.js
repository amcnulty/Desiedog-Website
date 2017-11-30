var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = require('../lib/User');
var Article = require('../lib/Article');
 
bcrypt = require('bcrypt'),
SALT_WORK_FACTOR = 10;

// mongoose.connect('mongodb://heroku_gcnjfqcs:l71nq4et2psh13qf3gn2rhrgen@ds145010.mlab.com:45010/heroku_gcnjfqcs');
// for local database testing
// mongoose.connect('localhost:27017');
// Connect to database
mongoose.connect(process.env.MONGODB_URI);

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

router.get('/articles/:pageTitle', function(req, res) {
    // search database for article
    var pageTitle = req.params.pageTitle;
    Article.findOne({'pageTitle' : pageTitle}, function(err, article) {
        if (err) {
            return res.status(500).send();
        }
        // retrieve template
        var template = "<!DOCTYPE html><html lang='en'><head><title>Desiedog Articles | zt</title><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><meta http-equiv='X-UA-Compatible' content='ie=edge'><link rel='stylesheet' href='../../css/article/article.css' type='text/css'><script src='https://code.jquery.com/jquery-3.2.1.min.js' integrity='sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=' crossorigin='anonymous'></script></head><body><div data-include='../templates/nav/topBar.html'></div><div id='mainArticleContent'><h3 class='thickGrey'>Author: <span id='authorName'>za</span></h3><h3 class='thickGrey'>Published on <span id='articleDate'>zd</span></h3><h1 id='articleTitle'>zt</h1>zc</div><div data-include='../templates/nav/myFooter.html'></div><script src='../../js/header.js' type='text/javascript'></script><script src='../../js/article.js' type='text/javascript'></script></body></html>";
        // replace title, author, articleBody
        template = template.replace(/zt/g, article.title);
        template = template.replace(/za/, article.author);
        template = template.replace(/zc/, article.articleBody);
        template = template.replace(/zd/, article.date);
        // send resource
        res.setHeader('content-type', 'text/html');
        return res.status(200).send(template);
    });
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
                return res.status(200).send(req.session.user);
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
    else {
        User.findOne({ userNameLowercase: req.session.user.userNameLowercase}, function(err, user) {
            if (err) return res.status(500).send();
            req.session.user = user;
            return res.status(200).send(req.session.user);
        });
    }
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
    newuser.notifications = 0;
    var message = {
        body: 'Test Body',
        unread: true,
        date: '11/29/2017',
        sender: 'Pea Body'
    };
    newuser.messages = [message];
    newuser.save(function(err, savedUser) {
        if(err) {
            console.error(err);
            return res.status(500).send();
        }

        return res.status(200).send();
    });
});

module.exports = router;