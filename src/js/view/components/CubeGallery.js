import {Event} from "../../../../lib/kurst/events/Event";
import {ProgressEvent} from "../../../../lib/kurst/events/ProgressEvent";
import {EventDispatcher} from '../../../../lib/kurst/events/EventDispatcher';
import {BitmapData} from '../../../../lib/kurst/display/BitmapData';
import {Rectangle} from '../../../../lib/kurst/geom/Rectangle';
import {Matrix} from '../../../../lib/kurst/geom/Matrix';
import {ThreeJSView} from './../ThreeJSView'
import {AssetLoader} from '../../loaders/AssetLoader'
import THREE from 'three'
import {RequestAnimationFrame} from '../../../../lib/kurst/utils/RequestAnimationFrame';
import {NumberUtils} from '../../../../lib/kurst/utils/NumberUtils';
import {Color} from '../../../../lib/kurst/geom/Color';
import {CubeImage} from './data/CubeImage';
import {CubeBase} from './core/CubeBase';

var TweenMax = require( 'gsap/src/uncompressed/TweenMax');

export class CubeGallery extends CubeBase
{
	constructor( cubeView , startRow , startCol , intervalTime = 10000 )
	{
		super( cubeView );

		super.setDimensions( startRow , startCol , 0 , 0 );

		this._intervalTime = intervalTime;
		this._counter = 0;
		this._assetLoader = new AssetLoader( cubeView );
		this._assetLoader.addEventListener( ProgressEvent.PROGRESS , ( e )=>this._onImageLoaded( e ) );
		this._loadedImages = [];
		this._currentSide = 0;
		this._currentImagePointer = -1;
		this._currentImage = null;
		this._intervalID = null;
		this._backwards = false;
	}

	//---------------------------------------------------------------------------

	/**
	 *
	 * @param imageID
	 */
	showImage( imageID )
	{
		var cubeImage = this._loadedImages[ imageID ];

		if ( ! cubeImage ) return;
		this._currentSide ++;

		if( this._currentSide > 3 )
			this._currentSide = 0;

		this._currentImage = cubeImage;
		this._backwards = !this._backwards;
		this._currentImage.setImage(this._currentSide ,this._row, this._column , true );
		this._currentImage.show( 2  , 0 , this._backwards );

		this._startTimeout();
	}
	/**
	 *
	 */
	showNext()
	{

		this._currentImagePointer ++;

		if ( this._currentImagePointer > this._loadedImages.length -1 )
			this._currentImagePointer = 0;

		this.showImage( this._currentImagePointer )

	}
	/**
	 *
	 * @param url
	 */
	addImage( url )
	{
		this._assetLoader.queueCubeImage( url , this._counter++ );
	}
	/**
	 *
	 */
	start()
	{
		this._assetLoader.start( );
	}

	//---------------------------------------------------------------------------

	/**
	 *
	 * @private
	 */
	_startTimeout()
	{
		this._stopTimeout();
		this._intervalID = setInterval( ()=>this._timeout() , this._intervalTime );
	}
	/**
	 *
	 * @private
	 */
	_timeout()
	{
		this._currentImagePointer ++;

		if ( this._currentImagePointer > this._loadedImages.length - 1 )
		{
			this._currentImagePointer = 0;
		}

		this.showImage( this._currentImagePointer )

	}
	/**
	 *
	 * @private
	 */
	 _stopTimeout()
	{
		clearInterval( this._intervalID );
	}
	/**
	 *
	 * @param e
	 * @private
	 */
	_onImageLoaded( e )
	{
		this._loadedImages.push( e.image );

		e.image.delayFunction = function ( r , c , current , total , delay )
		{
			return delay + ( ( c + 1 ) * .1 + ( r + 1 ) * .1 );
		};

		if ( this._currentImagePointer == -1 )
		{
			this._currentImagePointer = 0;
			this._currentImage = e.image;
			this._currentSide = 1;
			this._currentImage.setImage( this._currentSide ,this._row, this._column , true );
			this._currentImage.show( 1, .5 );

			super.setDimensions( this._row, this._column, this._currentImage.rowCount , this._currentImage.columnCount  );
			this._startTimeout();
		}
		else {}
	}
	/**
	 *
	 * @param image
	 * @private
	 */
	_onMakeImageCache( image )
	{
		image.setImage( this._currentSide ,this._row, this._column , true , true ); // generate image cache
	}

}