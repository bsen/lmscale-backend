const express = require("express");
const AgentController = require("../controllers/agentController");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/create", auth, AgentController.create);
router.get("/list", auth, AgentController.getAgents);

module.exports = router;
