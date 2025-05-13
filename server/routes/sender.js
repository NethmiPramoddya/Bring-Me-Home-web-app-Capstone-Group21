const express = require("express");
const SenderModel = require("../models/Senders");


const router = express.Router();


router.get('/getUser/:id', (req, res)=>{
    const id = req.params.id
    SenderModel.findById({_id:id})
    .then(senders => res.json(senders))
    .catch(err => res.json(err))
})


module.exports = router;
