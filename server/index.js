const express = require("express");
const app = express();
const server = require("http").createServer(app);
const path = require("path");
var mock_data = require('./MOCK_DATA.json');

server.listen(1337);
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname + "/../index.html"));
});

const getDistanceBetweenTwoPoints = (lat1, lng1, lat2, lng2) => {
    const d1 = lat1 * (Math.PI  / 180.0);
    const num1 = lng1 * (Math.PI / 180.0);
    const d2 = lat2 * (Math.PI  / 180.0);
    const num2 = lng2 * (Math.PI / 180.0) - num1;
    const d3 = Math.pow(Math.sin( (d2 - d1) / 2.0 ), 2.0) + Math.cos(d1) * Math.cos(d2) * Math.pow(Math.sin(num2 / 2.0), 2.0);

    return 6376500.0 * (2.0 * Math.atan2(Math.sqrt(d3), Math.sqrt(1.0 - d3)));
}

app.get("/json", (req, res) => {
    const {lat, lng, radius} = req.query;
    const data = mock_data.filter(
        (item) => {
            const distance = getDistanceBetweenTwoPoints(
                lat, lng, 
                item.location.lat, item.location.lng
            );

            return distance <= radius
        }
    );

    setTimeout(() => {
        res.json(data);
    }, 3500);
});