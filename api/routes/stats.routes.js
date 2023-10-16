module.exports = app => {
    const stats = require("../controllers/stats.controller.js");
  
    var router = require("express").Router();
  
    router.get("/getCount", stats.calculate);
    
    app.use('/api', router);
};