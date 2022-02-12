import {Component} from "./Component";
import {WeatherService} from "../Weather.service";
import {RenderOptions} from "../Interfaces";
const L = require('leaflet/dist/leaflet');

export class MapComponent extends Component {
    service: WeatherService;

    constructor(service: WeatherService) {
        super();

        this.service = service;
    }

    protected getTemplate(): string {
        return (`<div id="map" class="my-map"></div>`);
    }

    protected afterCreateElement(): void {
    }

    public init() {
        this.service.getMyPosition().then(data => {
            const myPosition = data.loc.split(',').map((coordinate: string) => +coordinate);

            let map = L.map('map').setView(myPosition, 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
        });
    }

    protected getRenderOptions(): RenderOptions[] {
        return [];
    }
}