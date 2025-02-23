import { Route, Stop, Trip, StopTime, GTFSData } from "./models";

const GTFS_FILES = [
    "agency.txt",
    "calendar.txt",
    "calendar_dates.txt",
    "routes.txt",
    "stops.txt",
    "stop_times.txt",
    "trips.txt"
];

export async function fetchGTFSData(basePath: string): Promise<GTFSData> {
    const data: Partial<GTFSData> = {};

    await Promise.all(
        GTFS_FILES.map(async (fileName) => {
            const filePath = `${basePath}/${fileName}`;
            const parsedData = await fetchAndParseCSV(filePath);

            switch (fileName) {
                case "stops.txt":
                    data.stops = parseStops(parsedData);
                    break;
                case "routes.txt":
                    data.routes = parseRoutes(parsedData);
                    break;
                case "trips.txt":
                    data.trips = parseTrips(parsedData);
                    break;
                case "stop_times.txt":
                    data.stopTimes = parseStopTimes(parsedData);
                    break;
            }
        })
    );

    return data as GTFSData;
}

// Fetch and parse a single GTFS CSV file
async function fetchAndParseCSV(filePath: string): Promise<any[]> {
    const response = await fetch(filePath);
    const text = await response.text();
    return parseCSVToJSON(text);
}

function parseCSVToJSON(csvText: string): any[] {
    const rows = csvText.split("\n");
    const headers = rows[0].split(",");
    const data = rows.slice(1).map((row: string) => {
        const values = row.split(",");
        let obj: { [key: string]: string } = {};
        headers.forEach((header: string, index: number) => {
            obj[header] = values[index];
        });
        return obj;
    });
    return data;
}

function parseStops(parsedData: any[]): Stop[] {
    return parsedData.map((row) => ({
        stopId: row.stop_id,
        stopName: row.stop_name,
        stopLat: parseFloat(row.stop_lat),
        stopLon: parseFloat(row.stop_lon),
    }));
}

function parseRoutes(parsedData: any[]): Route[] {
    return parsedData.map((row) => ({
        routeId: row.route_id,
        agencyId: row.agency_id,
        routeShortName: row.route_short_name,
        routeLongName: row.route_long_name,
        routeType: parseInt(row.route_type, 10),
        routeUrl: new URL(row.route_url),
        routeColor: row.route_color,
        routeTextColor: row.route_text_color
    }));
}

function parseTrips(parsedData: any[]): Trip[] {
    return parsedData.map((row) => ({
        routeId: row.route_id,
        serviceId: row.service_id,
        tripId: row.trip_id,
        tripHeadsign: row.trip_headsign,
        directionId: row.direction_id ? parseInt(row.direction_id, 10) : undefined,
    }));
}

function parseStopTimes(parsedData: any[]): StopTime[] {
    return parsedData.map((row) => ({
        tripId: row.trip_id,
        arrivalTime: parseStringToTime(row.arrival_time),
        departureTime: parseStringToTime(row.departure_time),
        stopId: row.stop_id,
        stopSequence: parseInt(row.stop_sequence, 10),
        timepoint: row.timepoint ? parseInt(row.timepoint, 10) : 1,
    }));
}

function parseStringToTime(timeString: string): Date {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);

    return date;
}