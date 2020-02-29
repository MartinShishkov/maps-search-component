import * as React from 'react';
const classNames = require("./HotelMarkerTemplate.style");

export interface IHotelMarkerProps {
    available: boolean;
    text: string;
}

export const HotelMarkerTemplate = (props: IHotelMarkerProps) => 
    <div className={`${classNames.hotelMarker} ${props.available ? classNames.fillGreen : classNames.fillRed}`}>
        <div className={classNames.markerContent}>
            {props.text}
        </div>
        <div className={classNames.markerPivot}></div>
    </div>