import {City} from "./Interfaces";

export enum CardType {
    small = 'small',
    big = 'big',
    none = '',
}

export enum ChangePositionType {
    BigToSmall = 'big=>small',
    BigToBig = 'big=>big',
    SmallToBig = 'small=>big',
    SmallToSmall = 'small=>small'
}

export enum InsertPosition {
    BEFOREEND = 'beforeend',
    AFTEREND = 'afterend',
    BEFOREBEGIN = 'beforebegin',
    AFTERBEGIN = 'BEFOREEND',
}

export enum SortType {
    ABC = `ABC`,
    ZYX = `ZYX`,
    NONE = 'NONE',
}

export enum WeatherAction {
    SORT_CHANGES = `sort-changes`,
    SEARCH_CHANGES = `search-changes`,
    FILTER_CHANGES = `filter-changes`,
    CARD_UPDATE_POSITION = `card-update-position`,
    SORT_RESET = 'sort-reset',
    FILTER_WEATHER_RESET = 'filter-weather-reset',
    MOUSE_OVER_MARKER = 'mouse_over_marker',
    MOUSE_OUT_MARKER = 'mouse_out_marker',
    MOUSE_OVER_CARD = 'mouse_over_card',
    MOUSE_OUT_CARD = 'mouse_out_card',
    MOUSE_CLICK_CARD = 'mouse_click_card',
}

export const SortTypeMethods = {
    ABC: (a: City, b: City) => a.city.localeCompare(b.city),
    ZYX: (a: City, b: City) => -a.city.localeCompare(b.city),
    NONE: (a: City, b: City) => 0,
}

export function createElement(template: string): Element {
    const element: Element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
}