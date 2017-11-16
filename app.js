const express =require('express');
const path=require('path');
const bodyParser =require('body-parser');
const exphbs =require('express-handlebars');
const db=require('./config/database').dbConnect();
const app=express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'public')));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//front-end libs
app.use('/bootstrap',express.static(path.join(__dirname,'node_modules/bootstrap/dist')));
app.use('/jquery',express.static(path.join(__dirname,'node_modules/jquery/dist')));
app.use('/jqueryui',express.static(path.join(__dirname,'node_modules/jqueryui')));
app.use('/fontawesome',express.static(path.join(__dirname,'node_modules/font-awesome')));

//routings
app.use('/',require('./controllers/index'));
app.use('/login',require('./controllers/account/login'));
app.use('/register',require('./controllers/account/register'));
app.use('/folder',require('./controllers/folder'));

module.exports=app;