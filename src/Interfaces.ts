import {CardType, InsertPosition} from "./utils";
import { Component } from "./components/Component";

export interface City {
    city: string;
    coordinates: Coordinates;
    weather: Weather;
    temperature: string;
    wind: {
        direction: string;
        speed: string;
    };
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface Weather {
    sunny: boolean;
    cloudy: boolean;
    snowy: boolean;
    rainy: boolean;
    blizzard: boolean;
    stormy: boolean;
    metorite: boolean;
}

export interface ClientData {
    ip: string;
    city: string;
    region: string;
    country: string;
    loc: string;
    org: string;
    postal: string;
    timezone: string;
}

export interface RenderOptions {
    child: Component;
    insertPosition: InsertPosition;
}

export interface NavControllers {
    toggleSortUp: HTMLElement;
    toggleSortDown: HTMLElement;
    textFilter: HTMLElement;
    weatherFilter: NodeList;
}

export interface DragDropOptions {
    dragElement: HTMLElement;
    cardType: CardType;
}