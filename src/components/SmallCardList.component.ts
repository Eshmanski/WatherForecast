import {Component} from "./Component";
import {SmallCardComponent} from "./SmallCard.component";
import {WeatherService} from "../Weather.service";
import {City, RenderOptions} from "../Interfaces";
import {InsertPosition} from "../utils";

export class SmallCardListComponent extends Component {
    service: WeatherService;
    state: {
        allCity: City[]
    };

    constructor(service: WeatherService) {
        super();

        this.service = service;
        this.state = { allCity: service.allCity };
    }

    protected getTemplate(): string {
        return (`<div class="small-card-list"></div>`);
    }

    protected afterCreateElement() {
        this.service.getAllCity().then((data: { cities: City[] })=> {
            console.log(data);
            this.setState({allCity: data.cities});

        });
    }


    protected getRenderOptions(): RenderOptions[] {
        console.log(this.state)
        const rendersOptions: RenderOptions[] = [];
        this.state.allCity.forEach((city) => {
            const smallCardComponent: SmallCardComponent = new SmallCardComponent(city);
            rendersOptions.push({child: smallCardComponent, insertPosition: InsertPosition.BEFOREEND});
        });

        return rendersOptions;
    }
}