import {Event} from './Event';

export class IOErrorEvent extends Event {
    constructor(type) {
        super(type);
    }
}
IOErrorEvent.IO_ERROR = "ioError";
