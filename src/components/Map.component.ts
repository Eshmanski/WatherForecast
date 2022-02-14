import {Component} from "./Component";
import {WeatherService} from "../Weather.service";
import {City, Coordinates, RenderOptions} from "../Interfaces";
import {ChangePositionType, WeatherAction} from "../utils";

const L = require('leaflet/dist/leaflet');

type Marker = {
    isActive: boolean;
    city: string;
    markerObj: any;
}

export class MapComponent extends Component {
    myPosition: any[] = [];
    service: WeatherService;
    markers: Marker[] = [];
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
            this.myPosition = data.loc.split(',').map((coordinate: string) => +coordinate);

            this.map = L.map('map', { center: this.myPosition, zoom: 11 });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map);
        });
    }

    protected afterCreateElement(): void {
        window.addEventListener(WeatherAction.CARD_UPDATE_POSITION,
            (event: CustomEvent) => this.changeDataHandler(event));
        window.addEventListener(WeatherAction.MOUSE_OVER_CARD, (event: CustomEvent) => this.mouseOverCard(event));
        window.addEventListener(WeatherAction.MOUSE_OUT_CARD, (event: CustomEvent) => this.mouseOutCard(event));
        window.addEventListener(WeatherAction.MOUSE_CLICK_CARD, (event: CustomEvent) => this.mouseClickCard(event));
    }

    private changeDataHandler(event: CustomEvent): void {
        this.clearActiveMarkers();
        const changeType: ChangePositionType = event.detail.changePositionType;
        const cityWeather: City = event.detail.cityWeather;

        switch(changeType) {
            case ChangePositionType.SmallToBig:
                this.addMarker(cityWeather);
                break;
            case ChangePositionType.BigToSmall:
                this.removeMarker(cityWeather);
                break;
            default:
                return;
        }
    }

    private addMarker(cityWeather: City) {
        const { coordinates }: { coordinates: Coordinates } = cityWeather;
        const city = cityWeather.city;
        const markerObj = L.marker([ coordinates.latitude, coordinates.longitude], {opacity: 0.7})
            .addTo(this.map).bindPopup(city);

        markerObj.on('mouseover', () => {
            this.clearActiveMarkers();
            markerObj.setOpacity(1);
            this.service.onMarkerOver(city);
        })

        markerObj.on('mouseout', () => {
            this.clearActiveMarkers();
            markerObj.setOpacity(0.7);
            this.service.onMarkerOut(city);
        })

        const marker = {city, markerObj, isActive: false};
        this.markers.push(marker);
        this.focusMarker(marker)
    }

    private removeMarker(cityWeather: City) {
        const city = cityWeather.city;

        const idx = this.markers.findIndex((item: Marker) => item.city === city);
        if(idx === -1) return;

        this.markers[idx].markerObj.remove();
        this.markers = this.markers.filter((item: Marker) => item.city !== city);
    }

    private focusMarker(marker: Marker) {
        const {lat, lng} = marker.markerObj.getLatLng();
        this.map.setView([lat, lng], 12);
    }

    private focusCenter() {
        this.map.setView(this.myPosition, 11);
    }

    protected getRenderOptions(): RenderOptions[] {
        return [];
    }

    private mouseOverCard(event: CustomEvent) {
        const name = event.detail;
        const idx = this.markers.findIndex((item) => item.city === name);
        if(idx === -1) return;
        if(!this.markers[idx].isActive)
            this.markers[idx].markerObj.setOpacity(1);
    }

    private mouseOutCard(event: CustomEvent) {
        const name = event.detail;
        const idx = this.markers.findIndex((item) => item.city === name);
        if(idx === -1) return;

        if(!this.markers[idx].isActive)
            this.markers[idx].markerObj.setOpacity(0.7);
    }

    private mouseClickCard(event: CustomEvent) {
        const name = event.detail;
        const idx = this.markers.findIndex((item) => item.city === name);
        if(idx === -1) return;

        this.clearActiveMarkers();
        this.markers[idx].markerObj.setOpacity(1);
        this.markers[idx].isActive = true;
        this.focusMarker(this.markers[idx]);
    }

    private clearActiveMarkers() {
        this.markers.forEach(item => {
            item.isActive = false;
            item.markerObj.setOpacity(0.7);
        });
    }
}