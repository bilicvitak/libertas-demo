import { GTFSData } from "./models";

/**
 * Calculates and displays the route with all stops as waypoints using coordinates.
 */
export async function calculateAndDisplayRouteWithWaypoints(
  directionsService: google.maps.DirectionsService,
  directionsRenderer: google.maps.DirectionsRenderer,
  stopIds: string[],
  gtfsData: GTFSData
): Promise<void> {
  if (stopIds.length < 2) {
    window.alert("At least two stops are required to calculate a route.");
    return;
  }

  // Get stop coordinates from GTFS data
  const stops = stopIds.map(stopId => {
    const stop = gtfsData.stops.find(stop => stop.stopId === stopId);
    if (!stop || !stop.stopLat || !stop.stopLon) {
      throw new Error(`Invalid or missing coordinates for stop ID: ${stopId}`);
    }
    return {
      lat: stop.stopLat,
      lng: stop.stopLon,
    };
  });

  const origin = new google.maps.LatLng(stops[0].lat, stops[0].lng);
  const destination = new google.maps.LatLng(stops[stops.length - 1].lat, stops[stops.length - 1].lng);
  const waypoints = stops.slice(1, -1).map(stop => ({
    location: new google.maps.LatLng(stop.lat, stop.lng),
    stopover: true,
  }));

  // Check if the number of waypoints exceeds the API limit
  if (waypoints.length > 25) {
    //window.alert("This trip has too many stops to display the full route. Only the first 25 intermediate stops will be shown.");
    waypoints.splice(25); // Limit the waypoints to 25
  }

  directionsService
    .route({
      origin: origin,
      destination: destination,
      waypoints: waypoints,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true, // Optimize the order of waypoints for the shortest route
    })
    .then((response) => {
      directionsRenderer.setDirections(response);
    })
    .catch((e) => {
      console.error("Directions request failed:", e);
      window.alert("Directions request failed. Please check the console for details.");
    });
}