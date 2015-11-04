import {Event} from "../../../../lib/kurst/events/Event";
import {EventDispatcher} from '../../../../lib/kurst/events/EventDispatcher';
import {BitmapData} from '../../../../lib/kurst/display/BitmapData';
import {Rectangle} from '../../../../lib/kurst/geom/Rectangle';
import {Matrix} from '../../../../lib/kurst/geom/Matrix';
import {ThreeJSView} from './../ThreeJSView'
import THREE from 'three'
import {RequestAnimationFrame} from '../../../../lib/kurst/utils/RequestAnimationFrame';
import {NumberUtils} from '../../../../lib/kurst/utils/NumberUtils';
import {Color} from '../../../../lib/kurst/geom/Color';
import {CubeImage} from './data/CubeImage';
import {CubeViewMousePicker} from './utils/CubeViewMousePicker';
var TweenMax = require( 'gsap/src/uncompressed/TweenMax');

export class CubeView extends EventDispatcher
{
	/**
	 *
	 * @param threeView
	 * @param width
	 * @param height
	 * @param rows
	 * @param cols
	 */
	constructor( threeView , width = 1024 , height = 2048 , rows = 32 , cols = 16)
	{
		super();

		this.width = width;
		this.height = height;
		this.image = null;

		this._threeView = threeView;
		this._container = new THREE.Object3D();
		this._columns = cols;
		this._rows = rows;
		this._cubeWidth = this.width / this._columns;
		this._cubeHeight = this.height / this._rows;
		this._meshes = [];
		this._cubeGeom = new THREE.BoxGeometry( this._cubeWidth, this._cubeHeight, this._cubeHeight, 8 , 8, 8 );
		this._grid = new Array(this._rows);
		this._mousePicker = new CubeViewMousePicker( threeView , this );

		for ( var r = 0 ; r < this._grid.length ;r ++ )
			this._grid[r] = new Array( this._columns );

		this._setup();
	}

	//---------------------------------------------------------------------------

	/**
	 *
	 * @returns {CubeImage}
	 */
	createImage()
	{
		return new CubeImage( this );
	}
	/**
	 *
	 * @param image
	 * @param side
	 * @param color
	 * @param startRow
	 * @param startCol
	 * @param useCache
	 */
	setImage( image , side = 1 , color = 0xffffff , startRow = 0 , startCol = 0 , useCache = false , generateCacheOnly = false )
	{

		var hasCache = (useCache);

		if ( ! image.cache && useCache )
		{
			image.cache = {};
			hasCache = false;
		}

		if ( ! hasCache )
		{
			var bitmapData;

			if ( image instanceof HTMLImageElement )
			{
				bitmapData = new BitmapData( image.width , image.height );
				bitmapData.draw( image );
			}
			else if ( image instanceof BitmapData )
			{
				bitmapData = image;
			}
		}

		var destRect = new Rectangle();
			destRect.width = this._cubeWidth;
			destRect.height = this._cubeHeight;
			destRect.x =0;
			destRect.y = 0;

		var clipRect = new Rectangle();
			clipRect.width = this._cubeWidth;
			clipRect.height = this._cubeHeight;
			clipRect.x = 0;
			clipRect.y = 0;

		var endRow = startRow + ( image.height / this._cubeHeight ) ;
		var endCol = startCol + ( image.width / this._cubeWidth );
		var cube;
		var counter = 0;
		var cacheCanvas;

		for ( var r = startRow ; r < endRow; r++ )
		{
			for ( var c = startCol ; c < endCol  ; c++ )
			{
				if ( hasCache && useCache )
				{
					cacheCanvas = image.cache[counter ++ ];
				}
				else
				{
					clipRect.x = ( c * this._cubeWidth ) - ( startCol * this._cubeWidth );
					clipRect.y = ( r * this._cubeHeight ) - ( startRow * this._cubeHeight );

					var b = new BitmapData( this._cubeWidth , this._cubeHeight , false , 0x000000 );
						b.copyPixels(bitmapData , clipRect , destRect ) ;

					if ( useCache )
						image.cache[counter ++ ] = b.canvas;

					cacheCanvas = b.canvas;

					b.dispose();
				}


				if ( ! generateCacheOnly )
				{

					var t = new THREE.Texture( cacheCanvas );
						t.needsUpdate = true;

					cube = this.getCube( r , c );

					cube.material.materials[side].color.setHex( color );
					cube.material.materials[side].map = t;
					cube.material.materials[side].needsUpdate = true;
					cube.scaleInited = false;
				}

			}
		}

	}
	/**
	 *
	 * @param side
	 * @param startRow
	 * @param startCol
	 * @param endRow
	 * @param endCol
	 * @param time
	 * @param animateBackwards
	 * @param delayTime
	 * @param delayFunction
	 * @param callback
	 */
	show( side , startRow = 0 , startCol = 0 , endRow = 32 , endCol = 16 , time = .5 ,  animateBackwards = false , delayTime = 0 , delayFunction = undefined , callback = undefined )
	{

		var cube;
		var current = 0;
		var calcDelay = 0;
		var total = ( endRow - startRow ) * ( endCol  - startCol );

		var r;
		var c;

		if ( animateBackwards )
		{
			for ( r = endRow - 1; r >= startRow ; r-- )
			{
				for ( c = endCol - 1; c >= startCol ; c-- )
				{
					cube = this.getCube( r , c );
					TweenMax.killTweensOf( cube.rotation );
					if ( delayFunction != undefined )
					{
						calcDelay = delayFunction( r , c , current ++ , total , delayTime );
					}

					if ( r == endRow - 1 && c == endCol - 1 )
					{
						TweenMax.to( cube.rotation, time , {onComplete: callback , y: side * ( Math.PI / 2 ) , delay: calcDelay} );
					}
					else
					{
						TweenMax.to( cube.rotation, time , {y: side * ( Math.PI / 2 ) , delay: calcDelay } );// + ( ( c + 1 ) * .025 + ( r + 1 ) * .025 ) } );
					}

					if ( ! cube.scaleInited )
						TweenMax.to( cube.scale, time , {x:1,y:1,z:1, delay: ( calcDelay - 0.1 ) } );

				}
			}
		}
		else
		{
			for ( r = startRow ; r < endRow; r++ )
			{
				for ( c = startCol ; c < endCol  ; c++ )
				{
					cube = this.getCube( r , c );
					TweenMax.killTweensOf( cube.rotation );

					if ( delayFunction != undefined )
					{
						calcDelay = delayFunction( r , c , current ++ , total , delayTime );
					}

					if ( r == endRow - 1 && c == endCol - 1 )
					{
						TweenMax.to( cube.rotation, time , {onComplete: callback , y: side * ( Math.PI / 2 ) , delay: calcDelay} );// + ( ( c + 1 ) * .025 + ( r + 1 ) * .025 ) } );
					}
					else
					{
						TweenMax.to( cube.rotation, time , {y: side * ( Math.PI / 2 ) , delay: calcDelay } );// + ( ( c + 1 ) * .025 + ( r + 1 ) * .025 ) } );
					}

					if ( ! cube.scaleInited )
						TweenMax.to( cube.scale, 1 , {x:1,y:1,z:1, delay: ( calcDelay - 0.1 ) } );
				}
			}
		}

	}
	/**
	 *
	 * @param row
	 * @param col
	 * @returns {*}
	 */
	getCube( row , col )
	{
		return this._grid[row][col];
	}
	/**
	 *
	 */
	render()
	{

	}

