const express = require("express");
const router = express.Router();
const postControllers = require("../controllers/postControllers");

router.post("/", postControllers.memberForm);

module.exports = router;