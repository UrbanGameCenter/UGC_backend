const express = require('express');
const router = express.Router();

const technicalApiV1 = require('../api/v1/technicalAPI');

//Api
router.use('/api/v1/technical', technicalApiV1);




module.exports = router;
