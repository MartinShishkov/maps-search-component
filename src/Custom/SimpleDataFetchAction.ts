import axios from "axios";
import IFetchActionArgs from '../MapSearch/Common/IFetchActionArgs';

export const SimpleDataFetchAction = (args: IFetchActionArgs) => {
    args.beforeStart();
    axios.get(`/json?lat=${args.params.location.lat}&lng=${args.params.location.lng}&radius=${args.params.radius}`)
        .then(args.onSuccess);
};