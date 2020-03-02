var express = require('express');
var router = express.Router();

router.get('/config', function(req, res, next) {
    console.log('GetConfig');
    res.send({
        status: 'Ok',
        app_min_version : '1'
        });

});

module.exports = router;

