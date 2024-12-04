const express = require('express');
const app = express();
const jwt = require('jsonwebtoken')
const JWT_SECRET = "RAVI@PRAKASH"
const {UserModel,TodoModel} = require("./db");
const { mongo, default: mongoose } = require('mongoose');
mongoose.connect("mongodb+srv://admin:admin@cluster0.ly7z4.mongodb.net/ravi-todo-0")

app.use(express.json()); 

app.post('/signup', async(req,res)=>{
     const email = req.body.email
     const password = req.body.password
     const name = req.body.name

     await UserModel.create({
        email: email,
        password: password,
        nmae: name
     });

     res.json("You are signed up")
})

app.post('/signin', async (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email: email,
        password: password
    })
 
    if(user){
        const token = jwt.sign({
            id: user._id.toString()
        },JWT_SECRET);
        res.json({
            token: token
        })
    }
    else{
        res.status(403 ).json({
            message: "Incorrect Credentials"
        })
    }
})

app.post('/todo',auth, async(req,res)=>{
    const userId = req.userId;
    const title = req.body.title;
    const done = req.body.done;

    await TodoModel.create({
        userId,
        title,
        done
    });

    res.json({
        message: "Todo created"
    })
});

app.get('/todos',auth, async(req,res)=>{
    const userId = req.userId;

    const todos = await TodoModel.find({
        userId
    });

    res.json({
        todos
    })
})

function auth(req,res,next) {
    const token = req.headers.token;

    const decodedData = jwt.verify(token, JWT_SECRET);

    if(decodedData){
        req.userId = decodedData.id;
        next();
    }
    else{
        res.status(403).json({
            message: "Incorrect Credentials"
        })
    }
}

app.listen(3000)