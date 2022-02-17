import {Component} from "./Component";
import {SmallCardComponent} from "./SmallCard.component";
import {WeatherService} from "../Weather.service";
import {City, RenderOptions} from "../Interfaces";
import {CardType, InsertPosition, WeatherAction} from "../utils";

export class SmallCardListComponent extends Component {
    service: WeatherService;
    state: {
        allCities: City[]
    };

    constructor(service: WeatherService) {
        super();

        this.service = service;
        this.state = { allCities: service.allCities }
    }

    protected getTemplate(): string {
        return (`<div class="small-card-list _list" data-type="${CardType.small}"></div>`);
    }

    protected getRenderOptions(): RenderOptions[] {
        const rendersOptions: RenderOptions[] = [];
        this.state.allCities.forEach((city) => {
            const smallCardComponent: Component = new SmallCardComponent(city, this.service);
            rendersOptions.push({child: smallCardComponent, insertPosition: InsertPosition.BEFOREEND});
        });

        return rendersOptions;
    }

    protected afterCreateElement(): void {
        this.service.fetchAllCity().then(allCities => {
            this.setState( { allCities } );
        });

        this.addEventListeners();
        this.service.makeListDroppable(this.getElement());
    }

    private addEventListeners(): void {
        window.addEventListener(WeatherAction.SORT_CHANGES, () => this.dataChangeHandler());
        window.addEventListener(WeatherAction.SEARCH_CHANGES, () => this.dataChangeHandler());
        window.addEventListener(WeatherAction.CARD_UPDATE_POSITION, () => this.dataChangeHandler());
    }

    private dataChangeHandler(): void {
        const citiesList: City[] = this.service.getCityForSmallList();
        this.setState({ allCities: citiesList });
        this.getElement().scroll(0, 0);
    }
}