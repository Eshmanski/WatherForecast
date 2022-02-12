import {PanelComponent} from "./components/Panel.component";
import {InsertPosition, renderElement} from "./utils";
import {MapComponent} from "./components/Map.component";
import {WeatherService} from "./Weather.service";

export class App {
    service: WeatherService;

    constructor(service: WeatherService) {
        this.service = service;
    }

    init(appElement: Element) {
        const panelComponent = new PanelComponent(this.service);
        const panelElement = panelComponent.getElement();
        renderElement(appElement, panelElement, InsertPosition.BEFOREEND);

        const mapComponent = new MapComponent(this.service);
        const mapElement = mapComponent.getElement();
        renderElement(appElement, mapElement, InsertPosition.BEFOREEND);

        mapComponent.init();
    }
}