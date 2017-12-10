module.exports={
  authenticated:(req,res,next)=>{
      if(req.isAuthenticated()){
          return next();
      } else{
          res.render('account/login');
      }
  }
};