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
    monday: number;
    // Functions in the same way as monday except applies to Tuesdays
    tuesday: number;
    // Functions in the same way as monday except applies to Wednesdays
    wednesday: number;
    // Functions in the same way as monday except applies to Thursdays
    thursday: number;
    // Functions in the same way as monday except applies to Fridays
    friday: number;
    // Functions in the same way as monday except applies to Saturdays.
    saturday: number;
    // Functions in the same way as monday except applies to Sundays.
    sunday: number;
    startDate: Date;
    endDate: Date;
}

export interface CalendarDate {
    serviceId: string;
    date: Date;
    // Indicates whether service is available on the date specified in the date field. 
    // 1 - Service has been added for the specified date.
    // 2 - Service has been removed for the specified date.
    exceptionType: number;
}

export interface Route {
    routeId: string;
    agencyId?: string;
    routeShortName?: string;
    routeLongName?: string;
    routeDesc?: string;
    // Indicates the type of transportation used on a route.
    // See valid options: https://gtfs.org/documentation/schedule/reference/#routestxt
    routeType: number;
    routeUrl?: URL;
    routeColor?: string;
    routeTextColor?: string;
    routeSortOrder?: number;
    // Indicates that the rider can board the transit vehicle at any point along the vehicle’s travel path.
    // See valid options: https://gtfs.org/documentation/schedule/reference/#routestxt
    continuousPickup?: number;
    // Indicates that the rider can alight from the transit vehicle at any point along the vehicle’s travel path.
    // See valid options: https://gtfs.org/documentation/schedule/reference/#routestxt
    continuousDropOff?: number;
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
    stopUrl?: URL;
    // See valid options: https://gtfs.org/documentation/schedule/reference/#stopstxt
    locationType?: number;
    parentStation?: string;
    stopTimezone?: string;
    // See valid options: https://gtfs.org/documentation/schedule/reference/#stopstxt
    wheelchairBoarding?: number;
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
    directionId?: number;
    blockId?: string;
    shapeId?: string;
    // See valid options: https://gtfs.org/documentation/schedule/reference/#tripstxt
    wheelchairAccessible?: number;
    // See valid options: https://gtfs.org/documentation/schedule/reference/#tripstxt
    bikesAllowed?: number;
}

export interface StopTime {
    tripId: string;
    arrivalTime?: Date;
    departureTime?: Date;
    stopId: string;
    locationGroupId?: string;
    locationId?: string;
    stopSequence: number;
    stopHeadsign?: string;
    startPickupDropOffWindow?: string;
    endPickupDropOffWindow?: string;
    pickupType?: number;
    dropOffType?: number;
    continuousPickup?: number;
    continuousDropOff?: number;
    shapeDistTraveled?: number;
    // Indicates if arrival and departure times for a stop are strictly adhered to by the vehicle or if they are instead approximate and/or interpolated times. 
    // 0 - Times are considered approximate. 
    // 1 - Times are considered exact.
    timepoint?: number;
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


