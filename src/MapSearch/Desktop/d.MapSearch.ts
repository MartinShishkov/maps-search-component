import {isNull} from "../../utils";
import Map, {IMapSettings} from "../Common/Map";
import Circle, {ICircleSettings} from "../Common/Circle";
import InfoWindow from "../Common/InfoWindow";
import MapButton from "../Common/MapButton";
import MapLoading from "../Common/MapLoading";
import CustomMarker from "../Common/CustomMarker";
import MarkerCluster from "../Common/MarkerCluster";
import { ICoordinate } from '../Common/ICoordinate';
import ISimpleData from '../../Custom/ISimpleData';
import IFetchActionArgs from '../Common/IFetchActionArgs';

export interface IMapSearchSettings<T extends {location: ICoordinate}> {
    map: IMapSettings;
    circle: ICircleSettings;
    data: T[];
    onButtonClick: (location: ICoordinate, radius: number) => void; 
    infoWindowRenderer: (data: T) => string;
    markerRenderer: (data: T) => string;
    fetchAction: (args: IFetchActionArgs) => void;
}

export default class DesktopMapSearch<T extends {location: ICoordinate}> {
    private readonly settings: IMapSearchSettings<T>;
    private readonly map: Map;
    private readonly circle: Circle;
    private readonly infoWindow: InfoWindow;
    private readonly searchButton: MapButton;
    private readonly loading: MapLoading;
    private readonly MAX_RADIUS = 100000;
    private readonly MIN_RADIUS = 100;
    
    constructor(settings: IMapSearchSettings<T>){
        if(isNull(settings))
            throw new Error("Settings cannot be null; MapSearch.ts");
        const radius = settings.circle.radius < this.MIN_RADIUS ? 
            this.MIN_RADIUS : settings.circle.radius > this.MAX_RADIUS ? 
                this.MAX_RADIUS : settings.circle.radius;
        
        this.settings = settings;
        this.map = new Map(settings.map, {
            onZoomChanged: (map: Map) => {
                this.onZoomChangedHandler(map);
            }    
        });
        
        const zoom = this.getZoomLevelForRadius(radius);
        this.map.setZoom(zoom);
        
        this.circle = new Circle({
            radius: radius,
            center: settings.circle.center
        }, {
            onRadiusChanged: (circle: Circle) => {
                this.onRadiusChangedHandler1(circle);
                this.onRadiusChangedHandler2(circle);
                this.onRadiusChangedHandler3(circle);
            },
            onCenterChanged: (circle: Circle) => {},
            onDragStart: (circle: Circle) => {
                this.onDragStartHandler(circle);
            },
            onDragEnd: (circle: Circle) => {
                this.onDragEndHandler(circle);
            }
        });
        
        this.infoWindow = new InfoWindow({
            position: settings.map.center,
            HTMLContent: ""
        });
        
        this.searchButton = new MapButton({
            innerHTML: "Search in this area",
            className: "m-2"
        }, {
            onClick: () => {
                this.fetchFor(this.circle);
                this.settings.onButtonClick(
                    this.circle.getCenter(), this.circle.getRadius()
                );

            }
        });
        
        this.loading = new MapLoading({visible: false});
        
        const markers: CustomMarker<T>[] = settings.data.map((item) =>
            new CustomMarker({
                map: this.map,
                data: item,
                renderer: settings.markerRenderer,
                onClick: this.onMarkerClickHandler
            })
        );

        this.addMarkers(markers);
        this.map.addControlElement(google.maps.ControlPosition.TOP_LEFT, this.loading.HTMLNode);
        this.map.addControlElement(google.maps.ControlPosition.TOP_CENTER, this.searchButton.HTMLNode);
        this.circle.attachToMap(this.map);
        MarkerCluster.Create(this.map, markers);
    }
    
    private readonly onRadiusChangedHandler1 = (circle: Circle) => {
        const newRadius = Math.floor(circle.getRadius());
        if(newRadius > this.MAX_RADIUS)
            circle.setRadius(this.MAX_RADIUS); // will fire onRadiusChanged again

        if(newRadius < this.MIN_RADIUS)
            circle.setRadius(this.MIN_RADIUS); // will fire onRadiusChanged again
    };
    
