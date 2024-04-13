export interface Location {
    latitude: number;
    longitude: number;
}

export interface CurrentLocation {
    country: string;
    name: string;
}

export interface WeatherForecast {
    day: {
        date: string;
        condition: {
            icon: string;
            text: string;
        };
        maxtemp_c: number;
        mintemp_c: number;
        daily_will_it_rain: number;
    };
}