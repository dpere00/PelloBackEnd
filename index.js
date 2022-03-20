const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//import routes
const authRoute = require('./routes/auth');
const projectRoute = require('./routes/projectRoutes');

dotenv.config();

//connect to db change password later
mongoose.connect(process.env.DB_CONNECT, { useNewURLParser: true },
    () => console.log('connected to db'));

app.use(express.json());

//middleware ?????????
app.use('/api/user', authRoute);
app.use('/api/project', projectRoute);

app.listen(3000, () => console.log('hiii'));