	//---------------------------------------------------------------------------

	/**
	 *
	 * @returns {CubeViewMousePicker|*}
	 */
	get mousePicker()
	{
		return this._mousePicker;
	}
	/**
	 *
	 * @returns {number|*}
	 */
	get rows()
	{
		return this._rows;
	}
	/**
	 *
	 * @returns {number|*}
	 */
	get columns()
	{
		return this._columns;
	}
	/**
	 *
	 * @returns {number|*}
	 */
	get cubeWidth()
	{
		return this._cubeWidth;
	}
	/**
	 *
	 * @returns {number|*}
	 */
	get cubeHeight()
	{
		return this._cubeHeight;
	}

	//---------------------------------------------------------------------------

	_setup()
	{

		this._threeView.add( this._container );
		this._container.position.x = - this.width * .5 + this._cubeWidth * .5;
		this._container.position.y = - this.height* .5 - this._cubeHeight * .5;

		var color = new Color();
			color.setHex( 0x708090 );

		var destRect = new Rectangle();
			destRect.width = this._cubeWidth;
			destRect.height = this._cubeHeight;
			destRect.x =0;
			destRect.y = 0;

		var clipRect = new Rectangle();
			clipRect.width = this._cubeWidth;
			clipRect.height = this._cubeHeight;
			clipRect.x = 0;
			clipRect.y = 0;

		for ( var r = 0 ; r < this._rows; r++ )
		{
			for ( var c = 0 ; c < this._columns  ; c++ )
			{

				clipRect.x = c * this._cubeWidth;
				clipRect.y = r * this._cubeHeight;

				var materialArray = [];

				for ( var m = 0 ; m < 6 ; m ++ )
				{
					materialArray.push( new THREE.MeshLambertMaterial( { color: 0xffffff } ) );
				}

				var mesh = new THREE.Mesh( this._cubeGeom , new THREE.MultiMaterial ( materialArray ));
					mesh.position.x = ( c * clipRect.width );
					mesh.position.y = ( ( this._rows - r ) * clipRect.height );
					mesh.castShadow = false;
					mesh.receiveShadow = false;
					mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.01;
				this._grid [r][c] = mesh;
				this._meshes.push( mesh );
				this._container.add( mesh );

			}
		}

	}


}