var express = require('express');
var router = express.Router();

const User = require('../models/users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', async(req, res)=>{
  try {
    console.log(req.body)
    const userObj = req.body;
    const checkUser = await User.findOne({ email: userObj.email });
    console.log(checkUser, 'checkUser')
    if( checkUser ) return res.status(409).json({ ok: false, msg: 'this user already exist' });
    const user = await new User(userObj);
    user.save();
    res.status(200).json({ ok: true, user }); 
  } catch (error) {
    console.log(error, 'ERROR')
    res.status(500).json({ ok: false, msg: 'error on server' });
  }

});

module.exports = router;
