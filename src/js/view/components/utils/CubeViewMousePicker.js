import {Event} from "../../../../../lib/kurst/events/Event";
import {EventDispatcher} from '../../../../../lib/kurst/events/EventDispatcher';
import THREE from 'three'
import {CubeImage} from '../data/CubeImage';
import {CubeBase} from '../core/CubeBase';
import {CubeImageEvent} from '../events/CubeImageEvent';

var TweenMax = require( 'gsap/src/uncompressed/TweenMax');

/**
 * Mouse picker for the cube view
 */
export class CubeViewMousePicker extends EventDispatcher
{

	/**
	 *
	 * @param threeView
	 * @param cubeView
	 */
	constructor( threeView , cubeView )
	{
		super();

		this._imagesRegisteredForMouseEvents = {};
		this._threeView = threeView;
		this._cubeView = cubeView;

		this.mousePosition = new THREE.Vector2();
		this._initMouseHandlers();
		this._mouseMoveDelegate = ( e ) => this._onMouseMove( e );

		this.row = -1;
		this.col = -1;

		this.currentRow = -1;
		this.currentCol = -1;

		this.rowWidth = this._cubeView.cubeWidth;
		this.rowHeight = this._cubeView.cubeHeight;

	}

	//---------------------------------------------------------------------------

	/**
	 *
	 * @param cubeImage
	 */
	unregisterMouseEvent( cubeImage , type )
	{
		if ( this.isRegistered( cubeImage , type ))
		{
			var n;
			var a = this._imagesRegisteredForMouseEvents[type];
			var l = a.length;
			for (var c = 0; c < l; c++)
			{
				n = a[c];

				if (n == cubeImage)
				{
					a.splice(c, 1);
				}
			}
		}
	}
	/**
	 *
	 * @param cubeImage
	 */
	registerMouseEvent( cubeImage , type )
	{
		if ( ! this.isRegistered( cubeImage , type))
		{
			if ( this._imagesRegisteredForMouseEvents[ type ] == null )
			{
				this._imagesRegisteredForMouseEvents[ type ] = [];
			}

			this._imagesRegisteredForMouseEvents[ type ].push( cubeImage );
		}
	}
	/**
	 *
	 * @param cubeImage
	 * @returns {boolean}
	 */
	isRegistered( cubeImage , type )
	{

		if ( this._imagesRegisteredForMouseEvents[type] == null ) return false;

		var a = this._imagesRegisteredForMouseEvents[type];
		var l = a.length;
		var o;

		for (var c = 0; c < l; c++)
		{
			o = a[c];
			if ( o === cubeImage )
			{
				return true;
			}
		}
		return false;
	}

	//---------------------------------------------------------------------------

	_onRollOut( row , col )
	{
		//if ( row != -1 && col != -1 )
		//{
			var cubesListening = this._imagesRegisteredForMouseEvents[CubeImageEvent.ROLL_OUT];

			if ( this._imagesRegisteredForMouseEvents[CubeImageEvent.ROLL_OVER] )
			{
				if ( cubesListening )
				{
					cubesListening.concat(  this._imagesRegisteredForMouseEvents[CubeImageEvent.ROLL_OVER] )
				}
				else
				{
					cubesListening = this._imagesRegisteredForMouseEvents[CubeImageEvent.ROLL_OVER];
				}
			}

			if ( cubesListening )
			{

				var l = cubesListening.length;
				var cube, cubeRow, cubeCol, rl , cl;

				for ( var c = 0 ; c < l ; c ++ )
				{
					cube = cubesListening[c];
					cubeRow = cube.row;
					cubeCol = cube.column;
					rl = cubeRow + cube.rowCount;
					cl = cubeCol + cube.columnCount;

					if ( ( cube._state == CubeBase.ROLL_OVER) &&  ( ! ( ( row >= cubeRow && row <= rl ) &&  ( col >= cubeCol && col <= cl ) ) ) )
					{
						cube.dispatchEvent( new CubeImageEvent( CubeImageEvent.ROLL_OUT));
						cube._state = CubeBase.REST;
						return;
					}
				}
			}
		//}
	}

	_onRollOver( row , col )
	{
		if ( row != -1 && col != -1 )
		{
			var cubesListening = this._imagesRegisteredForMouseEvents[CubeImageEvent.ROLL_OVER];
			if ( cubesListening )
			{
				var l = cubesListening.length;
				var cube, cubeRow, cubeCol, rl , cl;

				for ( var c = 0 ; c < l ; c ++ )
				{
					cube = cubesListening[c];
					cubeRow = cube.row;
					cubeCol = cube.column;
					rl = cubeRow + cube.rowCount;
					cl = cubeCol + cube.columnCount;

					if ( ( row >= cubeRow && row <= rl ) &&  ( col >= cubeCol && col <= cl ) )
					{
						if ( cube._state != CubeBase.ROLL_OVER )
						{
							cube._state = CubeBase.ROLL_OVER;
							cube.dispatchEvent( new CubeImageEvent( CubeImageEvent.ROLL_OVER))
						}

						return;
					}
				}
			}
		}
	}

	_initMouseHandlers()
	{
		this._threeView.renderer.domElement.addEventListener( 'mouseover' , ()=>this._onMouseOver());
		this._threeView.renderer.domElement.addEventListener( 'mouseout' , ()=>this._onMouseOut());
		this._threeView.renderer.domElement.addEventListener( 'click' , ()=>this._onMouseClick());
	}

	_onMouseClick()
	{
		if ( this.currentCol != -1 && this.currentRow != -1 )
		{
			var cubesListening = this._imagesRegisteredForMouseEvents[CubeImageEvent.CLICK];
			if ( cubesListening )
			{
				var l = cubesListening.length;
				var cube, cubeRow, cubeCol, rl , cl;

				for ( var c = 0 ; c < l ; c ++ )
				{
					cube = cubesListening[c];
					cubeRow = cube.row;
					cubeCol = cube.column;
					rl = cubeRow + cube.rowCount;
					cl = cubeCol + cube.columnCount;

					if ( ( this.currentRow >= cubeRow && this.currentRow <= rl ) &&  ( this.currentCol >= cubeCol && this.currentCol <= cl ) )
					{
						var e = new CubeImageEvent( CubeImageEvent.CLICK);
							e.row = this.currentRow - cubeRow;
							e.column = this.currentCol - cubeCol;
						cube.dispatchEvent( e );
						return;
					}
				}
			}
		}
	}

	_onMouseOut()
	{
		this._threeView.renderer.domElement.removeEventListener( 'mousemove' , this._mouseMoveDelegate );

		this.currentRow = -1;
		this.currentCol = -1;

		this._onRollOut( this.currentRow , this.currentCol );

	}

	_onMouseOver()
	{
		this._threeView.renderer.domElement.addEventListener( 'mousemove' , this._mouseMoveDelegate );
	}

	_onMouseMove( e )
	{
		this.mousePosition.x = e.layerX ;//( ( e.layerX  ) / this.width ) * 2 - 1;
		this.mousePosition.y = e.layerY ;//- ( ( e.layerY )  / this.height ) * 2 + 1;

		this.row = Math.floor( this.mousePosition.y / this.rowHeight );
		this.col = Math.floor( this.mousePosition.x / this.rowWidth );

		if ( this.row != this.currentRow || this.col != this.currentCol )
		{
			this._onRollOut( this.currentRow , this.currentCol );
			this.currentCol = this.col;
			this.currentRow = this.row;
			this._onRollOver( this.row , this.col );
		}
	}


}
