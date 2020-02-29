import {isNull} from "../../utils";
import {ICoordinate} from "./ICoordinate";
import Map from "./Map";

export interface ICircleSettings {
    center: ICoordinate,
    radius: number;
}

export interface IEventHandlers {
    onRadiusChanged: (circle: Circle) => void,
    onCenterChanged: (circle: Circle) => void,
    onDragStart: (circle: Circle) => void,
    onDragEnd: (circle: Circle) => void
}

export default class Circle {
    private readonly circleInternal: google.maps.Circle;
    private readonly COLOR_FILL_DEFAULT = "rgba(255,255,255)";
    private readonly COLOR_STROKE_DEFAULT = "#545454";
    
    constructor(settings: ICircleSettings, handlers: IEventHandlers){
        if(isNull(settings))
            throw new Error("Settings cannot be null; Circle.ts");

        this.circleInternal = new google.maps.Circle({
            fillColor: this.COLOR_FILL_DEFAULT,
            strokeColor: this.COLOR_STROKE_DEFAULT,
            fillOpacity: 0.3,
            center: settings.center,
            radius: settings.radius,
            editable: true,
            draggable: true,
            strokeWeight: 1
        });
                
        this.attachEventListener("radius_changed", () => handlers.onRadiusChanged(this));
        this.attachEventListener("center_changed", () => handlers.onCenterChanged(this));
        this.attachEventListener("dragstart", () => handlers.onDragStart(this));
        this.attachEventListener("dragend", () => handlers.onDragEnd(this));
    }
    
    private readonly attachEventListener = (event: string, handler: Function) => {
        google.maps.event.addListener(
            this.circleInternal,
            event,
            handler
        );  
    };
    
    readonly attachToMap = (map: Map) => {
        this.circleInternal.setMap(map.gmap);
    };
    
    readonly getRadius = (): number => this.circleInternal.getRadius();
    readonly getDiameter = (): number => this.getRadius() * 2;
    
    readonly setRadius = (radius: number) => {
        if(this.circleInternal.getEditable() === false)
            return;
        
        this.circleInternal.setRadius(radius);
    };
    readonly setDraggable = (draggable: boolean) => this.circleInternal.setDraggable(draggable);
    readonly setEditable = (editable: boolean) => this.circleInternal.setEditable(editable);

    readonly disable = () => {
        this.setDraggable(false);
        this.setEditable(false);
    };
    
    readonly enable = () => {
        this.setDraggable(true);
        this.setEditable(true);
    };
    
    readonly getCenter = (): ICoordinate => {
        const center = this.circleInternal.getCenter();
        return {
            lat: center.lat(), lng: center.lng()
        };
    };
}
    
    
