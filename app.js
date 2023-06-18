const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const menuFoods = ["Butter Chicken", "Fried Dumplings", "Noodles", "Dosa", "penne pasta", "chicken biryani", "paneer butter masala", "hirata buns", "shish kebab", "shish taouk sandwich", "caesar salad", "spaghetti"];

const foodPrice = [299, 199, 149, 149, 179, 199, 249, 139, 199, 239, 259, 279];

const cartFood = [];

app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine','ejs');
app.use(express.static('public'));


app.get('/',(req,res)=>{
    res.render('home',{
        cart:cartFood,
    });
})

app.get('/menu',(req,res)=>{
    res.render('menu',{
        foods:menuFoods,
        price:foodPrice,
        cart:cartFood,
    });
})

app.get('/order',(req,res)=>{
    res.render('order');
})

app.get('/login',(req,res)=>{
    res.render('login');
})

app.get('/signup',(req,res)=>{
    res.render('signup');
})

app.get('/profile',(req,res)=>{
    res.render('userProfile');
})


app.listen(3000,()=>{
    console.log("Server started and listening at port 3000");
})
