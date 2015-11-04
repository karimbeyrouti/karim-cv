///<reference path="../../libs/waa.d.ts" />
///<reference path="../../libs/usermedia.d.ts" />

import {Event} from '../events/Event';
import {EventDispatcher} from '../events/EventDispatcher';

export class UserMediaManagerEvent extends Event {
    constructor(type) {
        super(type);
    }
}
UserMediaManagerEvent.MIC_INITIALIZED = "MIC_INITIALIZED";
UserMediaManagerEvent.MIC_INITIALIZED_ERROR = "MIC_INITIALIZED_ERROR";
