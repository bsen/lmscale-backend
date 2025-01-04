const express = require("express");
const AgentController = require("../controllers/agentController");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/create", auth, AgentController.create);
router.post("/prompt/update", auth, AgentController.updatePrompt);
router.get("/list", auth, AgentController.getAgents);
router.get("/data", auth, AgentController.getAgentDetails);

module.exports = router;
