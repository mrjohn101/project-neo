const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const axios = require('axios').default;
const app = express();

app.use(express.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {

  const today = new Date();
  const endDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

  const dateMinusSeven = new Date();
  dateMinusSeven.setDate(dateMinusSeven.getDate() - 7);
  const startDate = dateMinusSeven.getFullYear()+'-'+(dateMinusSeven.getMonth()+1)+'-'+dateMinusSeven.getDate();

  const apiKey = "RFt5GDdxmazfJKz78s5nCdiQ5TpapUP7TF1dYHfw";
  const url = "https://api.nasa.gov/neo/rest/v1/feed?start_date=" + startDate + "&end_date=" + endDate + "&api_key=" + apiKey;
  //input //call back
  https.get(url, function(response) {
    //console.log(response);
    let chunks = [];
    response.on("data", function(data) {
      chunks.push(data);

    }).on('end', function() {
      let data = Buffer.concat(chunks);
      let neoData = JSON.parse(data);
      let objectLength = Object.keys(neoData.near_earth_objects).length;
      let propertyDatesArray = Object.keys(neoData.near_earth_objects);

      res.write("<h1>Project Neo - Near Earth Object</h1>");
      res.write("<h3>"+startDate+" ~ "+endDate+"(UTC)</h3>");
      res.write("<ul>");
      for (let i = 0; i < objectLength - 1; i++) {
        for (let n = 0; n < neoData.near_earth_objects[propertyDatesArray[i]].length; n++) {

          if (neoData.near_earth_objects[Object.keys(neoData.near_earth_objects)[i]][n].is_potentially_hazardous_asteroid === true) {
            res.write(
              "<li style=\"background:red;\">Date: " + Object.keys(neoData.near_earth_objects)[i] +
              " | Astriod: " + neoData.near_earth_objects[Object.keys(neoData.near_earth_objects)[i]][n].name +
              " | Est Diameter min(Km): " + neoData.near_earth_objects[Object.keys(neoData.near_earth_objects)[i]][n].estimated_diameter.kilometers.estimated_diameter_min +
              " | Est Diameter max(Km): " + neoData.near_earth_objects[Object.keys(neoData.near_earth_objects)[i]][n].estimated_diameter.kilometers.estimated_diameter_max +
              " | Hazard: <strong>Potential Hazard for Earth</strong></li></br>");

          } else {
            res.write(
              "<li>Date: " + Object.keys(neoData.near_earth_objects)[i] +
              " | Astriod: " + neoData.near_earth_objects[Object.keys(neoData.near_earth_objects)[i]][n].name +
              " | Est Diameter min(Km): " + neoData.near_earth_objects[Object.keys(neoData.near_earth_objects)[i]][n].estimated_diameter.kilometers.estimated_diameter_min +
              " | Est Diameter max(Km): " + neoData.near_earth_objects[Object.keys(neoData.near_earth_objects)[i]][n].estimated_diameter.kilometers.estimated_diameter_max +
              " | Hazard: Safe</li></br>");
          }

        }
      }
      res.write("</ul>");
      res.send();
    });
  });

});

app.post("/", function(req, res) {



});

app.listen(process.env.PORT || 3000, function() {
  console.log("server is running on port 3000.");
});


//API Key
// RFt5GDdxmazfJKz78s5nCdiQ5TpapUP7TF1dYHfw

// https://api.nasa.gov/planetary/apod?api_key=RFt5GDdxmazfJKz78s5nCdiQ5TpapUP7TF1dYHfw
