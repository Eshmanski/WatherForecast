import {PanelComponent} from "./components/Panel.component";
import {InsertPosition} from "./utils";
import {MapComponent} from "./components/Map.component";
import {WeatherService} from "./Weather.service";
import {Component} from "./components/Component";

export class App {
    service: WeatherService;

    constructor(service: WeatherService) {
        this.service = service;
    }

    init(appElement: Element): void {
        const panelComponent: Component = new PanelComponent(this.service);
        Component.renderElement(appElement, panelComponent, InsertPosition.BEFOREEND);

        const mapComponent: Component = new MapComponent(this.service);
        Component.renderElement(appElement, mapComponent, InsertPosition.BEFOREEND);
    }
}