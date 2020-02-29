import * as React from 'react';
import { renderToString } from "react-dom/server";
import DesktopMapSearch from "./d.MapSearch";
import { ICoordinate } from "../Common/ICoordinate";
import IFetchActionArgs from '../Common/IFetchActionArgs';

export interface IMapSearchProps<T extends { location: ICoordinate }> {
    heightInPixels: number,
    width?: string,
    center: ICoordinate,
    radius: number,
    data: T[],
    onButtonClick: (location: ICoordinate, radius: number) => void,
    markerRenderer: (data: T) => JSX.Element,
    infoWindowRenderer: (data: T) => JSX.Element,
    fetchAction: (args: IFetchActionArgs) => void
}

export class MapSearchView<T extends { location: ICoordinate }> extends React.Component<IMapSearchProps<T>, {}> {
    private Map: DesktopMapSearch<T>;
    private targetDOMElement: HTMLElement;

    public static ofType<T extends { location: ICoordinate }>() {
        return MapSearchView as new (props: IMapSearchProps<T>) => MapSearchView<T>;
    }

    constructor(props) {
        super(props);
    }

    private readonly onTargetDOMElementInit = (element: HTMLElement) => {
        this.targetDOMElement = element;
    }

    private readonly initMap = () => {
        if (!this.targetDOMElement)
            throw new Error("Target DOM element was not initialized prior to map initialization");

        this.Map = new DesktopMapSearch({
            map: {
                height: this.props.heightInPixels,
                targetDOMElement: this.targetDOMElement,
                center: this.props.center
            },
            circle: {
                radius: this.props.radius,
                center: this.props.center
            },
            data: this.props.data,
            onButtonClick: this.props.onButtonClick,
            infoWindowRenderer: 
                (data: T) => renderToString(this.props.infoWindowRenderer(data)),
            markerRenderer: 
                (data: T) => renderToString(this.props.markerRenderer(data)),
            fetchAction: this.props.fetchAction
        });
    };

    componentDidMount() {
        this.initMap();
    }

    render = () =>
        <div
            style={{
                width: this.props.width || "100%",
                height: `${this.props.heightInPixels}px`
            }}
            ref={this.onTargetDOMElementInit}
        ></div>
}