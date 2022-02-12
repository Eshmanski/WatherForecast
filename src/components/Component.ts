import {createElement, InsertPosition, renderElement} from "../utils";
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

    protected afterCreateElement(): void {}

    protected abstract getRenderOptions(): RenderOptions[];

    protected setState(state: Object): void {
        this.state = {...this.state, ...state};
        this.renderChildren();
    }

    protected renderChildren(): void {
        const rendersOptions: RenderOptions[] = this.getRenderOptions();
        this.children.forEach((child: Component) => child.destroy());

        rendersOptions.forEach((renderOptions: RenderOptions) => {
            const { child, insertPosition} = renderOptions;

            this.children.push(child);
            renderElement(this.element, child.getElement(), insertPosition);
        });
    }

    protected destroy(): void {
        this.element.remove();
    }
}
