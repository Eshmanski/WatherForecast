import {createElement, InsertPosition} from "../utils";
import {RenderOptions} from "../Interfaces";

export abstract class Component {
    private children: Component[] = [];
    private element: Element;
    protected state: Object;

    protected constructor() {
        this.element = null;
        this.state = null;
    }

    protected abstract getTemplate(): string;

    public getElement(): Element {
        if(!this.element) {
            this.element = createElement(this.getTemplate());
            this.renderChildren();
            this.afterCreateElement();
        }

        return this.element;
    }

    protected getRenderOptions(): RenderOptions[]{
        return [];
    }

    protected renderChildren(): void {
        const rendersOptions: RenderOptions[] = this.getRenderOptions();
        this.children.forEach((child: Component) => child.destroy());

        rendersOptions.forEach((renderOptions: RenderOptions) => {
            const { child, insertPosition} = renderOptions;

            this.children.push(child);
            Component.renderElement(this.element, child, insertPosition);
        });
    }

    protected afterCreateElement(): void {}

    protected afterInsertInDOM(): void {}

    protected setState(state: Object): void {
        this.state = {...this.state, ...state};
        this.renderChildren();
    }

    protected destroy(): void {
        this.element.remove();
    }

    static renderElement(
        container: Element,
        component: Component,
        insertPosition: InsertPosition = InsertPosition.AFTEREND
    ): void {
        const element: Element = component.getElement();

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

        component.afterInsertInDOM();
    }
}
