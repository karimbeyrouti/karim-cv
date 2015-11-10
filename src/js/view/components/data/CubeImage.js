import {Event} from "../../../../../lib/kurst/events/Event";
import {CubeImageEvent} from "../events/CubeImageEvent";
import {CubeBase} from "../core/CubeBase";
import {EventDispatcher} from '../../../../../lib/kurst/events/EventDispatcher';
import {BitmapData} from '../../../../../lib/kurst/display/BitmapData';

/**
 * Image comprised of cubes / side of a cube
 */
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
	 * Assign an image to a specified side in a group of cubes
	 *
	 * @param side - 0 to 3 - side to add the image to
	 * @param startRow - start row for image
	 * @param startCol - start column for the image
	 * @param useCache - cache the image ( speeds up future transitions )
	 */
	setImage( side , startRow , startCol , useCache = false )
	{
		super.setDimensions( startRow , startCol ,this._image.height / this._cubeView.cubeHeight , this._image.width / this._cubeView.cubeWidth );
		this._side = side;
		this._cubeView.setImage( this.bitmap , this._textureSide[side] , 0xffffff , startRow , startCol , useCache );
	}
	/**
	 * Show the image
	 * @param time - animation time
	 * @param delay - animation delay time
	 * @param animateBackwards - animate backwards
	 * @param animationFunction - animation function
	 *          animationFunction : (  cube , time , delay , angle , callback ) => ( cube , time , delay , angle , callback )
	 */
	show( time = 1 , delay = 0 , animateBackwards = false , animationFunction = undefined )
	{
		var endRow = this._row  + ( this._image.height / this._cubeView.cubeHeight );
		var endCol = this._column + ( this._image.width/ this._cubeView.cubeWidth );

		this._cubeView.show( this._side , this._row , this._column , endRow , endCol , time , animateBackwards , delay , this._delayFunction ,  ()=>this._onAnimationComplete() , animationFunction );
	}

	//---------------------------------------------------------------------------

	/**
	 * set a function for animation delay calculation
	 *
	 * @param function
	 *      delayFunction : ( row , column , currentTile , totalTiles , delayTime ) => ( row , column , currentTile , totalTiles , delayTime )
	 */
	set delayFunction ( f )
	{
		this._delayFunction = f;
	}
	/**
	 * get html image element
	 *
	 * @returns {HTMLImageElement|*}
	 */
	get image()
	{
		return this._image;
	}
	/**
	 * is loaded getter
	 *
	 * @returns {boolean}
	 */
	get isLoaded()
	{
		return this._isLoaded;
	}
	/**
	 * load an image ( PNG / JPG / GIF )
	 * @param url
	 */
	loadImage( url )
	{
		this._isLoaded = false;
		this._image.src = url;
	}
	/**
	 * get the bitmapdata of loaded image
	 *
	 * @returns {null|BitmapData|*}
	 */
	get bitmap()
	{
		return this._bitmapData;
	}
	/**
	 * get side to which the image has been assigned to
	 *
	 * @returns {null|*}
	 */
	get side()
	{
		return this._side;
	}

	//---------------------------------------------------------------------------

	/**
	 * Animation complete event handler
	 * @private
	 */
	_onAnimationComplete()
	{
		this.dispatchEvent( new CubeImageEvent( CubeImageEvent.ANIMATION_COMPLETE ) );
	}

	/**
	 * image loaded event handler
	 *
	 * @private
	 */
	_onImageLoaded()
	{
		this._isLoaded = true;
		this._bitmapData = new BitmapData( this._image.width , this._image.height ,false );
		this._bitmapData.draw( this._image );

		this.dispatchEvent( new Event( Event.COMPLETE ));
	}

}