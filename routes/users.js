var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.send('respond with a resource');
});

router.get('/userPresent', function(req, res) {
    if (!req.session.user) {
        return res.status(401).send();
    }

    return res.status(200).send(req.session.user.userName);
});

module.exports = router;