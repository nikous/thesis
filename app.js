const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();



// Passport Config
require('./config/passport')(passport);
//Passport middleware

app.use(passport.initialize());
app.use(passport.session());
// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
    .connect(
        db,
        { useNewUrlParser: true, useUnifiedTopology: true }

    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({ extended: true }));

//Express-session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

app.use(passport.initialize());
app.use(passport.session());


//connect flash
app.use(flash());

//Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

//Middleware for my static files
app.use('/public', express.static('public'));

//Middleware for my incoming json data
app.use(express.json());



//  /:symbol
// app.get('/getApi', async (request, response) => {
app.get('/getApi/:symbol', async (request, response) => {
    const api_key = process.env.API_KEY;
    const symbol = request.params.symbol;
    console.log("1");
    console.log(request.params.symbol);
    const api_url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + symbol + '&apikey=' + api_key + '';
    //'https://api.worldtradingdata.com/api/v1/history?symbol=MFST&api_token=UXuQYzpm2MAQzDNLCgEcuC9Tna6gx2Tabo9ODNpkCsH9nfaK1BZxnjFUFrrV';
    console.log(api_url);
    //  'https://api.worldtradingdata.com/api/v1/history?symbol=' + symbol + '&date=2018-10-30&api_token=UXuQYzpm2MAQzDNLCgEcuC9Tna6gx2Tabo9ODNpkCsH9nfaK1BZxnjFUFrrV';
    const fetch_response = await fetch(api_url);

    const json = await fetch_response.json();
    response.json(json);


    exports.symbol = request.params.symbol;


});


app.post('/getApi', (request, response) => {
    console.log('I got a request');
    console.log(request.body);
    console.log(request.array);
    response.json(request.body);


});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));