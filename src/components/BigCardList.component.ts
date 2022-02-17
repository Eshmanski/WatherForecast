import {Component} from "./Component";
import {WeatherService} from "../Weather.service";
import {City, RenderOptions} from "../Interfaces";
import {CardType, InsertPosition, WeatherAction} from "../utils";
import {BigCardComponent} from "./BigCard.component";

export class BigCardListComponent extends Component {
    service: WeatherService;
    helperText: HTMLElement;
    state: {
        chosenCities: City[];
    };

    constructor(service: WeatherService) {
        super();

        this.service = service;
        this.state = { chosenCities: [] };
    }

    protected getTemplate(): string {
        return (`
            <div class="big-card-list _list" data-type="${CardType.big}">
                <div class="help-big-card-list _helperText"><span>Перетащите сюда города, погода в которых вам интересна</span></div>
            </div>
        `);
    }

    protected getRenderOptions(): RenderOptions[] {
        const rendersOptions: RenderOptions[] = [];
        if(this.state) {

            this.state.chosenCities.forEach((city) => {
                const bigCardComponent: Component = new BigCardComponent(city, this.service);
                rendersOptions.push({child: bigCardComponent, insertPosition: InsertPosition.BEFOREEND});
            });
        }
        return rendersOptions;
    }

    protected afterCreateElement(): void {
        this.helperText = this.getElement().querySelector('._helperText')
        window.addEventListener(WeatherAction.FILTER_CHANGES, () => this.dataChangeHandler());
        window.addEventListener(WeatherAction.CARD_UPDATE_POSITION, () => this.dataChangeHandler());
        window.addEventListener(WeatherAction.MOUSE_OVER_MARKER, (event: CustomEvent) => this.activeCardHandler(event));
        window.addEventListener(WeatherAction.MOUSE_OUT_MARKER, (event: CustomEvent) => this.disableCardHandler(event));
        this.service.makeListDroppable(this.getElement());
    }

    private dataChangeHandler(): void {
        const data = this.service.getCityForBigList();

        if(data.length !== 0) this.helperText.style.visibility = 'hidden';
        else this.helperText.style.visibility = 'visible';

        this.setState({ chosenCities: data });
        this.getElement().scroll(0, 0);
    }

    private activeCardHandler(event: CustomEvent): void {
        const name = event.detail;
        this.getElement().querySelector(`[data-name="${name}"]`)
            .classList.add('active');
    }

    private disableCardHandler(event: CustomEvent): void {
        const name = event.detail;
        this.getElement().querySelector(`[data-name="${name}"]`)
            .classList.remove('active');
    }
}