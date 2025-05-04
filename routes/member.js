const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberController");

router.post("/", memberController.newMemberForm);

module.exports = router;
