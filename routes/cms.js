var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var router = express.Router();
var User = require('../lib/User');
var Article = require('../lib/Article');

mongoose.connect('mongodb://heroku_gcnjfqcs:l71nq4et2psh13qf3gn2rhrgen@ds145010.mlab.com:45010/heroku_gcnjfqcs');

router.get('/', function(req, res) {
    res.render('cms');
});

router.post("/login", function(req, res) {
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

router.get("/verifyUser", function(req, res) {
    if (req.session.user.adminPrivileges != "full") {
        return res.status(403).send();
    }
    else if (req.session.user.adminPrivileges == "full") {
        return res.status(200).send();
    }
});

router.get('/my-portal', function(req, res) {
    res.render('myPortal');
});

router.post('/createJadeFile', function(req, res) {
    var title = req.body.title;
    var pageTitle = req.body.pageTitle;
    var paragraph = req.body.paragraph;
    var jadeStructure = "doctype html\n" + 
    "html(lang='en')\n" + 
    "\thead\n" +
    "\t\ttitle " + "Desie Dog Articles | " + title + "\n" +
    "\tbody\n" +
    "\t\th1 " + title + "\n" +
    "\t\tp " + paragraph;
    fs.mkdir("./views/articles/", function() { // New Directory Created
        // Create write stream (create new file)
        var myWriteStream = fs.createWriteStream("./views/articles/" + pageTitle + ".jade");
        // Callback when file is open
        myWriteStream.once("open", function(fd) {
            myWriteStream.write(jadeStructure, function() {
                myWriteStream.close();
            });
        });
        myWriteStream.once("close", function() {
            // finished writing file
            // Save article to database
            var article = new Article();
            article.title = title;
            article.location = pageTitle;
            article.save(function(err, savedArticle) {
                if(err) {
                    console.error(err);
                    return res.status(500).send();
                }
                return res.status(200).send();
            });
            return res.status(200).send();
        });
    });
});

router.get('/articles', function(req, res) {
    Article.find(function(err, articles) {
        if(err) {
            console.error(err);
            return res.status(500).send();
        }
        if(!articles) {
            return res.status(404).send();
        }
        return res.status(200).send(articles);
    });
});

module.exports = router;