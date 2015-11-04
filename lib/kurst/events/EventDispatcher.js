import {Event} from './Event';
/**
 * Base class for dispatching events
 *
 * @class EventDispatcher
 *
 */
export class EventDispatcher {
	constructor(target = null)
	{
		this.listeners = new Array();
		this._target = target || this;
	}
	/**
	 * Add an event listener
	 * @method addEventListener
	 * @param {String} Name of event to add a listener for
	 * @param {Function} Callback function
	 */
	addEventListener(type, listener, scope = null)
	{
		if (this.listeners[type] === undefined)
			this.listeners[type] = new Array();
		if (this.getEventListenerIndex(type, listener) === -1)
		{
			var lv = new Object();
			lv.listener = listener;
			lv.scope = scope;
			lv.type = type;
			this.listeners[type].push(lv);
		}
	}
	/**
	 * Remove an event listener
	 * @method removeEventListener
	 * @param {String} Name of event to remove a listener for
	 * @param {Function} Callback function
	 */
	removeEventListener(type, listener, scope = null)
	{
		var index = this.getEventListenerIndex(type, listener, scope);
		if (index !== -1)
		{
			this.listeners[type].splice(index, 1);
		}
	}
	/**
	 * Dispatch an event
	 * @method dispatchEvent
	 * @param {Event} Event to dispatch
	 */
	dispatchEvent(event)
	{
		var listenerArray = this.listeners[event.type];
		if (listenerArray !== undefined)
		{
			var l = listenerArray.length;
			event.target = this._target;
			var lv;
			for (var i = 0; i < l; i++)
			{
				lv = listenerArray[i];
				if (lv)
				{
					if (lv.scope)
					{
						lv.listener.apply(lv.scope, [event]);
					}
					else
					{
						lv.listener(event);
					}
				}
			}
		}
	}
	/**
	 * get Event Listener Index in array. Returns -1 if no listener is added
	 * @method getEventListenerIndex
	 * @param {String} Name of event to remove a listener for
	 * @param {Function} Callback function
	 */
	getEventListenerIndex(type, listener, scope = null)
	{
		if (this.listeners[type] !== undefined)
		{
			var a = this.listeners[type];
			var l = a.length;
			var lv;
			for (var i = 0; i < l; i++)
			{
				lv = a[i];
				if (listener == lv.listener && lv.scope == scope)
				{
					return i;
				}
			}
		}
		return -1;
	}
	/**
	 * check if an object has an event listener assigned to it
	 * @method hasListener
	 * @param {String} Name of event to remove a listener for
	 * @param {Function} Callback function
	 */
	hasEventListener(type, listener, scope = null)
	{
		if (listener != null)
		{
			return (this.getEventListenerIndex(type, listener, scope) !== -1);
		}
		else
		{
			if (this.listeners[type] !== undefined)
				return (this.listeners[type].length > 0);
			return false;
		}
		return false;
	}
}