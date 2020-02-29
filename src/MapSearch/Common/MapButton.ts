import {isSomething} from "../../utils";

export interface IMapButtonSettings {
    innerHTML: string,
    className?: string
}

export interface IEventHandlers {
    onClick: () => void,
}

export default class MapButton {
    private readonly HTMLElement: HTMLButtonElement;
    
    constructor(settings: IMapButtonSettings, handlers: IEventHandlers){
        if(isSomething(settings) === false)
            throw new Error(`Invalid value for settings: ${settings}; MapButton.ts`);

        this.HTMLElement = this.createButton(settings);
        this.HTMLElement.addEventListener("click", handlers.onClick);
    }

    private readonly createButton = (settings: IMapButtonSettings): HTMLButtonElement => {
        const button = document.createElement("button");
        button.innerHTML = settings.innerHTML;
        button.className = settings.className || "";
        button.setAttribute("type", "button");
        button.classList.add("btn");
        button.classList.add("btn-default");
        button.style.textAlign = "center";
        button.style.backgroundColor = "rgb(253, 246, 246)";
        button.style.borderWidth = "2px";
        button.style.boxShadow = "rgba(47, 47, 47, 0.55) 0px 1px 6px";
        button.style.color = "#2b2b2b";
        button.style.transition = ".15s all";
        button.onmouseover = () => {
            button.style.backgroundColor = "rgb(236, 236, 236)";
        };
        button.onmouseleave = () => {
            button.style.backgroundColor = "rgb(253, 246, 246)";
        };

        return button;
    };
    
    readonly show = () => this.HTMLElement.style.display = "initial";

    readonly hide = () => this.HTMLElement.style.display = "none";
    
    readonly disable = () => {
        this.HTMLElement.style.backgroundColor = "#ffffff";
        this.HTMLElement.disabled = true;
    };

    readonly enable = () => {
        this.HTMLElement.disabled = false;
    };
    
    get HTMLNode(): HTMLElement {
        return this.HTMLElement;
    }
}