import {Component} from "./Component";
import {WeatherService} from "../Weather.service";
import {City, RenderOptions, Weather} from "../Interfaces";
import {CardType} from "../utils";

export class BigCardComponent extends Component {
    service: WeatherService;
    props: {
        cityWeather: City
    }

    constructor(cityWeather: City, service: WeatherService) {
        super();

        this.service = service
        this.props = {
            cityWeather
        }
    }

    protected getTemplate(): string {
        const { city, weather, temperature, wind} = this.props.cityWeather;

        const infoConditionTemplate: string = Object
            .keys(weather).map((key: keyof Weather) => {
                if(weather[key]) {
                    return `<span class="icon icon-${key}"></span>`
                }
            }).join('');

        return (`
        <div class="big-card _card" draggable="true" data-type="${CardType.big}" data-name="${city}">
            <div class="event-catcher-big-card"></div>
            <div class="card-header">
                <span class="icon-strips-big"></span>
                <span class="title-card">${city}</span>
            </div>
            <div class="card-content">
                <div class="card-info-wrapper">
                    <div class="card-info-condition">
                        ${infoConditionTemplate}
                    </div>
                    <div class="card-info-wind">
                        <span class="icon icon-wind"></span>
                        <span>Ветер ${wind.direction}, ${wind.speed} м/с</span>
                    </div>
                </div>
                <div class="card-info-temperature">
                    <span>${temperature}°</span>
                </div>
            </div>
        </div>
        `);
    }

    protected afterCreateElement() {
        this.service.makeCardDraggable(this.getElement(), this.props.cityWeather);

        this.getElement().addEventListener('click', (event: Event) => this.clickHandler(event));
        this.getElement().addEventListener('mouseenter', (event: Event) => this.mouseEnterHandler(event));
        this.getElement().addEventListener('mouseleave', (event: Event) => this.mouseLeaveHandler(event));
    }

    private clickHandler(event: Event): void {
        const target: HTMLElement = (event.target as HTMLElement).closest('.big-card');
        target
            .parentElement
            .querySelectorAll('.active')
            .forEach((el: HTMLElement) => el.classList.remove('active'));


        target.classList.add('active');

        this.service.mouseClickCard(this.props.cityWeather.city);
    }

    protected getRenderOptions(): RenderOptions[] {
        return [];
    }

    private mouseEnterHandler(event: Event) {
        this.service.mouseOverCard(this.props.cityWeather.city);
    }

    private mouseLeaveHandler(event: Event) {
        this.service.mouseOutCard(this.props.cityWeather.city);
    }
}