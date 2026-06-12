const API_KEY = "c1c7d3c456b74d50aaf74736261206"; // <-- apni key yahan daalo

const cityInput   = document.getElementById("cityInput");
const searchBtn   = document.getElementById("searchBtn");
const weatherCard = document.getElementById("weatherCard");

/* ── BUG FIX: pehle response.ok check karo, PHIR data parse karo ── */
async function getWeather(city) {
    try {
        weatherCard.innerHTML = `<p class="loading">Fetching weather for <strong>${city}</strong>…</p>`;

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
        );

        // ✅ FIX 1: status pehle check karo
        if (!response.ok) {
            const errData = await response.json();

            if (response.status === 401) {
                throw new Error("Invalid API key. Check karein ya 10–15 min baad try karein — new keys activate hone mein time lagte hain.");
            }
            if (response.status === 404) {
                throw new Error(`"${city}" city nahi mili. Spelling check karein.`);
            }

            throw new Error(errData.message || "Weather data fetch nahi ho saka.");
        }

        // ✅ FIX 2: data sirf tab parse karo jab response OK ho
        const data = await response.json();
        displayWeather(data);

    } catch (error) {
        // ✅ FIX 3: Network errors bhi handle karo
        const msg = error.message.includes("Failed to fetch")
            ? "Network error — internet connection check karein."
            : error.message;

        weatherCard.innerHTML = `<div class="error-msg">⚠️ ${msg}</div>`;
        console.error("Weather error:", error);
    }
}

function displayWeather(data) {
    const { name, main, wind, weather, sys } = data;

    weatherCard.innerHTML = `
        <div class="weather-result">

            <div class="city-row">
                <div class="city-name">${name}, ${sys.country}</div>
                <div class="condition-badge">${weather[0].description}</div>
            </div>

            <div class="temp-row">
                <div class="temp-main">${Math.round(main.temp)}°C</div>
                <div class="temp-feels">
                    Feels like
                    <span>${Math.round(main.feels_like)}°C</span>
                </div>
            </div>

            <div class="metrics-grid">

                <div class="metric-card">
                    <span class="metric-icon">💧</span>
                    <div class="metric-label">Humidity</div>
                    <div class="metric-value">${main.humidity}%</div>
                </div>

                <div class="metric-card">
                    <span class="metric-icon">🌬</span>
                    <div class="metric-label">Wind Speed</div>
                    <div class="metric-value">${wind.speed} m/s</div>
                </div>

                <div class="metric-card">
                    <span class="metric-icon">📈</span>
                    <div class="metric-label">Max Temp</div>
                    <div class="metric-value">${Math.round(main.temp_max)}°C</div>
                </div>

                <div class="metric-card">
                    <span class="metric-icon">📉</span>
                    <div class="metric-label">Min Temp</div>
                    <div class="metric-value">${Math.round(main.temp_min)}°C</div>
                </div>

            </div>
        </div>
    `;
}

/* ── Event Listeners ── */
function handleSearch() {
    const city = cityInput.value.trim();
    if (!city) {
        weatherCard.innerHTML = `<div class="error-msg">⚠️ Please enter a city name.</div>`;
        return;
    }
    getWeather(city);
}

searchBtn.addEventListener("click", handleSearch);

cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSearch();
});