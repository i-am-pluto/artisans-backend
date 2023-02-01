const express = require("express");
const mongoose = require("mongoose");
const { categorySearch } = require("../../Services/CategoryService");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await categorySearch(req.query.category);
    res.json(data);
  } catch (error) {
    console.log(error);
    res.json({ message: error, success: false });
  }
});

router.post('/add',async(req,res)=>{
   try {
     const data = await categorySearch(req.query.category);
     res.json(data);
   } catch (error) {
     console.log(error);
     res.json({ message: error, success: false });
   } 
})

module.exports = router;
