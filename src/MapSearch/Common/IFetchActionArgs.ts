import { ICoordinate } from './ICoordinate';

export default interface IFetchActionArgs {
    params: {location: ICoordinate, radius: number}
    beforeStart: () => void,
    onSuccess: (data) => void,
}