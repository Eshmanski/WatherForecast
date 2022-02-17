import {Component} from "./Component";
import {HeaderComponent} from "./Header.component";
import {InsertPosition} from "../utils";
import {SmallCardListComponent} from "./SmallCardList.component";
import {BigCardListComponent} from "./BigCardList.component";
import {WeatherService} from "../Weather.service";
import {RenderOptions} from "../Interfaces";
import {createWrapper} from "./Wrapper.component";

export class PanelComponent extends Component {
    service: WeatherService;

    constructor(service: WeatherService) {
        super();
        this.service = service;
    }

    protected getTemplate(): string {
        return (`
            <div class="weather-panel"></div>
        `);
    }

    protected getRenderOptions(): RenderOptions[] {
        const headerComponent: HeaderComponent = new HeaderComponent(this.service);

        const smallCardListComponent: SmallCardListComponent = new SmallCardListComponent(this.service);
        const bigCardListComponent: BigCardListComponent = new BigCardListComponent(this.service);

        return [
            {child: headerComponent, insertPosition: InsertPosition.AFTERBEGIN},
            {child: createWrapper(
                '<div class="weather-panel-content _contentContainer"></div>',
                    [
                        {child: smallCardListComponent, insertPosition: InsertPosition.BEFOREEND},
                        {child: bigCardListComponent, insertPosition: InsertPosition.BEFOREEND}
                    ]), insertPosition: InsertPosition.BEFOREEND},
        ];
    }
}