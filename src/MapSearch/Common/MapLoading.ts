import {isSomething} from "../../utils";

export interface IMapLoadingSettings {
    className?: string,
    visible: boolean;
}

export default class MapLoading {
    private readonly HTMLElement: HTMLDivElement;

    constructor(settings: IMapLoadingSettings){
        if(isSomething(settings) === false)
            throw new Error(`Invalid value for settings: ${settings}; MapButton.ts`);

        this.HTMLElement = this.createElement(settings);
    }

    private readonly createElement = (settings: IMapLoadingSettings): HTMLDivElement => {
        const divElement = document.createElement("div");
        divElement.className = settings.className || "";
        divElement.classList.add("loading-bar");
        if(settings.visible === false)
            divElement.style.display = "none";

        return divElement;
    };

    readonly show = () => this.HTMLElement.style.display = "initial";

    readonly hide = () => this.HTMLElement.style.display = "none";

    get HTMLNode(): HTMLElement {
        return this.HTMLElement;
    }
}