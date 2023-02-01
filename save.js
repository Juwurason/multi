

app.get('/post', async (req,res)=>{
    const post = await getpost()
    res.send(post)
})

app.get('/post/:id', async (req,res)=>{
    const id = req.params.id
    const posts = await getposts(id)
    res.send(posts)
})

app.post("/post", async (req,res)=>{
    const {title, body} = req.body
    const pos = await createpost(title, body)
    res.status(201).send(pos)
})

app.post("/signUp", async (req, res) =>{
    const {username, password} = req.body;
    const sign = await signUp(username, password)
    res.status(201).send(sign)
})