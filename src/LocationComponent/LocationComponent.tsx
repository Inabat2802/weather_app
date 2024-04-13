import React, {useState, useEffect, useCallback} from 'react';
import styles from './styles.module.css';
import dayjs from 'dayjs';
import {CurrentLocation, Location, WeatherForecast} from "./types";


const LocationComponent: React.FC = () => {
    const [location, setLocation] = useState<Location | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [weatherForecast, setWeatherForecast] = useState<WeatherForecast[]>([]);
    const [currentLocation, setCurrentLocation] = useState<CurrentLocation | null>(null);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    if (position?.coords) {
                        const {latitude, longitude} = position?.coords;
                        setLocation({latitude, longitude});
                    }
                },
                (error) => {
                    setError(error.message);
                }
            );
        } else {
            setError("Geolocation не поддерживается в вашем браузере");
        }
    }, []);
    const mapUrl = `https://maps.google.com/?q=${location?.latitude},${location?.longitude}`;
    const apiUrl = `http://api.weatherapi.com/v1/forecast.json`;

    const getWeather = useCallback((key: string, q: string, days:number) => {
        fetch(`${apiUrl}?key=${key}&q=${q}&days=${days}&lang=ru`)
            .then(response => response.json())
            .then(data => {
                setWeatherForecast(data.forecast.forecastday);
                setCurrentLocation(data.location);
            })
            .catch(error => {
                console.error('Ошибка при запросе к API:', error);
            });
    }, [apiUrl]);

    useEffect(() => {
        if (location) {
            getWeather('f5841e62f5224f15a6095817240604', `${location.latitude},${location.longitude}`, 6
            );
        }
    }, [getWeather, location])

    const getWeatherImage = (day: WeatherForecast) => {
        switch (true) {
            case day.day.daily_will_it_rain > 0:
                return "/img/wearingExamples/cool_rain.png";
            case day.day.daily_will_it_rain === 0 && day.day.condition.text === "Солнечно":
                return "/img/wearingExamples/cool_sunny.png";
            case day.day.maxtemp_c > 0 && day.day.daily_will_it_rain === 0:
                return "/img/wearingExamples/warm.png";
            default:
                return "/img/wearingExamples/cool.png";
        }
    };

    return (
        <div className={styles.container}>
            <h1>Прогноз погоды</h1>
            {location ? (
                <>
                    <p><b>Страна:</b> {currentLocation?.country} <b>Город:</b> {currentLocation?.name}</p>
                    <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                        Смотреть на карте
                    </a>
                </>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <p>Получение местоположения...</p>
            )
            }
            <div className={styles.forecast}>
                {weatherForecast.map((item, index) => (
                    <>
                        <div key={index} className={styles.days}>
                            <span>{dayjs(item.day.date).format('MMMM DD')}</span>
                            <p>
                                <img src={item.day.condition.icon} alt=""/>
                            </p>
                            <p><img src={getWeatherImage(item)} alt=""/></p>
                            <p className={styles.text}>{item.day.condition.text}</p>
                            <span>{item.day.maxtemp_c}</span> <span className={styles.celciusRound}>C</span>
                            <div className={styles.minTemp}>
                                <span>{item.day.mintemp_c}</span> <span className={styles.celciusRound}>C</span>
                            </div>

                        </div>
                    </>
                ))}
            </div>
        </div>
    );
};

export default LocationComponent;