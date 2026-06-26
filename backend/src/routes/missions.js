const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {

    res.json({
        missions: []
    });

});

router.post("/create", (req, res) => {

    res.json({
        status: "mission created"
    });

});

module.exports = router;
