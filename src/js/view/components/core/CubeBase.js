import {Event} from "../../../../../lib/kurst/events/Event";
import {CubeImageEvent} from "../events/CubeImageEvent";
import {EventDispatcher} from '../../../../../lib/kurst/events/EventDispatcher';
import {BitmapData} from '../../../../../lib/kurst/display/BitmapData';

/**
 * Base class for a collection of cubes that make an image
 */
export class CubeBase extends EventDispatcher
{
	constructor( cubeView )
	{
		super();
		this._cubeView = cubeView;
		this._column = 0;
		this._row = 0;
		this._columnCount = null;
		this._rowCount = null;
		this._state = CubeBase.REST;
	}

	//---------------------------------------------------------------------------

	/**
	 * Set size / dimensions for a cube collection
	 *
	 * @param row
	 * @param column
	 * @param rowCount
	 * @param columnCount
	 */
	setDimensions( row , column , rowCount , columnCount)
	{
		this._column = column;
		this._row = row;
		this._columnCount = columnCount;
		this._rowCount= rowCount;
	}
	/**
	 * get start column
	 *
	 * @returns {number|*}
	 */
	get column()
	{
		return this._column;
	}
	/**
	 * get number of columns
	 *
	 * @returns {number}
	 */
	get columnCount()
	{
		return this._columnCount;
	}
	/**
	 * get start row of cube collection
	 *
	 * @returns {number|*}
	 */
	get row()
	{
		return this._row;
	}
	/**
	 * get number of rows
	 *
	 * @returns {number}
	 */
	get rowCount()
	{
		return this._rowCount;
	}
	/**
	 * Override - addEventListener - because we have custom event registration for mouse event
	 *
	 * @param type
	 * @param listener
	 * @param scope
	 */
	addEventListener(type, listener, scope = null)
	{
		switch ( type )
		{
			case CubeImageEvent.ROLL_OVER:
			case CubeImageEvent.ROLL_OUT:
			case CubeImageEvent.CLICK:
				this._cubeView.mousePicker.registerMouseEvent( this , type , this._side );
				break;
		}
		super.addEventListener( type , listener , scope );
	}
	/**
	 * Override - removeEventListener - because we have custom event registration for mouse event
	 *
	 * @param type
	 * @param listener
	 * @param scope
	 */
	removeEventListener(type, listener, scope = null)
	{
		switch ( type )
		{
			case CubeImageEvent.ROLL_OVER:
			case CubeImageEvent.ROLL_OUT:
			case CubeImageEvent.CLICK:
				this._cubeView.mousePicker.unregisterMouseEvent( this , type , this._side  );
				break;
		}
		super.removeEventListener( type , listener , scope );
	}

}


CubeBase.ROLL_OVER = 'ROLL_OVER';
CubeBase.ROLL_OUT = 'ROLL_OUT';
CubeBase.REST = 'REST';


