import { GTFSData, StopTime } from "./models";

/**
 * Finds trips that include both the selected start and end stops.
 * Handles circular trips where the start and end stops are the same.
 */
export function findTripsWithStartAndEndStops(
  startStopId: string,
  endStopId: string,
  gtfsData: GTFSData
): string[] {
  const tripsWithStartStop = gtfsData.stopTimes
    .filter(stopTime => stopTime.stopId === startStopId && stopTime.stopSequence === 10)
    .map(stopTime => stopTime.tripId);

  const tripsWithEndStop = gtfsData.stopTimes
    .filter(stopTime => stopTime.stopId === endStopId)
    .map(stopTime => stopTime.tripId);

  // Find intersection of trips that include both start and end stops
  let tripsWithStartAndEnd: string[];

  if (startStopId === endStopId) {
    // Handle circular trips (start and end stops are the same)
    tripsWithStartAndEnd = tripsWithStartStop.filter(tripId => {
      const tripStops = gtfsData.stopTimes.filter(stopTime => stopTime.tripId === tripId);
      const firstStop = tripStops.find(stopTime => stopTime.stopSequence === 10);
      const lastStop = tripStops.reduce((prev, curr) => (curr.stopSequence > prev.stopSequence ? curr : prev));

      return firstStop?.stopId === lastStop?.stopId; // Check if the trip is circular
    });
  } else {
    // Handle non-circular trips (start and end stops are different)
    tripsWithStartAndEnd = tripsWithStartStop.filter(tripId => tripsWithEndStop.includes(tripId));
  }

  return tripsWithStartAndEnd;
}

/**
 * Extracts and sorts departure times for the given trips.
 */
export function extractDepartureTimes(
  tripIds: string[],
  gtfsData: GTFSData
): { tripId: string; departureTime: string }[] {
  const departureTimes: { tripId: string; departureTime: string }[] = [];

  tripIds.forEach(tripId => {
    const stopTime = gtfsData.stopTimes.find(
      stopTime => stopTime.tripId === tripId && stopTime.stopSequence === 10
    );

    if (stopTime && stopTime.departureTime) {
      departureTimes.push({
        tripId: stopTime.tripId,
        departureTime: stopTime.departureTime.toLocaleTimeString(),
      });
    }
  });

  // Sort departure times from earliest to latest
  departureTimes.sort((a, b) => {
    const timeA = new Date(`1970-01-01T${a.departureTime}`).getTime();
    const timeB = new Date(`1970-01-01T${b.departureTime}`).getTime();
    return timeA - timeB;
  });

  return departureTimes;
}

/**
 * Populates a select list with departure times.
 */
export function populateDepartureTimeSelectList(
  selectElement: HTMLSelectElement,
  departureTimes: { tripId: string; departureTime: string }[],
  placeholderText: string = "Select a departure time"
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

  // Add departure time options
  departureTimes.forEach(option => {
    const optionElement = document.createElement("option");
    optionElement.value = option.tripId;
    optionElement.textContent = option.departureTime;
    selectElement.appendChild(optionElement);
  });
}