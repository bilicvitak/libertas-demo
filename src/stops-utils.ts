import { GTFSData, Stop, StopTime } from "./models";

/**
 * Extracts start stops (stops with stopSequence === 10) from stop_times.txt.
 */
export function extractStartStops(gtfsData: GTFSData): Stop[] {
  const startStops = gtfsData.stopTimes.filter(stopTime => stopTime.stopSequence === 10);

  // Remove duplicates by stopId
  const uniqueStartStopIds = Array.from(new Set(startStops.map(stopTime => stopTime.stopId)));

  // Map stopIds to Stop objects
  const uniqueStartStops = uniqueStartStopIds.map(stopId =>
    gtfsData.stops.find(stop => stop.stopId === stopId)!
  );

  return uniqueStartStops;
}

/**
 * Filters end stops based on the selected start stop.
 */
export function filterEndStopsBasedOnStartStop(startStopId: string, gtfsData: GTFSData): Stop[] {
  // Step 1: Find all trips that include the selected start stop (where stop sequence is 10)
  const tripsStartingAtStop = gtfsData.stopTimes
    .filter(stopTime => stopTime.stopId === startStopId && stopTime.stopSequence === 10)
    .map(stopTime => stopTime.tripId);

  // Step 2: Find the end stops for these trips (stops with the maximum sequence number for each trip)
  const tripEndStops: StopTime[] = [];
  const tripMaxSequences: { [tripId: string]: number } = {};

  // First pass: Find the maximum sequence number for each trip
  gtfsData.stopTimes.forEach(stopTime => {
    if (tripsStartingAtStop.includes(stopTime.tripId)) {
      if (!tripMaxSequences[stopTime.tripId] || stopTime.stopSequence > tripMaxSequences[stopTime.tripId]) {
        tripMaxSequences[stopTime.tripId] = stopTime.stopSequence;
      }
    }
  });

  // Second pass: Identify the end stops (stops with the maximum sequence number for each trip)
  gtfsData.stopTimes.forEach(stopTime => {
    if (
      tripsStartingAtStop.includes(stopTime.tripId) &&
      stopTime.stopSequence === tripMaxSequences[stopTime.tripId]
    ) {
      tripEndStops.push(stopTime);
    }
  });

  // Step 3: Filter for unique end stops
  const uniqueEndStopIds = Array.from(new Set(tripEndStops.map(stopTime => stopTime.stopId)));
  const uniqueEndStops = uniqueEndStopIds.map(stopId =>
    gtfsData.stops.find(stop => stop.stopId === stopId)!
  );

  return uniqueEndStops;
}

/**
 * Populates a select list with stops.
 * Displays stop names but returns stop IDs.
 */
export function populateSelectList(
  selectElement: HTMLSelectElement,
  stops: Stop[],
  placeholderText: string = "Select a stop"
) {
  // Clear previous options
  selectElement.innerHTML = "";

  // Add a default placeholder option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = placeholderText;
  defaultOption.disabled = true;
  defaultOption.selected = true;
  selectElement.appendChild(defaultOption);

  // Add stop options
  stops.forEach(stop => {
    const option = document.createElement("option");
    option.value = stop.stopId; // Return stop ID
    option.textContent = stop.stopName || stop.stopId; // Display stop name (fallback to stop ID if name is missing)
    selectElement.appendChild(option);
  });
}