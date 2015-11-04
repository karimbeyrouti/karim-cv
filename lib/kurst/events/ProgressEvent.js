import {Event} from './Event';

export class ProgressEvent extends Event {
    constructor(type) {
        super(type);
    }
}
ProgressEvent.PROGRESS = "progress";
