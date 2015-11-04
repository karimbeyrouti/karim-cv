import {Error} from './Error';

export class ArgumentError extends Error {
    constructor(message = null, id = 0) {
        super(message || "ArgumentError", id);
    }
}
