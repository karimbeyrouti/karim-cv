import {Event} from "../../../../../lib/kurst/events/Event";
import {CubeImageEvent} from "../events/CubeImageEvent";
import {CubeBase} from "../core/CubeBase";
import {EventDispatcher} from '../../../../../lib/kurst/events/EventDispatcher';
import {BitmapData} from '../../../../../lib/kurst/display/BitmapData';

export class CubeImage extends CubeBase
{
	constructor( cubeView )
	{
		super( cubeView );

		this._bitmapData = null;
		this._image = new Image();
		this._image.onload = ()=>this._onImageLoaded();
		this._isLoaded = false;
		this._side = null;
		this._textureSide = [4 , 1 , 5 , 0 ];
		this._delayFunction = function ( r , c , current , total , delay )
		{
			return delay + ( current * 0.1 );
		};


	}

	//---------------------------------------------------------------------------

	/**
	 *
	 * @param side
	 * @param startRow
	 * @param startCol
	 * @param useCache
	 */
	setImage( side , startRow , startCol , useCache = false )
	{
		super.setDimensions( startRow , startCol ,this._image.height / this._cubeView.cubeHeight , this._image.width / this._cubeView.cubeWidth );
		this._side = side;
		this._cubeView.setImage( this.bitmap , this._textureSide[side] , 0xffffff , startRow , startCol , useCache );
	}
	/**
	 *
	 * @param time
	 * @param delay
	 * @param animateBackwards
	 */
	show( time = 1 , delay = 0 , animateBackwards = false )
	{
		var endRow = this._row  + ( this._image.height / this._cubeView.cubeHeight );
		var endCol = this._column + ( this._image.width/ this._cubeView.cubeWidth );

		this._cubeView.show( this._side , this._row , this._column , endRow , endCol , time , animateBackwards , delay , this._delayFunction ,  ()=>this._onAnimationComplete() );
	}

	//---------------------------------------------------------------------------

	/**
	 *
	 * @param f
	 */
	set delayFunction ( f )
	{
		this._delayFunction = f;
	}
	/**
	 *
	 * @returns {HTMLImageElement|*}
	 */
	get image()
	{
		return this._image;
	}
	/**
	 *
	 * @returns {boolean}
	 */
	get isLoaded()
	{
		return this._isLoaded;
	}
	/**
	 *
	 * @param url
	 */
	loadImage( url )
	{
		this._isLoaded = false;
		this._image.src = url;
	}
	/**
	 *
	 * @returns {null|BitmapData|*}
	 */
	get bitmap()
	{
		return this._bitmapData;
	}
	/**
	 *
	 * @returns {null|*}
	 */
	get side()
	{
		return this._side;
	}

	//---------------------------------------------------------------------------

	_onAnimationComplete()
	{
		this.dispatchEvent( new CubeImageEvent( CubeImageEvent.ANIMATION_COMPLETE ) );
	}

	_onImageLoaded()
	{
		this._isLoaded = true;
		this._bitmapData = new BitmapData( this._image.width , this._image.height ,false );
		this._bitmapData.draw( this._image );

		this.dispatchEvent( new Event( Event.COMPLETE ));
	}

}