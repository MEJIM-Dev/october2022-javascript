const fs = require("fs")
const cors = require("cors")
const mongoose = require("mongoose")
const nodemailer =  require("nodemailer")
const crypto = require("crypto")

const users = [{"id": 1,"name": "moses","gender":"male"},{"id": 2,"name": "emeka","gender":"male"},{"id": 3,"name": "tunde","gender":"male"},{"id":4,"name":"sarah","gender":"female"}]
const months = ["january","febuary","march","april","may","june","july","august","septempber","october","november","december"]
const express = require("express")
const { response } = require("express")

const server = express()

const mail = nodemailer.createTransport({
    // host: "smtp.mailtrap.io",
    // port: 2525,
    service: "gmail",
    auth: {
        user: "ejim.michael.praise@gmail.com",
        pass: "yqcaqnnhimsnpiew"
    }
})

server.use(cors())
server.use(express.static("../"))
server.use(express.json())

// middleware
// server.use("/homepage",(req,res,next)=>{
//     console.log("middleware ran")
//     next()
// })

mongoose.connect("mongodb://mongo:UsMPbpCtJa377swjbuH2@containers-us-west-125.railway.app:7770")
.then((value)=>{
    console.log("Connected to MongoDB")
})
.catch(e=>{
    console.log("Failed to establish connection")
})

const UsersSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    dob: Date,
    email: {type: String, required:true},
    phone: Number,
    password: {type: String, required: true, default: "password"}
})

const Users = mongoose.model("users",UsersSchema)

const passwordResetSchema = mongoose.Schema({
    link: {type: String, required: true},
    email: {type: String, required:true},
    expired: {type: Boolean, default: false},
    expiresAt: {type: Date, required:false}
})

const PasswordReset = mongoose.model("passwordReset",passwordResetSchema)


async function userAlreadyExists(userEmail){
    const ans = await Users.findOne({email:userEmail},(err,data)=>{
        return data && data.length
    })
}

server.get("/register",function(req,res){
    const page = fs.readFileSync("../form.html","utf-8")
    console.log("homepage")
    res.send(page)
})

server.get("/user/id",(req,res)=>{
    console.log(req.body)
    Users.findOne({_id: req.body.id}, (err,data)=>{
        if(err){
            return res.status(501).send("DB Error")
        }
        if(!data){
            return res.send("No user with that detail")
        }
        res.send(data)
    })
})

server.get("/user/:email",(req,res)=>{
    console.log(req.params)
    Users.findOne({email: req.params.email}, (err,data)=>{
        if(err){
            return res.status(501).send("DB Error")
        }
        if(!data){
            return res.send("No user with that detail")
        }
        res.send(data)
    })
})


server.get("/users", (req,res)=>{
    Users.find((err,data)=>{
        if(err){
            return res.status(501).send("DB Error")
        }
        console.log(req.protocol,req.get("host"))
        res.send(data)
    })
})

server.post("/users/password",(req,res)=>{
    const email = req.body.email
    Users.findOne({email: email},(err,data)=>{
        if(err){
            return res.status(501).send("DB Error")
        }
        if(!data){
            return res.send("no user with the credentilas")
        }
        data.password = req.body.password
        console.log(data)
        data.save((err)=>{
            if(err){
                return res.status(501).send("DB Error")
            }
            res.json({"msg":"Password updated successfully"})
        })
    })
})

server.post("/users/profile", (req,res)=>{
    Users.findOne({email: req.body.email},(err,data)=>{
        if(err){
            return res.status(501).send("DB Error")
        }
        if(!data){
            return res.status(404).send("User not found")
        }
        console.log("before update",data)
        const dates = req.body.dob.split(" ")
        console.log(dates)
        const day = dates[0].replace("th","")
        const month = months.indexOf(dates[1])+1 //dates[1]
        const year = dates[2]
        const date = new Date(`${year}-${month}-${day}`)
        console.log(date )
        data.email = req.body.email
        data.phone = req.body.phone
        data.lastname = req.body.lastname
        data.firstname = req.body.firstname
        data.dob = date
        console.log("after update",data)
        data.save((err)=>{
            return res.send("User found")
        })
    })
})

server.post("/reset-password", async(req,res)=>{

    if (!req.body.email){
        return res.send("Email is missing")
    }

    const email = req.body.email
    
    const avail = await Users.findOne({email: email})

    if(!avail){
        return res.send("Invalid user")
    }

    const extra = crypto.randomBytes(32).toString("hex")

    let expiresAt = new Date()
    let now = new Date()
    expiresAt.setMinutes(now.getMinutes()+30)

    const dbPassword = new PasswordReset({
        link: extra,
        email: email,
        expired: false,
        expiresAt: expiresAt
    })

    console.log(dbPassword)

    dbPassword.save((err)=>{
        if(err){
            return res.send("Failed to create password reset link")
        }

        const reset = `<!doctype html>
        <html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        </head>
        <body style="font-family: sans-serif;">
            <div style="display: block; margin: auto; max-width: 600px;" class="main">
            <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">Reset Password!</h1>
            <p>Inspect it using the tabs you see above and learn how this email can be improved.</p>
            <img alt="Inspect with Tabs" src="https://th.bing.com/th?id=OIP.DP48uGkldTg01Wx5KTExXAHaE6&w=307&h=203&c=8&rs=1&qlt=90&o=6&dpr=1.1&pid=3.1&rm=2">
            <p>Click on <a href="${req.protocol}://${req.get("host")}/reset-password/${extra}">this</a> link to reset password</p>
            </div>
            <!-- Example of invalid for email html/css, will be detected by Mailtrap: -->
            <style>
            .main { background-color: white; }
            a:hover { border-left-width: 1em; min-height: 2em; }
            </style>
        </body>
        </html>`

        mail.sendMail({
            from: "backend@email.com",
            to:email,
            subject:"Password reset",
            // text: "reset your password mail",
            html: reset
        }, (err, info)=>{
            if(err) {
                console.log(err)
                return res.send("Failed to send email")
            }
            if(!info.accepted){
                console.log(info)
                return res.status(502).send("Failed to deliver mail")
            }
            console.log(info)
            res.send("check your email")
        })
    })
    
})

server.post("/user/create",async(req,res)=>{
    console.log("req body:",req.body)
    if(!req.body.firstname || !req.body.lastname || !req.body.phone || !req.body.email){
        return res.end("Invalid user Details")
    }
    // const newUser = {
    //     name: req.body.name,
    //     gender: req.body.gender,
    //     id: users.length+1
    // }

    Users.findOne({email: req.body.email}, (err,data)=>{
        if(err){
            return res.status(501).send("DB Error")
        }
        if(data){
            console.log(data)
            return res.send("User Already exists")
        }
        const user = new Users({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            dob: Date.now(),
            password: req.body.password
        })
        user.save()
        .then((data,err)=>{
            if(err){
                console.log(err)
                return res.end("Failed to created")
            }
            console.log(data)
            return res.json({
                "msg":"user created",
                "user": data
            })
        })
        .catch(e=>{
            console.log(e)
            return res.end("Failed to created")
        })
    
    })

})

server.get("/about",function(req,res){
    res.json({"msg":"about"})
})

server.listen(`0.0.0.0:${PORT}`, (err)=>{
    if(err){
        return console.log(err)
    }
    console.log("server started on port: 5001")
})