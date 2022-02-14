import {Component} from "./components/Component";
import {City} from "./Interfaces";

export enum cardType {
    small = 'small',
    big = 'big',
    none = '',
}


export enum InsertPosition {
    BEFOREEND = 'beforeend',
    AFTEREND = 'afterend',
    BEFOREBEGIN = 'beforebegin',
    AFTERBEGIN = 'BEFOREEND'
};

export enum SortType {
    ABC = `ABC`,
    ZYX = `ZYX`,
    NONE = 'NONE',
};

export enum WeatherAction {
    SORT_CHANGES = `sort-changes`,
    SORT_UNSET = 'sort-unset',
    SEARCH_CHANGES = `search-changes`,
    FILTER_CHANGES = `filter-changes`,
    CARD_UPDATE_POSITION = `card-update-position`,
}

export const SortTypeMethods = {
    ABC: (a: City, b: City) => a.city.localeCompare(b.city),
    ZYX: (a: City, b: City) => -a.city.localeCompare(b.city),
    NONE: (a: City, b: City) => 0,
};

export function createElement(template: string): Element {
    const element: Element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
}

export function renderElement(
    container: Element,
    element: Element,
    insertPosition: InsertPosition = InsertPosition.AFTEREND
): void {

    switch(insertPosition) {
        case InsertPosition.BEFOREEND:
            container.append(element);
            break;
        case InsertPosition.AFTERBEGIN:
            container.prepend(element);
            break;
        default:
            container.insertAdjacentElement(insertPosition, element);
            break;
    }
}