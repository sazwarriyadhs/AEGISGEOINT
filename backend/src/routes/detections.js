const express = require("express");
const router = express.Router();

router.post("/report", (req, res) => {

    const detection = req.body;

    res.json({
        status: "detection stored",
        data: detection
    });

});

router.get("/live", (req, res) => {

    res.json({
        status: "live detection stream"
    });

});

module.exports = router;
