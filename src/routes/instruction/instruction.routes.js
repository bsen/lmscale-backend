const express = require("express");
const InstructionController = require("./instruction.controller");
const auth = require("../../middleware/auth.middleware");

const router = express.Router();

router.post("/create", auth, InstructionController.createInstruction);
router.post("/update", auth, InstructionController.updateInstruction);
router.post("/delete", auth, InstructionController.deleteInstruction);

module.exports = router;
