import {Component} from "./Component";
import {WeatherService} from "../Weather.service";
import {City, RenderOptions} from "../Interfaces";

export class BigCardComponent extends Component {
    service: WeatherService;
    props: {
        city: City
    }

    constructor(city: City, service: WeatherService) {
        super();

        this.service = service
        this.props = {
            city
        }
    }

    protected getTemplate(): string {
        return (`
        <div class="big-card" draggable="true">
            <div class="card-header">
                <span class="icon-strips-big"></span>
                <span class="title-card">${this.props.city.city}</span>
            </div>
            <div class="card-content">
                <div class="card-info-wrapper">
                    <div class="card-info-condition">
                        <span class="icon icon-snowy"></span>
                        <span class="icon icon-blizzard"></span>
                        <span class="icon icon-stormy"></span>
                    </div>
                    <div class="card-info-wind">
                        <span class="icon icon-wind"></span>
                        <span>Ветер Ю, 15-19 м/с</span>
                    </div>
                </div>
                <div class="card-info-temperature">
                    <span>${this.props.city.temperature}</span>
                </div>
            </div>
        </div>
        `);
    }

    protected getRenderOptions(): RenderOptions[] {
        return [];
    }
}