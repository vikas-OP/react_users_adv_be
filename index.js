const express = require("express")
require("dotenv").config()
const cors = require("cors")
const mongodb = require("mongodb")


const mongoClient = mongodb.MongoClient
const URL = process.env.DATABASE_URL
const app = express()

app.use(cors({
    origin: "*"
}))
app.use(express.json())


//creating new user

app.post("/users", async (req, res) => {
    let client
    try{
        const email =req.body.email
        client = await mongoClient.connect(URL, {useNewUrlParser: true, useUnifiedTopology: true})
        const db = client.db("react_users_info")
        let user = await db.collection("users").findOne({email})
        if(user){
            client.close()
            res.status(400).json({
                message: "email already present"
            })
            return
        }
         user = {
            name: req.body.name,
            email: req.body.email,
            country: req.body.country,
            state: req.body.state,
            city: req.body.city,
            line1: req.body.line1,
            line2: req.body.line2,
            gender: req.body.gender,
            maritalStatus: req.body.maritalStatus,
            favouriteFood: req.body.favouriteFood,
            favouriteColor: req.body.favouriteColor
        }
        await db.collection("users").insertOne(user)
        res.json({
            message: "success"
        })
        client.close()
    }
    catch(err){
        if(client){
            client.close()
        }
        res.status(500).json({
            message: "something went wrong"
        })
    }
})

app.get("/users", async (req, res) => {
    let client
    try{
        client = await mongoClient.connect(URL, {useNewUrlParser: true, useUnifiedTopology: true})
        const db = client.db("react_users_info")
        const users = await db.collection("users").find().toArray()
        client.close()
        res.json({
            users
        })
    }
    catch(err){
        if(client){
            client.close()
        }
        res.status(500).json({
            message: "something went wrong"
        })
    }
})

app.get("/users/:id", async (req, res) => {
    let client
    try{
        client = await mongoClient.connect(URL, {useNewUrlParser: true, useUnifiedTopology: true})
        const db = client.db("react_users_info")
        const user = await db.collection("users").findOne({_id: mongodb.ObjectID(req.params.id) })
        if(user){
            client.close()
            res.json({
                user
            })
            return
        }
        client.close()
        res.status(400).json({
            message: "no user found"
        })
    }
    catch(err){
        if(client){
            client.close()
        }
        res.status(500).json({
            message: "something went wrong"
        })
    }
})

app.delete("/users/:id", async (req, res) => {
    let client
    try{
        client = await mongoClient.connect(URL, {useNewUrlParser: true, useUnifiedTopology: true})
        const db = client.db("react_users_info")
        await db.collection("users").findOneAndDelete({_id: mongodb.ObjectID(req.params.id)})
        client.close()
        res.json({
            message: "success"
        })
    }
    catch(err){
        if(client){
            client.close()
        }
        res.status(500).json({
            message: "something went wrong"
        })
    }
})

app.put("/users/:id", async (req, res) => {
    let client
    try{
        const user = {
            name: req.body.name,
            email: req.body.email,
            country: req.body.country,
            state: req.body.state,
            city: req.body.city,
            line1: req.body.line1,
            line2: req.body.line2,
            gender: req.body.gender,
            maritalStatus: req.body.maritalStatus,
            favouriteFood: req.body.favouriteFood,
            favouriteColor: req.body.favouriteColor
        }
        client = await mongoClient.connect(URL, {useNewUrlParser: true, useUnifiedTopology: true})
        const db = client.db("react_users_info")
        await db.collection("users").findOneAndUpdate({_id: mongodb.ObjectID(req.params.id)},{$set: user})
        client.close()
        res.json({
            message: "success"
        })
    }
    catch(err){
        if(client){
            client.close()
        }
        res.status(500).json({
            message: "something went wrong"
        })
    }
})

app.listen(process.env.PORT || 5000, () => console.log("server started"))
