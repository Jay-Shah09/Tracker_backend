const express = require('express');
const passport = require('passport');
const cors = require('cors');
const connectDB = require('./db/connect');
const authRoute = require('./routes/auth');
require('./passport');
//require('dotenv').config();
const cookieSession = require('cookie-session');
const https = require('https');
const path = require('path');
const fs = require('fs');

const app = express();

const sslServer = https.createServer(
    {
        key: fs.readFileSync(path.join(__dirname, 'certificate', 'localhost-key.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'certificate', 'localhost.pem')),
    }, app)

app.use(cookieSession(
    {
        name: "session",
        keys: ["jay"],
        maxAge: 24*60*60*100
    }
));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cors(
    {
        origin: "https://localhost:3000",
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
    }
));

app.use("/auth", authRoute);

const PORT = 3001;
const start = async() => {
    try {
        await connectDB('mongodb+srv://Jay:ppBsM0xJHo1ivA6N@cluster0.akjxy.mongodb.net/Tracker?retryWrites=true&w=majority');
        sslServer.listen(PORT,()=>{console.log(`server is listening on port ${PORT}`)});
    } catch (error) {
        console.log(error);
    }
}
start();