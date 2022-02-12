import {Component} from "./Component";
import {City, RenderOptions} from "../Interfaces";

export class SmallCardComponent extends Component {
    city: City;

    constructor(city: City) {
        super();

        this.city = city;
    }

    protected getTemplate(): string {
        return (`
            <div class="small-card" draggable="true">
                <span class="title-card">${this.city.city}</span>
                <span>${this.city.temperature}°</span>
                <span class="icon-strips-small"></span>
            </div>
        `);
    }

    protected afterCreateElement(): void {
    }

    protected getRenderOptions(): RenderOptions[] {
        return [];
    }

}
