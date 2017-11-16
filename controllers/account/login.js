const express=require('express');
const router=express.Router();

router.get('/',(req,res)=>{
    res.render('account/login');
});

module.exports=router;