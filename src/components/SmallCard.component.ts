import {Component} from "./Component";
import {City, RenderOptions} from "../Interfaces";
import {WeatherService} from "../Weather.service";

export class SmallCardComponent extends Component {
    cityWeather: City;
    service: WeatherService;

    constructor(city: City, service: WeatherService) {
        super();

        this.cityWeather = city;
        this.service = service;
    }

    protected getTemplate(): string {
        return (`
            <div class="small-card _card" draggable="true" data-type="smallCard" data-name="${this.cityWeather.city}">
                <span class="title-card">${this.cityWeather.city}</span>
                <span>${this.cityWeather.temperature}°</span>
                <span class="icon-strips-small"></span>
            </div>
        `);
    }

    protected afterCreateElement(): void {
        this.service.makeCardDraggable(this.getElement(), this.cityWeather);
    }

    protected getRenderOptions(): RenderOptions[] {
        return [];
    }
}
