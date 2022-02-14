import {Component} from "./Component";
import {WeatherService} from "../Weather.service";
import {NavControllers, RenderOptions, Weather} from "../Interfaces";
import {SortType, WeatherAction} from "../utils";

export class HeaderComponent extends Component {
    service: WeatherService;
    controllers: NavControllers = null;

    constructor(service: WeatherService) {
        super();

        this.service = service;
    }

    protected getTemplate(): string {
        return (`
            <div class="weather-panel-form">
                <form>
                    <div class="btns-box">
                        <button class="btn active _toggle_up"><div class="btn-icon icon-arrow-down"></div></button>
                        <button class="btn _toggle_down"><div class="btn-icon icon-arrow-up"></div></button>
                    </div>
                    <div class="input-box">
                        <input type="text" class="input _input_sort" placeholder="Выберете город">
                    </div>
                    <div class="btns-box">
                        <button class="btn _btn_sort_weather" data-weather="sunny"><div class="btn-icon icon-sunny"></div></button>
                        <button class="btn _btn_sort_weather" data-weather="cloudy"><div class="btn-icon icon-cloudy"></div></button>
                        <button class="btn _btn_sort_weather" data-weather="rainy"><div class="btn-icon icon-rainy"></div></button>
                        <button class="btn _btn_sort_weather" data-weather="blizzard"><div class="btn-icon icon-blizzard"></div></button>
                        <button class="btn _btn_sort_weather" data-weather="snowy"><div class="btn-icon icon-snowy"></div></button>
                        <button class="btn _btn_sort_weather" data-weather="stormy"><div class="btn-icon icon-stormy"></div></button>
                        <button class="btn _btn_sort_weather" data-weather="metorite"><div class="btn-icon icon-metorite"></div></button>
                    </div>
                </form>
            </div>
        `);
    }

    protected afterCreateElement() {
        this.controllers = {
            toggleSortUp: this.getElement().querySelector('._toggle_up'),
            toggleSortDown: this.getElement().querySelector('._toggle_down'),
            textFilter: this.getElement().querySelector('._input_sort'),
            weatherFilter: this.getElement().querySelectorAll('._btn_sort_weather')
        };

        this.controllers.toggleSortDown.onclick = (event: MouseEvent) => this.toggleSort(SortType.ZYX, event);
        this.controllers.toggleSortUp.onclick = (event: MouseEvent) => this.toggleSort(SortType.ABC, event);
        this.controllers.textFilter.oninput = (event: InputEvent) => this.filterByText(event);
        this.controllers.weatherFilter.forEach(
            (btn: HTMLElement): void => {
                btn.onclick = (event: MouseEvent) => this.filterByWeather(event);
            }
        );

        window.addEventListener(WeatherAction.SORT_RESET, () => this.resetSortHandler());
        window.addEventListener(WeatherAction.FILTER_WEATHER_RESET, () => this.resetFilterWeatherHandler());
    }

    toggleSort(sortType: SortType, event: MouseEvent) {
        event.preventDefault();
        switch(sortType) {
            case SortType.ABC:
                this.controllers.toggleSortDown.classList.remove('active');
                this.controllers.toggleSortUp.classList.add('active');
                this.service.setSortType(SortType.ABC);
                break;
            case SortType.ZYX:
                this.controllers.toggleSortUp.classList.remove('active');
                this.controllers.toggleSortDown.classList.add('active');
                this.service.setSortType(SortType.ZYX);
                break;
        }
    }

    protected getRenderOptions(): RenderOptions[] {
        return [];
    }

    private filterByText(event: InputEvent) {
        const inputText: string = (event.target as HTMLTextAreaElement).value;
        if(inputText.trim()) {
            this.service.setFilterText(inputText);
        } else this.service.setFilterText('');
    }

    private filterByWeather(event: MouseEvent) {
        event.preventDefault();

        const btn: HTMLElement = event.target as HTMLButtonElement;

        btn.classList.toggle('active');

        this.service.toggleFilterWeather(btn.dataset.weather as keyof Weather);
    }

    private resetSortHandler() {
        this.controllers.toggleSortDown.classList.remove('active');
        this.controllers.toggleSortUp.classList.remove('active');
    }

    private resetFilterWeatherHandler() {
        this.controllers.weatherFilter.forEach((el:HTMLElement) => el.classList.remove('active'));
    }
}