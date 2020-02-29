import {ICoordinate} from "./ICoordinate";
import Map from "./Map";

export interface IHtmlMarkerSettings {
    map: Map,
    position: ICoordinate,
    htmlContent: string,
    onClick: Function,
}

const createHTMLMapMarker = (map: Map, position: ICoordinate, htmlContent: string, onClick: Function, OverlayView = google.maps.OverlayView) => {
    class HTMLMarker extends OverlayView {
        private div: HTMLDivElement;
        private readonly HTMLContent: string;
        private readonly position: ICoordinate;
        
        constructor(settings: IHtmlMarkerSettings){
            super();
            this.HTMLContent = settings.htmlContent;
            this.position = settings.position;
            this.attachEventListener("click", () => settings.onClick(this));
        }

        protected readonly attachEventListener = (event: string, handler: Function) => {
            google.maps.event.addListener(
                this,
                event,
                handler
            );
        };

        private readonly createDiv = () => {
            this.div = document.createElement('div');
            this.div.style.position = 'absolute';
            if (this.HTMLContent) {
                this.div.innerHTML = this.HTMLContent;
            }

            google.maps.event.addDomListener(this.div, 'click', event => {
                google.maps.event.trigger(this, 'click');
            });
        };

        private readonly appendDivToOverlay = () => {
            const panes = this.getPanes();
            panes.floatPane.appendChild(this.div);
        };

        private readonly positionDiv = () => {
            const latLng = new google.maps.LatLng(this.position.lat, this.position.lng);
            const point = this.getProjection().fromLatLngToDivPixel(latLng);
            if (point) {
                this.div.style.left = `${point.x}px`;
                this.div.style.top = `${point.y}px`;

                this.div.style.transform = 'translate(-50%,-100%)';
            }
        };

        readonly draw = () => {
            if (!this.div) {
                this.createDiv();
                this.appendDivToOverlay();
            }

            this.positionDiv();
        };

        readonly remove = () => {
            if (this.div) {
                this.div.parentNode.removeChild(this.div);
                this.div = null;
            }
        };

        readonly getPosition = () => {
            return new google.maps.LatLng(this.position.lat, this.position.lng);
        };

        readonly getDraggable = () => {
            return false;
        };
        
        readonly attachToMap = (map: Map) => {
            this.setMap(map.gmap);
        };
    }

    return new HTMLMarker({
        map: map,
        position: position,
        htmlContent: htmlContent,
        onClick: onClick
    });
};

export default createHTMLMapMarker;

