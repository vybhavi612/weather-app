require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


const API_KEY = process.env.API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

app.get("/", (req, res) => {
    res.render("home", { weather: null, error: null });
});

app.post("/", async (req, res) => {
    const city = req.body.city;
    if (!city) {
        return res.render("home", { weather: null, error: "Please enter a city name!" });
    }

    try {
        const response = await axios.get(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        const weatherData = response.data;
        const weather = {
            city: weatherData.name,
            temp: weatherData.main.temp,
            description: weatherData.weather[0].description
            // icon: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`
        };
        res.render("home", { weather, error: null });
    } catch (error) {
        res.render("home", { weather: null, error: "City not found!" });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
