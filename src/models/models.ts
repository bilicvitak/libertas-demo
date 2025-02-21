export interface Agency {
    agencyId: string;
    agencyName: string;
    agencyUrl: URL;
    agencyTimezone: string;
    agencyLang?: string;
    agencyPhone?: string;
    agencyFareUrl?: URL;
    agencyEmail?: string;
}

export interface Calendar {
    serviceId: string;
    // Indicates whether the service operates on all Mondays in the date range specified by the start_date and end_date fields.
    // 1 - Service is available for all Mondays in the date range.
    // 0 - Service is not available for Mondays in the date range.
    monday: 0 | 1;
    // Functions in the same way as monday except applies to Tuesdays
    tuesday: 0 | 1;
    // Functions in the same way as monday except applies to Wednesdays
    wednesday: 0 | 1;
    // Functions in the same way as monday except applies to Thursdays
    thursday: 0 | 1;
    // Functions in the same way as monday except applies to Fridays
    friday: 0 | 1;
    // Functions in the same way as monday except applies to Saturdays.
    saturday: 0 | 1;
    // Functions in the same way as monday except applies to Sundays.
    sunday: 0 | 1;
    startDate: Date;
    endDate: Date;
}

export interface CalendarDate {
    serviceId: string;
    date: Date;
    // Indicates whether service is available on the date specified in the date field. 
    // 1 - Service has been added for the specified date.
    // 2 - Service has been removed for the specified date.
    exceptionType: 1 | 2;
}

export interface Route {
    routeId: string;
    agencyId?: string;
    routeShortName?: string;
    routeLongName?: string;
    routeDesc?: string;
    // Indicates the type of transportation used on a route.
    // See valid options: https://gtfs.org/documentation/schedule/reference/#routestxt
    routeType: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 11 | 12;
    routeUrl?: string;
    routeColor?: string;
    routeTextColor?: string;
    routeSortOrder?: number;
    // Indicates that the rider can board the transit vehicle at any point along the vehicle’s travel path.
    // See valid options: https://gtfs.org/documentation/schedule/reference/#routestxt
    continuousPickup?: 0 | 1 | 2 | 3;
    // Indicates that the rider can alight from the transit vehicle at any point along the vehicle’s travel path.
    // See valid options: https://gtfs.org/documentation/schedule/reference/#routestxt
    continuousDropOff?: 0 | 1 | 2 | 3;
    networkId?: string;
}

export interface Stop {
    stopId: string;
    stopCode?: string;
    stopName?: string;
    ttsStopName?: string;
    stopDesc?: string;
    stopLat?: number;
    stopLon?: number;
    zoneId?: string;
    stopUrl?: string;
    // See valid options: https://gtfs.org/documentation/schedule/reference/#stopstxt
    locationType?: 0 | 1 | 2 | 3 | 4;
    parentStation?: string;
    stopTimezone?: string;
    // See valid options: https://gtfs.org/documentation/schedule/reference/#stopstxt
    wheelchairBoarding?: 0 | 1 | 2;
    levelId?: string;
    platformCode?: string;
}

export interface Trip {
    routeId: string;
    serviceId: string;
    tripId: string;
    tripHeadsign?: string;
    tripShortName?: string;
    // Indicates the direction of travel for a trip.
    // 0 - Travel in one direction (e.g. outbound travel).
    // 1 - Travel in the opposite direction (e.g. inbound travel).
    directionId?: 0 | 1;
    blockId?: string;
    shapeId?: string;
    // See valid options: https://gtfs.org/documentation/schedule/reference/#tripstxt
    wheelchairAccessible?: 0 | 1 | 2;
    // See valid options: https://gtfs.org/documentation/schedule/reference/#tripstxt
    bikesAllowed?: 0 | 1 | 2;
}

export interface StopTime {
    tripId: string;
    arrivalTime?: string;
    departureTime?: string;
    stopId: string;
    locationGroupId?: string;
    locationId?: string;
    stopSequence: number;
    stopHeadsign?: string;
    startPickupDropOffWindow?: string;
    endPickupDropOffWindow?: string;
    pickupType?: 0 | 1 | 2 | 3;
    dropOffType?: 0 | 1 | 2 | 3;
    continuousPickup?: 0 | 1 | 2 | 3;
    continuousDropOff?: 0 | 1 | 2 | 3;
    shapeDistTraveled?: number;
    // Indicates if arrival and departure times for a stop are strictly adhered to by the vehicle or if they are instead approximate and/or interpolated times. 
    // 0 - Times are considered approximate. 
    // 1 - Times are considered exact.
    timepoint?: 0 | 1;
}
  
export interface GTFSData {
    agencies: Agency[];
    calendars: Calendar[];
    calendarDates: CalendarDate[];
    routes: Route[];
    stops: Stop[];
    trips: Trip[];
    stopTimes: StopTime[];
}


