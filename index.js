const express = require("express");
const axios = require("axios");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3001;

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const ORS_API_KEY = process.env.ORS_API_KEY;

const cors = require('cors');
app.use(cors());
app.use(express.json());

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.post("/geocode", async (req, res) => {
    console.log(req.body);
    try {
        const address = req.body.address;

        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                address
            )}&key=${GOOGLE_API_KEY}`,
            { timeout: 5000 }
        );

        res.send(response.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.post("/getRoute", async (req, res) => {
    console.log(req.body);
    try {
        const start = req.body.start;
        const end = req.body.end;

        const response = await axios.post('https://api.openrouteservice.org/v2/directions/driving-car', {
            coordinates: [
                [start.lng, start.lat],
                [end.lng, end.lat]
            ],
            format: 'json'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': ORS_API_KEY
            }
        });

        res.send(response.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
})
