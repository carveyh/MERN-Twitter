const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('Respond with a user resource bruhhh');
  // res.json() send response with a JSON body.
  res.json({
    message: "GET /api/users"
  })
});

router.post('/register', async (req, res, next) => {
  //Check to make sure no one has already registered with the proposed email or username 
  const user = await User.findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }]
  });

  if (user) {
    // Throw a 400 error if the email address and/or username already exists
    const err = new Error("Validation Error");
    err.statusCode = 400;
    const errors = {};
    if (user.email === req.body.email) {
      errors.email = "A user has already registered with this email";
    }
    if (user.username === req.body.username) {
      errors.username = "A user has already registered with this username";
    }
    err.errors = errors;
    return next(err);
  }

  // Otherwise create the new user, save to db, and return in response as JSON
  const newUser = new User({
    username: req.body.username,
    email: req.body.email
  });

  // Save the password for the new user as a salted and encrypted hashedPassword
  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(req.body.password, salt, async (err, hashedPassword) => {
      if (err) throw err;
      try {
        newUser.hashedPassword = hashedPassword;
        const user = await newUser.save();
        return res.json({user});
      }
      catch(err) {
        next(err);
      }
    })
  });
});

router.post('/login', async (req, res, next) => {
  passport.authenticate('local', async (err, user) => {
    if(err) return next(err);
    if(!user) {
      const err = new Error('Invalid credentials');
      err.statusCode = 400;
      err.errors = { email: "Invalid credentials" };
      return next(err);
    }
    return res.json({user});
  })(req, res, next);
});

module.exports = router;
