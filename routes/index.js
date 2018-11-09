var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Live Chat & Ball Game" });
});

router.get("/getEnv", function(req, res, next) {
  const envData = require("../config/env.json")[process.env.NODE_ENV || "development"];
  return res.json(envData);
});

module.exports = router;