    private readonly onRadiusChangedHandler2 = (circle: Circle) => {
        const diameterInPixels = this.convertMetersToPixels(circle.getDiameter());
                
        if (diameterInPixels > this.map.height)
            circle.setDraggable(false);
        else
            circle.setDraggable(true);  
    };

    private readonly onRadiusChangedHandler3 = (circle: Circle) => {
        this.searchButton.enable();
    };
    
    private readonly onDragStartHandler = (circle: Circle) => {
        this.searchButton.disable();
    };
    
    private readonly onDragEndHandler = (circle: Circle) => {
        this.searchButton.enable();  
    };
    
    private readonly onZoomChangedHandler = (map: Map) => {
        const metersPerPixel = map.calcMetersPerPixel();
        if (isNaN(metersPerPixel) || metersPerPixel === null)
            return;

        const diameterInPixels = this.convertMetersToPixels(this.circle.getDiameter());
        const minCircleDiameterInPixes = 60;

        this.circle.setDraggable(true);
        map.setScrollWheel(true);
        
        if (diameterInPixels > this.map.height) {
            this.circle.setDraggable(false);
        } else if (diameterInPixels < minCircleDiameterInPixes) {
            this.circle.setRadius(this.convertPixelsToMeters(minCircleDiameterInPixes / 2));
        }  
    };

    private readonly onMarkerClickHandler = (marker: google.maps.OverlayView) => {
        const data = marker.get(CustomMarker.DATA_KEY);
        const htmlContent = this.settings.infoWindowRenderer(data);
        this.infoWindow.setHTMLContent(htmlContent);
        this.infoWindow.openAtAnchor(marker);
    };
    
    private readonly fetchFor = (area: Circle) => {
        const position = area.getCenter();

        const geoModel = {
            radius: Math.floor(area.getRadius()),
            location: { lat: position.lat, lng: position.lng }
        };
        
        this.settings.fetchAction({
            params: geoModel,
            beforeStart: () => {
                this.loading.show();
                this.searchButton.disable();
                this.circle.disable();
            },
            onSuccess: (value) => {
                const data = value.data;
                
                const markers: CustomMarker<ISimpleData>[] = data.map((offer) =>
                    new CustomMarker({
                        map: this.map,
                        data: offer,
                        renderer: this.settings.markerRenderer,
                        onClick: this.onMarkerClickHandler
                    })
                );

                MarkerCluster.Create(this.map, markers);
                this.addMarkers(markers);
                this.searchButton.enable();
                this.circle.enable();
                this.loading.hide();
            }
        });
    };
    
    private readonly addMarkers = (markers: {attachToMap: (map: Map) => void}[]) => {
        markers.forEach((m) => m.attachToMap(this.map));  
    };
    
    private readonly convertMetersToPixels = (meters: number) =>
        Math.ceil(meters / this.map.calcMetersPerPixel());

    private readonly convertPixelsToMeters = (pixels: number) =>
        Math.ceil(pixels * this.map.calcMetersPerPixel());

    private readonly getZoomLevelForRadius = (radius: number): number => {
        if (typeof (radius) !== "number" || radius === null)
            throw new Error("MapSearch.ts -> getZoomLevelForRadius -> Radius must be a number");

        if (!(0 <= radius && radius <= 100000))
            throw new Error("MapSearch.ts -> getZoomLevelForRadius -> Radius must be in [0, 100000].");

        if (radius === 0) return 13;

        const altered = radius * 100;
        let min = altered;
        let z = 7;
        for (let zoomLevel in Map.ZOOM_SCALE) {
            if (Map.ZOOM_SCALE.hasOwnProperty(zoomLevel)) {
                const scale = Map.ZOOM_SCALE[zoomLevel];
                const diff = Math.abs(scale - altered);
                if (diff < min) {
                    min = diff;
                    z = Number(zoomLevel);
                }
            }
        }

        return Number(z);
    }
}