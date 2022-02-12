import {Component} from "./Component";
import {WeatherService} from "../Weather.service";
import {RenderOptions} from "../Interfaces";

export class HeaderComponent extends Component {
    service: WeatherService;

    constructor(service: WeatherService) {
        super();

        this.service = service;
    }

    protected getTemplate(): string {
        return (`
            <div class="weather-panel-form">
                <form>
                    <div class="btns-box">
                        <button class="btn active"><div class="btn-icon icon-arrow-down"></div></button>
                        <button class="btn"><div class="btn-icon icon-arrow-up"></div></button>
                    </div>
                    <div class="input-box">
                        <input type="text" class="input" placeholder="Выберете город">
                    </div>
                    <div class="btns-box">
                        <button class="btn"><div class="btn-icon icon-snowy"></div></button>
                        <button class="btn"><div class="btn-icon icon-blizzard"></div></button>
                        <button class="btn"><div class="btn-icon icon-cloudy"></div></button>
                        <button class="btn"><div class="btn-icon icon-metorite"></div></button>
                        <button class="btn"><div class="btn-icon icon-rainy"></div></button>
                        <button class="btn"><div class="btn-icon icon-stormy"></div></button>
                        <button class="btn"><div class="btn-icon icon-sunny"></div></button>
                    </div>
                </form>
            </div>
        `);
    }


    protected getRenderOptions(): RenderOptions[] {
        return [];
    }
}