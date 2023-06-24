//importing modules -----------------------------------

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Restaurant = require("./models/restaurant");
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');

//intialising modules ---------------------------------

const app = express();
const dbURL = "mongodb+srv://akshatk123:fuckshat@restaurantdb.a8giyp2.mongodb.net/?retryWrites=true&w=majority";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie:{},
}));
app.use(passport.initialize());
app.use(passport.session()); 

mongoose.connect(dbURL)
  .then((response) => {
    console.log("Connected to db");
    app.listen(3000, () =>console.log("Server started and listening at port 3000"));})
  .catch((err) => console.log(err));
passport.use(new LocalStrategy(Restaurant.User.authenticate()));
passport.serializeUser(Restaurant.User.serializeUser());
passport.deserializeUser(Restaurant.User.deserializeUser());
let isAuthenticated = false;

//GET requests ------------------------------------------

app.get("/", (req, res) => {
  Restaurant.MenuItem.find()
    .then((result) => {
      res.render("home", {
        items: result,
        isAuthenticated,
      });
    })
    .catch((err) => console.log(err));
});

app.get("/confirm", (req, res) => {
  if(req.isAuthenticated()){
    res.render("orderConfirm", {isAuthenticated});
  } else {
    res.redirect('/login');
  }
});

app.get("/menu", (req, res) => {
  Restaurant.MenuItem.find()
    .then((result) => {
      res.render("menu", {
        items: result,
        isAuthenticated,
      });
    })
    .catch((err) => console.log(err));
});

app.get("/order", (req, res) => {
  if(req.isAuthenticated()){
    Restaurant.CartItem.find({user_id: req.user._id})
    .then((result) => {
      let sum = 0;
      for (var i = 0; i < result.length; i++) {
        sum += result[i].quantity * result[i].price;
      }
      sum += 0.18 * sum;
      sum = sum.toFixed(2);

      res.render("order", {
        cartItems: result,
        totalVal: sum,
        isAuthenticated,
      });
    })
    .catch((err) => console.log(err));
  } else {
    res.redirect('/login');
  }
});

app.get("/login", (req, res) => {
  if(req.isAuthenticated()){
    res.redirect('/profile');
  } else {
    res.render("login",{isAuthenticated});
  }
});

app.get("/signup", (req, res) => {
  if(req.isAuthenticated()){
    res.redirect('/profile');
  } else {
    res.render("signup",{isAuthenticated});
  }});

app.get("/profile", (req, res) => {
  if(req.isAuthenticated()){
    const username = req.user.username;
    const name = req.user.name;
    const phone = req.user.phone;
    Restaurant.Order.find({user_id: req.user._id})
      .then((result)=>{
        res.render("userProfile",{
          isAuthenticated,
          name,
          username,
          phone,
          result,
        });
      })
      .catch(err => console.log(err));
  } else {
    res.redirect('/login');
  }
});

app.get("/search/:id", (req, res) => {
  const id = req.params.id;
  Restaurant.MenuItem.findById(id)
    .then((result) => {
      res.render("search", {
        item: result,
        isAuthenticated,
      });
    })
    .catch((err) => console.log(err));
});

//POST requests ----------------------------------------

app.post("/search", (req, res) => {
  let searched = req.body.food;
  var capitalizedStr = searched.replace(/\b\w/g, function (match) {
    return match.toUpperCase();
  });
  Restaurant.MenuItem.findOne({ name: capitalizedStr })
    .then((result) => {
      if (result === null) {
        res.render("not-found",{isAuthenticated});
      }
      const url = "/search/" + result._id;
      res.redirect(url);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/order/:id", (req, res) => {
  if(req.isAuthenticated()){
    const id = req.params.id;

    Restaurant.MenuItem.findById(id)
      .then((result) => {
        Restaurant.CartItem.updateOne(
          { name: result.name, user_id: req.user._id },
          {
            $inc: { quantity: 1 },
            $setOnInsert: {
              user_id: req.user._id,
              name: result.name,
              imageLink: result.imageLink,
              price: result.price,
            },
          },
          { upsert: true }
        )
          .then((result) => {
            if (result.upsertedCount > 0) {
              console.log("Document created.");
            } else {
              console.log("Document updated.");
            }
            res.json({ msg: "succefully added" });
          })
          .catch((err) => {
            console.log("Error updating or creating document:", err);
          });
      })
      .catch((err) => console.log(err));
  } else {
    res.json(null);
  }
});

app.post("/order", (req, res) => {
  if(req.isAuthenticated()){
    const id = req.body.id;
    const value = req.body.value;
    Restaurant.CartItem.updateOne(
      { _id: id },
      {
        $set: {
          quantity: value,
        },
      }
    )
      .then((result) => {
        if (result.upsertedCount > 0) {
          console.log("Document created.");
        } else {
          console.log("Document updated.");
        }
        res.json({ msg: "succefully added" });
      })
      .catch((err) => {
        console.log("Error updating or creating document:", err);
      });
  } else {
    res.redirect('/login');
  }
});

app.post('/order-confirm', (req, res)=>{
  if(req.isAuthenticated()){
    Restaurant.CartItem.find()
      .then((result)=>{
        const foodNames = [];
        const foodQty = [];
        let totalPrice = 0;
        for(let i = 0 ; i < result.length ; i++){
          foodNames.push(result[i].name);
          foodQty.push(result[i].quantity);
          totalPrice += result[i].price*result[i].quantity ;
        }

        const order = Restaurant.Order({
          user_id: req.user._id,
          name: foodNames,
          quantity: foodQty,
          totalPrice,
        })
        order.save();
        res.redirect('/confirm');
      })
  } else {
    res.redirect('/login');
  }
});

app.post('/signup', (req, res)=>{
  Restaurant.User.register({username: req.body.username, name: req.body.name, phone: req.body.phone}, req.body.password, function(err, user){
    if(err){
      console.log(err);
      res.redirect('/signup');
    }
      passport.authenticate('local')(req, res, function(){
        isAuthenticated = true;
        res.redirect('/order');
      });
  });
});

app.post('/login', (req, res)=>{
  const user = Restaurant.User({
    username: req.body.username,
    password: req.body.password,
  })
  req.login(user, function(err){
    if(err){
      console.log(err);
      res.redirect('/login');
    }
    passport.authenticate('local')(req, res, function(){
      isAuthenticated = true;
      res.redirect('/order');
    });
  })
})

app.post('/logout',(req,res)=>{
  req.logout(function(err) {
    if (err) { return next(err); }
    isAuthenticated = false;
    res.redirect('/');
  });
})

app.use((req, res)=>{
  res.render('404',{
    isAuthenticated,
  })
})

// DELETE requests ----------------------------------

app.delete("/order/:id", (req, res) => {
  const id = req.params.id;
  Restaurant.CartItem.findByIdAndDelete(id)
    .then((result) => {
      console.log(result);
      res.json({ msg: "succefully deleted" });
    })
    .catch((err) => console.log(err));
});