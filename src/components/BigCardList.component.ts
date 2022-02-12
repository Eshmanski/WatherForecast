import {Component} from "./Component";
import {WeatherService} from "../Weather.service";
import {City, RenderOptions} from "../Interfaces";
import {InsertPosition} from "../utils";
import {BigCardComponent} from "./BigCard.component";

export class BigCardListComponent extends Component {
    service: WeatherService;
    state: {
        chosenCity: City[];
    }

    constructor(service: WeatherService) {
        super();

        this.service = service;
        this.state = {
            chosenCity: service.chosenCity
        }
    }

    protected getTemplate(): string {
        return (`<div class="big-card-list"></div>`);
    }

    protected getRenderOptions(): RenderOptions[] {
        const rendersOptions: RenderOptions[] = [];
        this.state.chosenCity.forEach((city) => {
            const bigCardComponent: BigCardComponent = new BigCardComponent(city, this.service);
            rendersOptions.push({child: bigCardComponent, insertPosition: InsertPosition.BEFOREEND});
        });

        return rendersOptions;
    }
}