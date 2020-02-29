import * as React from "react";
import { MapSearchView } from './MapSearch/Desktop/d.MapSearchView';
import { HotelMarkerTemplate } from './Custom/HotelMarkerTemplate';
import { InfoWindowTemplate } from './Custom/InfoWindowTemplate';
import ISimpleData from './Custom/ISimpleData';
import { SimpleDataFetchAction } from './Custom/SimpleDataFetchAction';

const MapForHotels = MapSearchView.ofType<ISimpleData>();

export default class App extends React.Component<{}, {data: ISimpleData[]}> {
    constructor(props){
        super(props);
        this.state = {
            data: []
        };
    }

    render = () => 
        <MapForHotels 
            heightInPixels={600}
            center={{lat: 42.7, lng: 25}}
            data={this.state.data}
            onButtonClick={(location, radius) => {}}
            markerRenderer={(data: ISimpleData) => <HotelMarkerTemplate text={data.markerText} available={data.available}/>}
            infoWindowRenderer={(data: ISimpleData) => <InfoWindowTemplate {...data}/>}
            radius={10000}
            fetchAction={SimpleDataFetchAction}
        />
}