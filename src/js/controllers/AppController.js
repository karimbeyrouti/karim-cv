
import {Event} from "../../../lib/kurst/events/Event";
import {EventDispatcher} from '../../../lib/kurst/events/EventDispatcher';
import {JSUtils} from '../../../lib/kurst/utils/JSUtils';
import {BitmapData} from '../../../lib/kurst/display/BitmapData';
import {Rectangle} from '../../../lib/kurst/geom/Rectangle';
import {Matrix} from '../../../lib/kurst/geom/Matrix';
import {ThreeJSView} from '.././view/ThreeJSView'
import THREE from 'three'
import {RequestAnimationFrame} from '../../../lib/kurst/utils/RequestAnimationFrame';
import {CubeView} from './../view/components/CubeView';
import {CubeGallery} from './../view/components/CubeGallery';
import {CubeImage} from './../view/components/data/CubeImage';
import {CubeImageEvent} from "./../view/components/events/CubeImageEvent";
import {AssetLoader} from './../loaders/AssetLoader';

var TweenMax = require( 'gsap/src/uncompressed/TweenMax');
var OBJLoader = require( '../utils/OBJLoader');

/**
 * Application controller - controller for all UI - this is a very simple site
 */
export class AppController extends EventDispatcher
{
	constructor()
	{
		super();

		this._threeView = new ThreeJSView(1024 , 2048);
		this._cubeView = new CubeView ( this._threeView );
		this._side = 1;
		this._raf = new RequestAnimationFrame( this.render , this );
		this._contactImg = null;
		this._contactImgOver = null;
		this._titleImg = null;
		this._backgroundMesh = null;
		this._skillsImage = null;
		this._aboutText = null;

		this._assetLoader = new AssetLoader( this._cubeView );
		this._assetLoader.queueCubeImage( './assets/images/about-text.png' , 'about-text' );
		this._assetLoader.queueCubeImage( './assets/images/header-contact.png', 'header-contact' );
		this._assetLoader.queueCubeImage( './assets/images/header-contact-rollover.png', 'header-contact-rollover' );
		this._assetLoader.queueCubeImage( './assets/images/header-title.png', 'header-title' );
		this._assetLoader.queueCubeImage( './assets/images/skills.png', 'skills' );

		this._headGallery = new CubeGallery( this._cubeView , 1 , 0 , 7000);
		this._headGallery.addImage(  './assets/images/work-gallery-image.png' );
		this._headGallery.addImage(  './assets/images/work-gallery-image-1.png' );
		this._headGallery.addImage(  './assets/images/work-gallery-image-2.png' );
		this._headGallery.addImage(  './assets/images/work-gallery-image-3.png' );
		this._headGallery.addImage(  './assets/images/work-gallery-image-4.png' );
		this._headGallery.addImage(  './assets/images/work-gallery-image-5.png' );
		this._headGallery.addImage(  './assets/images/work-gallery-image-6.png' );
		this._headGalleryTransitionCounter = 0;

		this._assetLoader.addEventListener( Event.COMPLETE , ()=>this._onAllImagesLoaded() );
		this._assetLoader.start();

		document.getElementById('content').appendChild(this._threeView.renderer.domElement);
		this._raf.start();
	}

	//--------------------------------------------------------------------

	/**
	 * Render loop
	 */
	render()
	{
		this._threeView.render();
	}

	//--------------------------------------------------------------------

	/**
	 * Load the a background image which is behind the cube view
	 *
	 * @private
	 */
	_loadBackground()
	{

		var material = new THREE.MeshBasicMaterial( {
			map: THREE.ImageUtils.loadTexture( './assets/images/background.jpg' ),
			color:0xffffff
		} );

		var geometry = new THREE.PlaneGeometry( 1024, 2048, 1 , 2 );

		this._backgroundMesh = new THREE.Mesh( geometry , material );
		this._backgroundMesh.position.z = 50;
		this._threeView.add( this._backgroundMesh );

	}
	/**
	 * Cube wipe effect - little effect which animates a wave over all cubes on screen
	 *
	 * @private
	 */
	_wipeFX()
	{

		this._headGallery.pause();

		var rl = this._cubeView.rows;
		var cl = this._cubeView.columns;
		var cube;
		var delay;
		var s = .01;
		var delayMult = 0.1;
		var onComplete = null;

		for ( var c = 0 ; c < cl ; c ++ )
		{
			for ( var r = 0 ; r < rl ; r ++ )
			{

				if ( r == rl - 1 && c == cl - 1 )
					onComplete = ()=>this._onWipeComplete();

				cube    = this._cubeView.getCube( r , c );
				delay   = ( ( c + 1 ) * delayMult + ( r + 1 ) * delayMult );
				TweenMax.to( cube.scale, 1 , {z:s, y:s, x:s,delay:delay});
				TweenMax.to( cube.scale, 1 , {z:1, y:1, x:1,delay:.8 + delay});
				TweenMax.to( cube.rotation, 2 , { y:cube.rotation.y + Math.PI *2 ,delay:delay , onComplete:onComplete});
			}
		}

	}

