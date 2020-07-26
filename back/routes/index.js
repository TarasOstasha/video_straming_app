var express = require('express');
var router = express.Router();


var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config()

const fs = require('fs');

const User = require('../models/users');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', async (req, res) => {
  console.log(req.body)
  try {
    // create new user
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) return res.status(500).json({ ok: false, error: err })
      else {
        const new_user = new User({
          name: req.body.name,
          email: req.body.email,
          password: hash, //req.body.password,
          role: 'user'
        });
        new_user.save();
        res.json({ ok: true, message: 'new account has been created' });
      }
    })

    // OLD
    // const userObj = req.body;
    // const checkUser = await User.findOne({ email: userObj.email });
    // console.log(checkUser, 'checkUser')
    // if (checkUser) return res.status(409).json({ ok: false, msg: 'this user already exist' });
    // const user = await new User(userObj);
    // user.save();
    // res.status(200).json({ ok: true, user });
  } catch (error) {
    console.log(error, 'ERROR')
    res.status(500).json({ ok: false, msg: 'error on server' });
  }

});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log(user, 'user');
    if (!user) return res.json({ ok: false, message: 'this user not exist' });
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (err) return res.status(401).json({ message: 'Auth failed' });
      //var privateKey = fs.readFileSync('./keys/private.key');

      if (result) {
        const token = jwt.sign({
          email: user.email,
          userId: user._id,
          userName: user.name,
          //role: user.role,
          //isLogged: user.isLogged
        },
          process.env.JWT_KEY,
          //privateKey,
          {
              expiresIn: "1h"
              //algorithm: 'HS256'
          },

        )
        return res.status(200).json({ ok: true, message: 'Auth successful', token: token, user });
      }
      res.status(401).json({ message: 'Auth failed' });
    })
    //res.status(200).json({ ok: true, user }); 
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'error on server' });
  }
})

// check if user-token exist
function secure(req, res, next) {
  const decoded = jwt.decode(req.headers.token, { complete: true } );
  req.user = decoded;
  if(decoded) next()
  else res.status(400),json({ ok: false, msg: 'you are not logged' });
}

router.post('/get-user', secure, async(req,res) => {
  res.json({ ok: true, user: req.user });
})

module.exports = router;
