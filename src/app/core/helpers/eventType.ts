import { LayoutEventType } from "../constants/events";


/**
 * Defines subscriber event
 */
export class AppEvent<T> {
    constructor (
        public type: LayoutEventType,
        public payload: T,
    ) { }
}