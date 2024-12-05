const bcrypt = require('bcrypt'); 
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken')
const JWT_SECRET = "RAVI@PRAKASH"
const {UserModel,TodoModel} = require("./db");
const { mongo, default: mongoose } = require('mongoose');
const { z }  = require('zod')



mongoose.connect("mongodb+srv://admin:admin@cluster0.ly7z4.mongodb.net/ravi-todo-0")

app.use(express.json()); 

app.post('/signup', async(req,res)=>{
    const requiredBody = z.object({
        email: z.string().min(3).max(100).email(),
        name: z.string().min(4).max(100),
        password: z.string().min(6).max(25) 
    })

    // const parsedData = requiredBody.parse(req.body);
    const parsedDataWithSuccess = requiredBody.safeParse(req.body);

    if (!parsedDataWithSuccess.success) {
        res.json({
            message: "incorrect format",
            eroor: parsedDataWithSuccess.error 
        })
        return
    }



     const email = req.body.email
     const password = req.body.password
     const name = req.body.name

     try {
        const hashedPassword = await bcrypt.hash(password, 5); 
     console.log(hashedPassword )

     await UserModel.create({
        email: email,
        password: hashedPassword ,
        name: name
     });
     } catch (e) {
        res.json({
            message: "User already exits"
        })
        errorThrown = true;
     }

     if(!errorThrown){
        res.json({
            message: "You are signed in"
        })
     }

     res.json("You are signed up")
})

app.post('/signin', async (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email: email,
    });

    if(!user){
        res.status(403).json({
            message: "user does not exist in our database"
        })
    }

    const passwordMatched = await bcrypt.compare(password, user.password);
 
    if(passwordMatched){
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