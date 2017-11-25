const express =require('express');
const path=require('path');
const bodyParser =require('body-parser');
const exphbs =require('express-handlebars');
const db=require('./config/database');
const connectFlash=require('connect-flash');
const expressSession=require('express-session');
const app=express();

db.connect();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'public')));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(expressSession({
    secret: 'd7xtdz8t8ft76d767g',
    resave: true,
    saveUninitialized: true
}));

app.use(connectFlash());

app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.share_msg=req.flash('share_msg');
    res.locals.unshare_msg=req.flash('unshare_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    res.locals.user=req.user || null;
    next();
});

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
app.use('/file',require('./controllers/file'));
app.use('/shared',require('./controllers/share'));

app.use((req,res)=>{
   let error=new Error();
   error.status=404;
   res.render('error/error',{
       header:'404',
       message:'Żądany zasób nie został znaleziony'
   })
});

module.exports=app;