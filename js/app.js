// https://developer.schiphol.nl/
const NS_API_KEY =  "2d857eac14f84633b18160e44a5918a0";
// https://rapidapi.com/aedbx-aedbx/api/aerodatabox/
const RAPID_API_KEY = "60d1271ce1mshca9b0dbfbabd3a3p1be505jsnd17a99c22f98";


async function app() {
    renderTrainDepartures();
    renderFlights();
}

app().catch(function (error) {
    console.error(error)
});

async function getTrainDepartures() {
    // get departures from NS api
    let res = await axios.get("https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/departures", {
        params: {
            station: "Asd" // Asd is for amsterdam central
        },
        headers: {
            "Ocp-Apim-Subscription-Key": NS_API_KEY,
        }
    });
    return res.data;
}

async function getDepartureFlights() {
    // get departure flights from aerodatabox
    let res = await axios.get("https://aerodatabox.p.rapidapi.com/airports/icao/EHAM/stats/routes/daily", {
        headers: {
            'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com',
            'X-RapidAPI-Key': RAPID_API_KEY
        }
    });
    return res.data;
}


async function renderTrainDepartures() {
    let data = await getTrainDepartures();
    let departureHTML = document.getElementById("departures");
    let departures = data.payload.departures.slice(0, 8); // get top 8 train departures

    for (const departure of departures) {
        let container = getCardContainer();
        let title = getCardTitle("AMS -> " + departure.direction);
        let date = new Date(departure.plannedDateTime);
        container.appendChild(title);

        container.appendChild(getCardDetail("Train name: " + departure.name))
        container.appendChild(getCardDetail("Departure track: " + departure.plannedTrack))
        container.appendChild(getCardDetail("Departure time: " + date.toLocaleString()))
        container.appendChild(getCardDetail("Departure status: " + departure.departureStatus))
        departureHTML.appendChild(container);
    }
}

async function renderFlights() {
    let flights = await getDepartureFlights();
    let departureHTML = document.getElementById("daily-routes");
    let routes = flights.routes.slice(0, 8); // get top 8 flights

    for (const route of routes) {
        let shortName = route.destination.shortName;
        let fullName = route.destination.name;
        let averageDailyFlights = route.averageDailyFlights;
        let container = getCardContainer();

        if (!shortName) {
            shortName = fullName
        }

        let title = getCardTitle("AMS -> " + shortName);

        container.appendChild(title);

        container.appendChild(getCardDetail("Full name: " + fullName))
        container.appendChild(getCardDetail("Average daily flights: " + averageDailyFlights))
        departureHTML.appendChild(container);
    }
}

function getCardTitle(title) {
    const cardTitle = document.createElement("h5");
    cardTitle.className = "card-title";
    cardTitle.innerHTML = title;
    return cardTitle; 
}

function getCardContainer() {
    const cardContainer = document.createElement("div");
    cardContainer.className = "card-container";
    return cardContainer;
}

function getCardDetail(innerHTML) {
    const cardDetail = document.createElement("p");
    cardDetail.className = "card-detail";
    cardDetail.innerHTML = innerHTML;
    return cardDetail;
}