const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('Respond with a user resource bruhhh');
  // res.json() send response with a JSON body.
  res.json({
    message: "GET /api/tweets"
  })
});

module.exports = router;
