// Express
var express = require('express');
var app = express();
// Route
var route = require('./routes/index');
var route_user = require('./routes/user')
// Database
var mongoose = require('mongoose')
var DBurl =  require('./data/config')
var session = require('express-session');
var connectMG = require('connect-mongo');
var MongoStore = connectMG(session);
mongoose.connect(DBurl.url)
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});
//Body parser
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Token - session
app.use(session({
    secret: 'mysuppersecret',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
      })
}));
// Passport - flash
var flash = require('connect-flash')
app.use(flash());
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session()); 

// Set route
app.use((req,res,next)=>{
    res.locals.login = req.isAuthenticated();
    next();
})


//Set route bassic
app.use('/assets',express.static('public'));
// app.engine('hbs',expressHbs);
app.set('view engine','hbs');
app.set('views','./views');

app.use('/',route);
app.use('/',route_user);


app.listen(process.env.PORT || 8080)