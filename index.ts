import { extractStartStops, filterEndStopsBasedOnStartStop, populateSelectList } from "./src/stops-utils";
import { fetchGTFSData } from "./src/gtfs-service";
import { findTripsWithStartAndEndStops, extractDepartureTimes, populateDepartureTimeSelectList } from "./src/departure-utils";
import { GTFSData } from "./src/models";

async function initMap(): Promise<void> {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 14,
      center: { lat: 42.6627120110896, lng: 18.0836206312485 },
    }
  );

  directionsRenderer.setMap(map);

  // Load GTFS data once at the beginning
  const basePath = "gtfs_data";
  let gtfsData: GTFSData;

  try {
    gtfsData = await fetchGTFSData(basePath);
  } catch (error) {
    console.error("Failed to load GTFS data:", error);
    window.alert("Failed to load GTFS data. Please check the console for details.");
    return;
  }

  // Get the select elements
  const startSelect = document.getElementById("start") as HTMLSelectElement;
  const endSelect = document.getElementById("end") as HTMLSelectElement;
  const departureTimeSelect = document.getElementById("departure-time") as HTMLSelectElement;

  // Extract and populate start stops
  const startStops = extractStartStops(gtfsData);
  populateSelectList(startSelect, startStops, "Select a start stop");

  // Populate the end stop select list with a placeholder
  populateSelectList(endSelect, [], "Select an end stop");

  // Populate the departure time select list with a placeholder
  populateDepartureTimeSelectList(departureTimeSelect, [], "Select a departure time");

  // Handle start stop selection change
  startSelect.addEventListener("change", () => {
    const selectedStartStopId = startSelect.value;

    if (selectedStartStopId) {
      try {
        const filteredEndStops = filterEndStopsBasedOnStartStop(selectedStartStopId, gtfsData);

        // Populate the end stop select list
        populateSelectList(endSelect, filteredEndStops, "Select an end stop");
      } catch (error) {
        console.error("Failed to filter end stops:", error);
        window.alert("Failed to filter end stops. Please check the console for details.");
      }
    } else {
      // Clear the end stop select list if no start stop is selected
      populateSelectList(endSelect, [], "Select an end stop");
    }

    // Clear the departure time select list
    populateDepartureTimeSelectList(departureTimeSelect, [], "Select a departure time");
  });

  // Handle end stop selection change
  endSelect.addEventListener("change", () => {
    const selectedStartStopId = startSelect.value;
    const selectedEndStopId = endSelect.value;

    if (selectedStartStopId && selectedEndStopId) {
      try {
        // Find trips that include both the selected start and end stops
        const tripsWithStartAndEnd = findTripsWithStartAndEndStops(selectedStartStopId, selectedEndStopId, gtfsData);

        // Extract and sort departure times for these trips
        const departureTimes = extractDepartureTimes(tripsWithStartAndEnd, gtfsData);

        // Populate the departure time select list
        populateDepartureTimeSelectList(departureTimeSelect, departureTimes, "Select a departure time");
      } catch (error) {
        console.error("Failed to extract departure times:", error);
        window.alert("Failed to extract departure times. Please check the console for details.");
      }
    } else {
      // Clear the departure time select list if no start or end stop is selected
      populateDepartureTimeSelectList(departureTimeSelect, [], "Select a departure time");
    }
  });

  // Handle departure time selection change
  departureTimeSelect.addEventListener("change", () => {
    const selectedTripId = departureTimeSelect.value;

    if (selectedTripId) {
      // You can use the selectedTripId for further processing if needed
      console.log("Selected Trip ID:", selectedTripId);
    }
  });
}

function calculateAndDisplayRoute(
  directionsService: google.maps.DirectionsService,
  directionsRenderer: google.maps.DirectionsRenderer
) {
  const startSelect = document.getElementById("start") as HTMLSelectElement;
  const endSelect = document.getElementById("end") as HTMLSelectElement;

  const startStopId = startSelect.value;
  const endStopId = endSelect.value;

  if (!startStopId || !endStopId) {
    window.alert("Please select both a start and end stop.");
    return;
  }

  const startStopName = startSelect.options[startSelect.selectedIndex].text;
  const endStopName = endSelect.options[endSelect.selectedIndex].text;

  directionsService
    .route({
      origin: {
        query: startStopName,
      },
      destination: {
        query: endStopName,
      },
      travelMode: google.maps.TravelMode.DRIVING,
    })
    .then((response) => {
      directionsRenderer.setDirections(response);
    })
    .catch((e) => {
      console.error("Directions request failed:", e);
      window.alert("Directions request failed. Please check the console for details.");
    });
}

declare global {
  interface Window {
    initMap: () => void;
  }
}

window.initMap = initMap;
export {};