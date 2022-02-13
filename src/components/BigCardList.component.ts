import {Component} from "./Component";
import {WeatherService} from "../Weather.service";
import {City, RenderOptions} from "../Interfaces";
import {InsertPosition, WeatherAction} from "../utils";
import {BigCardComponent} from "./BigCard.component";

export class BigCardListComponent extends Component {
    service: WeatherService;
    state: {
        chosenCities: City[];
    };

    constructor(service: WeatherService) {
        super();

        this.service = service;
        this.state = { chosenCities: [] };
    }

    protected afterCreateElement() {
        window.addEventListener('FETCH_FINISHED', () => {
            const citiesWeather: City[] = this.service.getCityForBigList();
            this.setState({ chosenCities: citiesWeather });
        });

        window.addEventListener(WeatherAction.FILTER_CHANGES, () => this.dataChangeHandler());
        window.addEventListener(WeatherAction.CARD_UPDATE_POSITION, () => this.dataChangeHandler());

        this.service.makeListDroppable(this.getElement());
    }

    protected getTemplate(): string {
        return (`
            <div class="big-card-list _list" data-type="bigList">
                <div class="help-big-card-list"><span>Перетащите сюда города, погода в которых вам интересна</span></div>
            </div>
        `);
    }

    protected getRenderOptions(): RenderOptions[] {
        const rendersOptions: RenderOptions[] = [];
        if(this.state) {

            this.state.chosenCities.forEach((city) => {
                const bigCardComponent: BigCardComponent = new BigCardComponent(city, this.service);
                rendersOptions.push({child: bigCardComponent, insertPosition: InsertPosition.BEFOREEND});
            });
        }
        return rendersOptions;
    }

    private dataChangeHandler() {
        const data = this.service.getCityForBigList();
        this.setState({ chosenCities: data });
        this.getElement().scroll(0, 0);
    }
}