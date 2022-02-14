import {Component} from "./Component";
import {WeatherService} from "../Weather.service";
import {RenderOptions} from "../Interfaces";
import {WeatherAction} from "../utils";
const L = require('leaflet/dist/leaflet');

export class MapComponent extends Component {
    service: WeatherService;
    map: any = null;

    constructor(service: WeatherService) {
        super();

        this.service = service;
    }

    protected getTemplate(): string {
        return (`<div id="map" class="my-map"></div>`);
    }

    public init() {
        this.service.fetchMyPosition().then(data => {
            const myPosition = data.loc.split(',').map((coordinate: string) => +coordinate);

            this.map = L.map('map').setView(myPosition, 12);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map);
        });
    }

    protected afterCreateElement(): void {
        window.addEventListener(WeatherAction.CARD_UPDATE_POSITION, (event: CustomEvent) => {
            if(event.detail) {
                const coords = Object.keys(event.detail.coordinates).map(key => event.detail.coordinates[key]);
                console.log(coords);

                L.marker(coords).addTo(this.map);
                this.map.setView(coords);
            }
        })
    }



    protected getRenderOptions(): RenderOptions[] {
        return [];
    }
}