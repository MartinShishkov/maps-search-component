import createHTMLMapMarker from "./HTMLMarker";
import Map from "./Map";
import {isSomething} from "../../utils";
import { ICoordinate } from './ICoordinate';

export interface ICustomMarkerSettings<T extends {location: ICoordinate}> {
    map: Map,
    data: T,
    onClick: (marker: google.maps.OverlayView) => void,
    renderer: (data: T) => string,
}

export default class CustomMarker<T extends {location: ICoordinate}> {
    static readonly DATA_KEY = "CUSTOM_DATA_KEY";
    private readonly htmlMarker: any; // fix this to be of type HTMLMarker
    
    constructor(settings: ICustomMarkerSettings<T>){
        const location = settings.data.location;
        if(isSomething(location) === false)
            throw new Error("Invalid value for location");
        
        if(!isSomething(location.lat) || !isSomething(location.lng))
            throw new Error(`Invalid value for lat or lng: ${location}`);
        
        this.htmlMarker = createHTMLMapMarker(
            settings.map, 
            {
                lat: settings.data.location.lat,
                lng: settings.data.location.lng
            },
            settings.renderer(settings.data), 
            settings.onClick
        );

        this.htmlMarker.set(CustomMarker.DATA_KEY, settings.data);
    }
    
    readonly attachToMap = (map: Map) => {
        this.htmlMarker.attachToMap(map);  
    };
    
    readonly getPosition = (): google.maps.LatLng => {
        return this.htmlMarker.getPosition();
    };
    
    readonly getMap = (): google.maps.Map => {
        return this.htmlMarker.getMap();
    };
    
    readonly setMap = (map: google.maps.Map) => {
        this.htmlMarker.setMap(map);
    };
}