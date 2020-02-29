import { ICoordinate } from '../MapSearch/Common/ICoordinate';

export default interface ISimpleData {
    location: ICoordinate;
    title: string;
    imageUrl: string;
    markerText: string;
    available: boolean;
}