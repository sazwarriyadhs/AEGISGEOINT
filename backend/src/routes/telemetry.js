const express = require("express");
const router = express.Router();

router.post("/update", (req, res) => {

    const telemetry = req.body;

    res.json({
        status: "received",
        data: telemetry
    });

});

router.get("/live", (req, res) => {

    res.json({
        status: "telemetry stream active"
    });

});

module.exports = router;