	//--------------------------------------------------------------------

	/**
	 * Event - all images loaded
	 *
	 * @private
	 */
	_onAllImagesLoaded()
	{
		this._titleImg = this._assetLoader.getCubeImage( 'header-title' );
		this._titleImg.setImage( 1 , 0 , 0 );
		this._titleImg.show(1);

		this._contactImg = this._assetLoader.getCubeImage( 'header-contact' );
		this._contactImg.setImage( 1 ,0, this._titleImg.columnCount , true );
		this._contactImg.show( .5 , 1.5 , true );
		this._contactImg.addEventListener( CubeImageEvent.ROLL_OVER , ()=>this._onRollOverContactImage());
		this._contactImg.addEventListener( CubeImageEvent.ROLL_OUT, ()=>this._onRollOutContactImage());
		this._contactImg.addEventListener( CubeImageEvent.CLICK, (e )=>this._onClickContactImage( e ));

		this._contactImgOver = this._assetLoader.getCubeImage( 'header-contact-rollover' );
		this._contactImgOver.setImage( 3 ,0, this._titleImg.columnCount , true );

		this._aboutText = this._assetLoader.getCubeImage( 'about-text' );
		this._aboutText.setImage( 1 ,7 , 0 );
		this._aboutText.delayFunction = function ( r , c , current , total , delay )
			{
				return delay + ( ( c + 1 ) * .05 );//* .1 + ( r + 1 ) * .1 );
			};
		this._aboutText.show( 1 , 1 , false );

		this._skillsImage = this._assetLoader.getCubeImage( 'skills' );
		this._skillsImage.setImage( 1 , 9 , 0 );
		this._skillsImage.delayFunction = function ( r , c , current , total , delay )
		{
			return delay + ( ( c + 1 ) * .1 + ( r + 1 ) * .1 );
		};
		this._skillsImage.show( 1 , 1 , true );
		this._skillsImage.addEventListener(CubeImageEvent.ANIMATION_COMPLETE, ( e )=>this._onPageAnimationComplete( e ));

		this._headGallery.start();
		this._headGallery.addEventListener(CubeImageEvent.CLICK, (e )=>this._onClickHeadGallery( e ));
		this._headGallery.addEventListener(CubeImageEvent.ANIMATION_COMPLETE, (e )=>this._onGalleryAnimationComplete( e ));

		this._cubeView.show( 1 , this._skillsImage.rowCount + this._skillsImage.row  , 0 , this._cubeView.rows, this._cubeView.columns , 1 , false , 0)
	}
	/**
	 * Event - clicking on head gallery
	 *
	 * @param e : Event
	 * @private
	 */
	_onClickHeadGallery( e )
	{
		if ( ! this._headGallery.isPaused )
			this._headGallery.showNext();
	}
	/**
	 * Click on contact image
	 *
	 * @param e : CubeImageEvent
	 * @private
	 */
	_onClickContactImage( e )
	{
		switch ( e.column )
		{
			case 0:
				window.location.href = "https://github.com/karimbeyrouti";
				break;

			case 1:
				window.location.href = "https://uk.linkedin.com/in/karimbeyrouti";
				break;

			case 2:
				window.location.href = "mailto:karim@kurst.co.uk?subject=Hello%20Karim";
				break;

			case 3:
				window.location.href = "tel:07977997629";
				break;

		}
	}
	/**
	 * Roll out of contact image
	 * @private
	 */
	_onRollOutContactImage()
	{
		this._contactImg.show( 2 , 0 , true );
		document.getElementById('content').style.cursor = "default";
	}
	/**
	 * Roll over contact image
	 * @private
	 */
	_onRollOverContactImage()
	{
		this._contactImgOver.show( 2 , 0 , false );
		document.getElementById('content').style.cursor = "pointer";
	}
	/**
	 * Gallery image transition complete event
	 *
	 * @private
	 */
	_onGalleryAnimationComplete()
	{
		this._headGalleryTransitionCounter ++;
		if ( this._headGalleryTransitionCounter % 3 == 0 )
		{
			this._wipeFX();
		}

	}
	/**
	 * Wipe / wave effect transition complete
	 *
	 * @private
	 */
	_onWipeComplete()
	{
		this._headGallery.resume();
	}
	/**
	 * Page animation comeplete event
	 * @private
	 */
	_onPageAnimationComplete()
	{
		this._loadBackground();
	}


}