const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {

    res.json({
        threats: []
    });

});

module.exports = router;
