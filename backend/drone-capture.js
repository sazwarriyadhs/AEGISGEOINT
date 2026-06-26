const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

async function captureAndUpload() {

    try {

        const form = new FormData();

        form.append(
            "photo",
            fs.createReadStream("./sample.png")
        );

        form.append(
            "lat",
            -2.5337
        );

        form.append(
            "lng",
            140.7181
        );

        console.log("");
        console.log("================================");
        console.log("DRONE CAMERA ACTIVE");
        console.log("CAPTURING INCIDENT PHOTO");
        console.log("UPLOADING TO SERVER...");
        console.log("================================");

        const response = await axios.post(

            "http://localhost:5000/api/incident/upload",

            form,

            {
                headers: form.getHeaders()
            }

        );

        console.log("UPLOAD SUCCESS");

        console.log(response.data);

    }

    catch (error) {

        console.log("UPLOAD FAILED");

        console.log(error.message);

    }

}

/* RUN IMMEDIATELY */

captureAndUpload();

/* LOOP */

setInterval(

    captureAndUpload,

    15000

);