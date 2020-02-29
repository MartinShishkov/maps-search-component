import {ICoordinate} from "./ICoordinate";
import Map from "./Map";
import {isSomething} from "../../utils";

export interface IInfoWindowSettings {
    position: ICoordinate,
    HTMLContent: string | Node;
}

export default class InfoWindow {
    private readonly infoWindowInternal: google.maps.InfoWindow;
    
    constructor(settings: IInfoWindowSettings){
        if(isSomething(settings) === false)
            throw new Error(`Invalid value for settings: ${settings}; InfoWindow.ts`);

        this.infoWindowInternal = new google.maps.InfoWindow({
            position: settings.position,
            zIndex: 1000
        });
        
        if(isSomething(settings.HTMLContent))
            this.setHTMLContent(settings.HTMLContent);
    }
    
    readonly close = () => {
        this.infoWindowInternal.close();
    };
    
    readonly open = (map: Map) => {
        this.infoWindowInternal.open(map.gmap);
    };

    readonly openAtAnchor = (anchor: google.maps.MVCObject) => {
        this.infoWindowInternal.open(null, anchor);
    };

    readonly setHTMLContent = (html: string | Node) => this.infoWindowInternal.setContent(html);
}