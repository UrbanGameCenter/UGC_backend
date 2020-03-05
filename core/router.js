const express = require('express');
const router = express.Router();
const path = require('path');

const INDEX = path.join(__dirname, '../web/index.html');
const technicalApiV1 = require('../api/v1/technicalAPI');

//Api Technical
router.use('/api/v1/technical', technicalApiV1);

//web
router.get('/', function(req, res) {
    res.sendFile(INDEX);
});




module.exports = router;
