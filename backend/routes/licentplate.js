const express = require("express");
const router = express.Router();
const dataController = require("../controllers/dataController");

router.post("/", dataController.createData);
router.get("/", dataController.getAllData);
router.get("/id", dataController.getDataById);

module.exports = router;
