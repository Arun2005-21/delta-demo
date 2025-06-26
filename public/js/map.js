// First, log the coordinates to verify what format they're in
console.log("Coordinates:", coordinates);

// Check if coordinates exist and handle possible formats
let mapCenter;
if (Array.isArray(coordinates) && coordinates.length === 2) {
  // If coordinates is a valid [lng, lat] array
  mapCenter = coordinates;
} else if (coordinates && (coordinates.lng !== undefined || coordinates.lon !== undefined)) {
  // If coordinates is an object with lng/lon and lat properties
  mapCenter = [coordinates.lng || coordinates.lon, coordinates.lat];
} else {
  // Default coordinates if invalid (you can set this to any valid location)
  console.error("Invalid coordinates format, using default location");
  mapCenter = [78.9629, 20.5937]; // Default to center of India
}

// Now initialize the map with the validated coordinates
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: "map", 
    style: 'mapbox://styles/mapbox/streets-v12',
    center: mapCenter, 
    zoom: 10
});

// Similarly, make sure we use validated coordinates for the marker
const marker = new mapboxgl.Marker({ color: "Red"})
  .setLngLat(mapCenter)
  .setPopup(new mapboxgl.Popup({offset: 25 })  
  // .setHTML(
  //   `<h4>${listingTitle}</h4><p>Exact location provided after booking</p>`
  // )
)
  .addTo(map);