let express = require('express');
let router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('<title>users</title>respond with a resource');
});

module.exports = router;
