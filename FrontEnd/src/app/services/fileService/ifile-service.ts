import { Observable, UnaryFunction } from "rxjs";
import { CountyCSVItem, StateCSVItem } from "../../models/gov/models";

export interface IFileService {
    getStateCSVItemAsync(): UnaryFunction<Observable<string | number>, Observable<StateCSVItem | undefined>>;
    getCountyCSVItemAsync(): UnaryFunction<Observable<string>, Observable<CountyCSVItem | null>>;
}