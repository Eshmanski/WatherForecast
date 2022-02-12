export enum InsertPosition {
    BEFOREEND = 'beforeend',
    AFTEREND = 'afterend',
    BEFOREBEGIN = 'beforebegin',
    AFTERBEGIN = 'BEFOREEND'
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