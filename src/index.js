import { findState } from "./utility";

const ipForm = document.querySelector("#ip-form");
const ipData = document.querySelector("#ip-data");
const locationData = document.querySelector("#location-data");
const timezoneData = document.querySelector("#timezone-data");
const ispData = document.querySelector("#isp-data");
let longitude = 0;
let latitude = 0;

const IPIFY_API_KEY = process.env.IPIFY_API_KEY;
const MAPBOX_API_KEY = process.env.MAPBOX_API_KEY;
const ipifyURL = `https://geo.ipify.org/api/v1?apiKey=${IPIFY_API_KEY}`;

// CREATE LOCATION ICON ***************************************
const locationIcon = L.icon({
  iconUrl: "/assets/images/icon-location.svg",

  iconSize: [30, 38], // size of the icon

  iconAnchor: [22, 28], // point of the icon which will correspond to marker's location
  popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
});

// SETUP MAP VIEW ***************************************
const mymap = L.map("mapid").setView([longitude, latitude], 13);
const marker = L.marker([longitude, latitude], {
  icon: locationIcon,
}).addTo(mymap);

// ADD TILELAYER FROM MAPBOX API ***************************************
L.tileLayer(
  `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${MAPBOX_API_KEY}`,
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    minZoom: 2,
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: MAPBOX_API_KEY,
  }
).addTo(mymap);

// RENDER DATA FUNCTION
const renderFetchData = (data) => {
  ipData.innerText = `${data.ip}`;
  locationData.innerText = `${data.location.city}, ${findState(
    data.location.region
  )} ${data.location.postalCode} `;
  timezoneData.innerText = `UTC ${data.location.timezone}`;
  ispData.innerText = `${data.isp}`;
  longitude = data.location.lat;
  latitude = data.location.lng;
  mymap.setView([longitude, latitude]);
  marker.setLatLng([longitude, latitude]);
};

// SEARCHIP AND GETIPIFY FETCH REQUEST AND ERROR HANDLING

const searchIP = (ip) => {
  return fetch(ip).then((response) => {
    if (response.status === 200) {
      return response.json();
    } else throw new Error(`Error from fetch ipify request`);
  });
};

const getIpifyData = () => {
  return fetch(ipifyURL).then((response) => {
    if (response.status === 200) {
      return response.json();
    } else throw new Error(`Error from fetch ipify request`);
  });
};

// SUBMIT FORM EVENT LISTENER ***************************************
ipForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(e.target.elements.inputIpAddress.value.trim());
  const userInput = e.target.elements.inputIpAddress.value.trim();
  const ipAddressInput = `${ipifyURL}=${userInput}`;

  return searchIP(ipAddressInput)
    .then((data) => {
      return renderFetchData(data);
    })
    .catch((error) => {
      `Error message:${error}`;
    });
});

getIpifyData()
  .then((data) => {
    console.log(data);
    return renderFetchData(data);
  })
  .catch((error) => {
    `Error message:${error}`;
  });
