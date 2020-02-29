import {ICoordinate} from "./ICoordinate";
import {isNull} from "../../utils";
import ControlPosition = google.maps.ControlPosition;

export interface IMapSettings {
    height: number;
    targetDOMElement: HTMLElement;
    center: ICoordinate;
    mapTypeControl?: boolean;
    zoomControl?: boolean;
}

export interface IEventHandlers {
    onZoomChanged: (map: Map) => void;
}

export default class Map {
    private readonly _height: number;
    private readonly mapInternal: google.maps.Map;
    private readonly MAX_ZOOM: number = 18;
    private readonly MIN_ZOOM: number = 5;
    static readonly ZOOM_SCALE  = {
        "20": 1128.497220, // zoom level - 1cm of the map in meters
        "19": 2256.994440,
        "18": 4513.988880,
        "17": 9027.977761,
        "16": 18055.955520,
        "15": 36111.911040,
        "14": 72223.822090,
        "13": 144447.644200,
        "12": 288895.288400,
        "11": 577790.576700,
        "10": 1155581.153000,
        "9": 2311162.307000,
        "8": 4622324.614000,
        "7": 9244649.227000,
        "6": 18489298.450000,
        "5": 36978596.910000,
        "4": 73957193.820000,
        "3": 147914387.600000,
        "2": 295828775.300000,
        "1": 591657550.500000
    };
    
    constructor(settings: IMapSettings, handlers: IEventHandlers) {
        if(isNull(settings))
            throw new Error("Settings cannot be null; Map.ts");

        const center = new google.maps.LatLng(
            settings.center.lat, settings.center.lng
        );
        
        this._height = settings.height;
        
        this.mapInternal = new google.maps.Map(settings.targetDOMElement, {
            center: center,
            zoom: 6,
            minZoom: this.MIN_ZOOM,
            maxZoom: this.MAX_ZOOM,
            mapTypeControl: settings.mapTypeControl && true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                position: google.maps.ControlPosition.TOP_RIGHT,
                mapTypeIds: ['roadmap', 'satellite']
            },
            gestureHandling: "greedy",
            streetViewControl: false,
            zoomControl: settings.zoomControl && true,
            clickableIcons: false
        });
        
        this.attachEventListener("zoom_changed", () => handlers.onZoomChanged(this));
    }

    private readonly attachEventListener = (event: string, handler: Function) => {
        google.maps.event.addListener(
            this.mapInternal,
            event,
            handler
        );
    };

    readonly calcMetersPerPixel = (): number => {
        const bounds = this.mapInternal.getBounds();
        if (typeof (bounds) === "undefined")
            return null;

        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        const a = new google.maps.LatLng(ne.lat(), ne.lng());
        const b = new google.maps.LatLng(sw.lat(), ne.lng());

        // calculate google maps "height" in meters
        const mapHeightInMeters = google.maps.geometry.spherical.computeDistanceBetween(a, b);
        return mapHeightInMeters / this.height;
    };
    
    readonly setScrollWheel = (value: boolean) => this.mapInternal.set("scrollwheel", value);
    readonly setZoom = (zoom: number) => this.mapInternal.setZoom(zoom);
    readonly panTo = (position: ICoordinate) => {
        const c = new google.maps.LatLng(position.lat, position.lng);
        this.mapInternal.panTo(c);  
    };
    
    get gmap(): google.maps.Map{
        return this.mapInternal;
    }
    
    get height(): number{
        return this._height;
    }
    
    get center(): ICoordinate{
        const center = this.mapInternal.getCenter();
        return {
            lng: center.lng(),
            lat: center.lat()
        };
    }
    
    get zoom(): number{
        return this.mapInternal.getZoom();
    }
    
    readonly addControlElement = (controlPosition: ControlPosition, element: HTMLElement): void => {
        this.mapInternal.controls[controlPosition].push(element);
    };

    readonly lockZoom = () => {
        this.mapInternal.set("maxZoom", this.zoom);
        this.mapInternal.set("minZoom", this.zoom);
    };
    
    readonly unlockZoom = () => {
        this.mapInternal.set("maxZoom", this.MAX_ZOOM);
        this.mapInternal.set("minZoom", this.MIN_ZOOM);
    };
}