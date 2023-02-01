import express from "express"
const app = express()
import dotenv from 'dotenv'
dotenv.config()
import cors from "cors"
import cookieParser from "cookie-parser"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import validator from "validator"
const PORT = process.env.PORT
const router = express.Router()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

import {register, getpost, getposts, companyadmin, getpos, login} from './database.js'

app.get('/', (req,res)=>{
   
    res.send("hello world")
})

app.get('/post', async (req,res)=>{
    const post = await getpost()
    res.send(post)
})

app.get('/post/:id', async (req,res)=>{
    const id = req.params.id
    const posts = await getposts(id)
    res.send(posts)
})

app.get('/post/:id', async (req,res)=>{
    const id = req.params.id
    const pos = await getpos(id)
    res.send(pos)
})

app.post("/register", async (req, res) =>{
    try {
  const {CompanyName, CompanyEmail, CompanyAddress, CompanyPhone, PackagesId} = req.body;

   if(!validator.isEmail(CompanyEmail)){
    return res.status(400).json({ message: 'Invalid email address' });
}
    const reg = await register(CompanyName, CompanyEmail, CompanyAddress, CompanyPhone, PackagesId)
    const i = {id: reg.CompanyId}
    // const comid = await getposts(CompanyId)
    res.status(301).send({'message': i, 'url': '/companyadmin'})
    // res.redirect(`/companyadmin`)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error creating user" });
    }
})

app.post("/companyadmin", async (req, res) =>{
    // const id = req.body.id;
    try {
        const {FirstName, SurName, Email, PhoneNumber, password} = req.body;
               
       if(!validator.isEmail(Email)){
            return res.status(400).json({ message: 'Invalid email address' });
        }

     const hashedPassword = await bcrypt.hash(password, 10);
        
    const newUser = await companyadmin(FirstName, SurName, Email, PhoneNumber, hashedPassword)
    const token = jwt.sign({ email: newUser.Email, userId: newUser.CompanyAdminId }, process.env.JWT_SECRET);
    res.status(201).json({ message: "User created", token});
    // res.status(201).send(reg)
    } catch (error) {
        console.log(error);
       return res.status(500).json({ message: "Error creating user" });
    }
})

app.post("/login", async (req, res) =>{
    const { email, password } = req.body;
    const loginData = await login(email, password);
    if (loginData.error) {
      res.status(401).json(loginData);
    } else {
      res.json(loginData);
    }
});











app.listen(PORT, ()=> console.log(`app on port ${PORT}`));
























































// app.get('/post', async (req,res)=>{
//     const post = await getpost()
//     res.send(post)
// })

// app.get('/post/:id', async (req,res)=>{
//     const id = req.params.id
//     const posts = await getposts(id)
//     res.send(posts)
// })

// app.post("/post", async (req,res)=>{
//     const {title, body, created_at} = req.body
//     const pos = await createpost(title, body, created_at)
//     res.status(201).send(pos)
// })

// app.post("/signUp", async (req, res) =>{
//     const {username, password} = req.body;
//     const sign = await signUp(username, password)
//     res.status(201).send(sign)
// })