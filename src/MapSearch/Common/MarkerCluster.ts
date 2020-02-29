import Map from "./Map";

declare const MarkerClusterer: any;

interface IAnchor{
    getPosition: () => google.maps.LatLng,
    getMap: () => google.maps.Map,
    setMap: (map: google.maps.Map) => void,
}

export default class MarkerCluster{
    static readonly Create = (map: Map, anchors: IAnchor[]) => {
        const markerCluster = new MarkerClusterer(map.gmap, anchors,
            {
                minimumClusterSize: 4,
                gridSize: 50,
                styles: [{
                    url: '/img/m3.png',
                    textColor: "white",
                    width: 51,
                    height: 54,
                    textSize: 15
                }]
            });
    };
}