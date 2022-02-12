import { City } from './Interfaces';

export class WeatherService {
    allCity: City[];
    chosenCity: City[];


    constructor() {
        this.allCity = [
            { city: 'Москва', temperature: '-53'},
            { city: 'Санкт-Питербург', temperature: '-23'},
            { city: 'Омск', temperature: '-4'},
            { city: 'Краснодар', temperature: '-10'},
        ];

        this.chosenCity = [
            { city: 'Санкт-Питербург', temperature: '-23°'},
        ];
    }

    getMyPosition() {
        return fetch('https://ipinfo.io/json?token=be765effc66354').then(res => res.json());
    }

    getAllCity() {
        return fetch('https://geo-weather-json.herokuapp.com/db').then(res => res.json());
    }
}