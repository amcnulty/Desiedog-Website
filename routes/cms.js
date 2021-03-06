var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var router = express.Router();
var User = require('../lib/User');
var Article = require('../lib/Article');

// mongoose.connect('mongodb://heroku_gcnjfqcs:l71nq4et2psh13qf3gn2rhrgen@ds145010.mlab.com:45010/heroku_gcnjfqcs');
mongoose.connect(process.env.MONGODB_URI);

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
    if (!req.session.user) {
        return res.status(403).send();
    }
    else res.render('myPortal');
});

router.post('/publishArticle', function(req, res) {
    var poster = req.body.poster;
    var headline = req.body.headline;
    var title = req.body.title;
    var pageTitle = req.body.pageTitle;
    var author = req.body.author;
    var date = req.body.date;
    var articleBody = req.body.articleBody;
    var article = new Article();
    article.poster = poster;
    article.headline = headline;
    article.title = title;
    article.pageTitle = pageTitle;
    article.author = author;
    article.date = date;
    article.articleBody = articleBody;
    article.save(function(err, savedArticle) {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        return res.status(200).send();
    });
    return res.status(200).send();
});

router.put('/updateArticle', function(req, res) {
    var poster = req.body.poster;
    var headline = req.body.headline;
    var title = req.body.title;
    var pageTitle = req.body.pageTitle;
    var author = req.body.author;
    var articleBody = req.body.articleBody;
    Article.findOne({ pageTitle: pageTitle}, function(err, article){
        if (err) {
            console.error(err);
            return res.status(500).send();
        }
        else if (!article) {
            return res.status(404).send();
        }
        article.poster = poster;
        article.headline = headline;
        article.title = title;
        article.author = author;
        article.articleBody = articleBody;
        article.save(function(err, savedArticle) {
            if (err) {
                console.log(err);
                return res.status(500).send();
            }
            return res.status(200).send();
        });
        return res.status(200).send();
    })
});

router.delete('/deleteArticle', function(req, res) {
    var articles = req.body.articles;
    for (var i = 0; i < articles.length; i++) {
        Article.findOneAndRemove({ pageTitle: articles[i]}, function(err) {
            if (err) {
                console.error(err);
                return res.status(500).send();
            }
            return res.status(200).send();
        });
    }
});

router.put('/setFeaturedArticle', function(req, res) {
    var pageTitle = req.body.pageTitle;
    Article.findOne({ featured: true}, function(err, article) {
        if (err) {
            console.error(err);
            return res.status(500).send();
        }
        else if (!article) {
            // no article is set to featured
            console.log("No article was found with query {featured: true}.")
            return res.status(404).send();
        }
        article.featured = false;
        article.save(function(err, savedArticle) {
            if (err) {
                console.log(err);
                return res.status(500).send();
            }
            // search for article that user wants to set to featured
            Article.findOne({ pageTitle: pageTitle}, function(err, article) {
                if (err) {
                    console.error(err);
                    return res.status(500).send();
                }
                else if (!article) {
                    return res.status(404).send();
                }
                article.featured = true;
                article.save(function(err, savedArticle) {
                    if (err) {
                        console.log(err);
                        return res.status(500).send();
                    }
                    return res.status(200).send();
                });
            })
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