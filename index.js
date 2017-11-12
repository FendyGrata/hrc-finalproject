const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const http = express();
const User = require('./models/user');
// const passport = require('passport');
// const LocalStrategy   = require('passport-local');
// const passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect("mongodb://localhost/hrc");
mongoose.connection.once('open', () => {
  console.log('Connection to database success');
}).on('error', (err) => {
  console.log('Connection error');
})

http.set('views','views');
http.set('view engine','ejs');

const home = require('./routes/home');
const login = require('./routes/login');

http.use(express.static('public'));
http.use(bodyParser.json());
http.use(bodyParser.urlencoded({extended: true}));
// http.use(passport.initialize());
// http.use(passport.session());

// passport.use(new LocalStrategy(user.authenticate()));
// passport.serializeUser(user.serializeUser());
// passport.deserializeUser(user.deserializeUser());
// http.use('/', home);
// http.use('/login', login);

http.use(session({secret: 'iloveit'}));


http.get('/', (req,res) => {
  res.render('home', {email: req.session.email});
})

// http.get('/', (req,res) => {
//   if(! req.session.user) { // dicek apakah ada data usernya atau blm, "session" ada di server
//     res.redirect('/login');
//   } else {
//     res.render('protected', {user: req.session.user})
//   }
// });

http.get('/login', (req,res) => {
  res.render('login', {message: null});
})

http.post("/login", (req,res) => {
  User.findOne({email: req.body.email, password: req.body.password}, (err,email) => {
    if (err) {
      console.log(err);
    } else if (email){
      req.session.email = email.email;
      res.redirect("/");
    } else {
      res.send('invalid');
    }
  })
});
// http.post('/login', (req,res,next) => {
//   const user = req.body.user;
//   const password = req.body.password;
//
//   if(password !== 'rahasia' || user === ''){
//     res.render('login', {message: "Access Denied!"})
//   } else {
//     req.session.user = user;
//     res.redirect('/');
//     next();
//   }
// })

http.get('/register' ,(req,res) => {
  res.render('register');
})

http.post('/register', (req,res) => {
// Add more for other fields

  if (req.body.email && req.body.password) {

    var userData = {
      email: req.body.email,
      password: req.body.password,
    }
    User.create({email: userData.email, password:userData.password}, (err,user) => {
      if (err) {
        console.log(err)
        console.log("email existed, input another one")
        res.redirect("/register");
      } else {
        req.session.email = userData.email;
        console.log("User registered")
        res.redirect("/");
      }
    })
  }
})

http.get('/logout', (req,res) => {
  req.session.destroy();
  res.redirect('/')
})

http.listen(3000, () => {
  console.log("listening to 3000");
})
