const express = require("express");
const router = new express.Router();
const post_user=require("../controollers/producer_post")
const get_user=require('../controollers/producer_get')



router.post("/sigins" , post_user.form)

router.get("/signup" , get_user.Get)
module.exports=router