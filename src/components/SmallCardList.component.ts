import {Component} from "./Component";
import {SmallCardComponent} from "./SmallCard.component";
import {WeatherService} from "../Weather.service";
import {City, RenderOptions} from "../Interfaces";
import {InsertPosition, WeatherAction} from "../utils";

export class SmallCardListComponent extends Component {
    service: WeatherService;
    state: {
        allCities: City[]
    };

    constructor(service: WeatherService) {
        super();

        this.service = service;
        this.state = { allCities: service.allCities };
    }

    protected getTemplate(): string {
        return (`<div class="small-card-list _list" data-type="smallList"></div>`);
    }

    protected afterCreateElement() {
        this.service.fetchAllCity().then(allCities => {
            this.setState( { allCities } );
        });

        this.addEventListeners();
    }


    private addEventListeners() {
        window.addEventListener(WeatherAction.SORT_CHANGES, (event) => this.dataChangeHandler(event));
        window.addEventListener(WeatherAction.SEARCH_CHANGES, (event) => this.dataChangeHandler(event));
        window.addEventListener(WeatherAction.CARD_UPDATE_POSITION, (event) => this.dataChangeHandler(event));
    }

    private dataChangeHandler(event: Event) {
        const citiesList: City[] = this.service.getCityForSmallList();
        this.setState({ allCities: citiesList });
        this.getElement().scroll(0, 0);
    }


    protected getRenderOptions(): RenderOptions[] {
        const rendersOptions: RenderOptions[] = [];
        this.state.allCities.forEach((city) => {
            const smallCardComponent: SmallCardComponent = new SmallCardComponent(city, this.service);
            rendersOptions.push({child: smallCardComponent, insertPosition: InsertPosition.BEFOREEND});
        });

        return rendersOptions;
    }
}