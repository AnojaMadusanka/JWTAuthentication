const express = require('express');
const app = express();
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');
const mongoCon = require('./connection/mongodb');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

mongoCon.on('open', ()=>{
    console.log('Database Connected');
});

//Route Middleware
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(8500, ()=>{
    console.log("Server Up and Running");
});