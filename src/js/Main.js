
import {Event} from "../../lib/kurst/events/Event";
import {EventDispatcher} from '../../lib/kurst/events/EventDispatcher';
import {JSUtils} from '../../lib/kurst/utils/JSUtils';
import {BitmapData} from '../../lib/kurst/display/BitmapData';
import {Rectangle} from '../../lib/kurst/geom/Rectangle';
import {Matrix} from '../../lib/kurst/geom/Matrix';
import {ThreeJSView} from './view/ThreeJSView'
import THREE from 'three'
import {RequestAnimationFrame} from '../../lib/kurst/utils/RequestAnimationFrame';
import {CubeView} from './view/components/CubeView';
import {CubeGallery} from './view/components/CubeGallery';
import {CubeImage} from './view/components/data/CubeImage';
import {CubeImageEvent} from "./view/components/events/CubeImageEvent";
import {AssetLoader} from './loaders/AssetLoader';

var TweenMax = require( 'gsap/src/uncompressed/TweenMax');
var OBJLoader = require( './utils/OBJLoader');


export class Main extends EventDispatcher
{
	constructor()
	{
		super();

		var noGLDiv = JSUtils.getId('noWebGL');

		if (!window.WebGLRenderingContext || JSUtils.isMobile() )
		{
			noGLDiv.style.visibility = 'visible';
			return;
		}

		noGLDiv.parentNode.removeChild(noGLDiv);

		this._threeView = new ThreeJSView(1024 , 2048);
		this._cubeView = new CubeView ( this._threeView );
		this._side = 1;

		document.getElementById('content').appendChild(this._threeView.renderer.domElement);

		this.raf = new RequestAnimationFrame( this.render , this );
		this.raf.start();

		this.contactImg = null;
		this.contactImgOver = null;
		this.titleImg = null;

		this.assetLoader = new AssetLoader( this._cubeView );
		this.assetLoader.queueCubeImage( './assets/images/about-text.png' , 'about-text' );
		this.assetLoader.queueCubeImage( './assets/images/header-contact.png', 'header-contact' );
		this.assetLoader.queueCubeImage( './assets/images/header-contact-rollover.png', 'header-contact-rollover' );
		this.assetLoader.queueCubeImage( './assets/images/header-title.png', 'header-title' );
		this.assetLoader.queueCubeImage( './assets/images/skills.png', 'skills' );

		this.headGallery = new CubeGallery( this._cubeView , 1 , 0 , 7000);
		this.headGallery.addImage(  './assets/images/work-gallery-image.png' );
		this.headGallery.addImage(  './assets/images/work-gallery-image-1.png' );
		this.headGallery.addImage(  './assets/images/work-gallery-image-2.png' );
		this.headGallery.addImage(  './assets/images/work-gallery-image-3.png' );
		this.headGallery.addImage(  './assets/images/work-gallery-image-4.png' );
		this.headGallery.addImage(  './assets/images/work-gallery-image-5.png' );
		this.headGallery.addImage(  './assets/images/work-gallery-image-6.png' );
		this.headGalleryTransitionCounter = 0;

		this.assetLoader.addEventListener( Event.COMPLETE , ()=>this._onAllImagesLoaded() );
		this.assetLoader.start();

	}

	//--------------------------------------------------------------------

	_loadBackground()
	{

		var material = new THREE.MeshBasicMaterial( {
			map: THREE.ImageUtils.loadTexture( './assets/images/background.jpg' ),
			color:0xffffff
		} );

		var geometry = new THREE.PlaneGeometry( 1024, 2048, 1 , 2 );

		this.mesh = new THREE.Mesh( geometry , material );
		this.mesh.position.z = 50;
		this._threeView.add( this.mesh );

	}
	/**
	 *
	 * @private
	 */
	_wipeFX()
	{

		this.headGallery.pause();

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
	 *
	 */
	_onAllImagesLoaded()
	{
		this.titleImg = this.assetLoader.getCubeImage( 'header-title' );
		this.titleImg.setImage( 1 , 0 , 0 );
		this.titleImg.show(1);

		this.contactImg = this.assetLoader.getCubeImage( 'header-contact' );
		this.contactImg.setImage( 1 ,0, this.titleImg.columnCount , true );
		this.contactImg.show( .5 , 1.5 , true );
		this.contactImg.addEventListener( CubeImageEvent.ROLL_OVER , ()=>this._onRollOverContactImage());
		this.contactImg.addEventListener( CubeImageEvent.ROLL_OUT, ()=>this._onRollOutContactImage());
		this.contactImg.addEventListener( CubeImageEvent.CLICK, ( e )=>this._onClickContactImage( e ));

		this.contactImgOver = this.assetLoader.getCubeImage( 'header-contact-rollover' );
		this.contactImgOver.setImage( 3 ,0, this.titleImg.columnCount , true );

		var aboutText = this.assetLoader.getCubeImage( 'about-text' );
			aboutText.setImage( 1 ,7 , 0 );
			aboutText.delayFunction = function ( r , c , current , total , delay )
			{
				return delay + ( ( c + 1 ) * .05 );//* .1 + ( r + 1 ) * .1 );
			};
			aboutText.show( 1 , 1 , false );

		var skillsImage = this.assetLoader.getCubeImage( 'skills' );
			skillsImage.setImage( 1 , 9 , 0 );
			skillsImage.delayFunction = function ( r , c , current , total , delay )
				{
					return delay + ( ( c + 1 ) * .1 + ( r + 1 ) * .1 );
				};
			skillsImage.show( 1 , 1 , true );
			skillsImage.addEventListener(CubeImageEvent.ANIMATION_COMPLETE, ( e )=>this._onPageAnimationComplete( e ));

		this.headGallery.start();
		this.headGallery.addEventListener(CubeImageEvent.CLICK, ( e )=>this._onClickHeadGallery( e ));
		this.headGallery.addEventListener(CubeImageEvent.ANIMATION_COMPLETE, ( e )=>this._onGalleryAnimationComplete( e ));

		this._cubeView.show( 1 , skillsImage.rowCount + skillsImage.row  , 0 , this._cubeView.rows, this._cubeView.columns , 1 , false , 0)
	}
	/**
	 *
	 * @param e
	 * @private
	 */
	_onClickHeadGallery( e )
	{
		if ( ! this.headGallery.isPaused )
			this.headGallery.showNext();
	}
	/**
	 *
	 * @private
	 */
	_onClickContactImage( e )
	{
		window.location.href = "tel:07977997629";

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
	 *
	 * @private
	 */
	_onRollOutContactImage()
	{
		this.contactImg.show( 2 , 0 , true );
		document.getElementById('content').style.cursor = "default";
	}
	/**
	 *
	 * @private
	 */
	_onRollOverContactImage()
	{
		this.contactImgOver.show( 2 , 0 , false );
		document.getElementById('content').style.cursor = "pointer";
	}
	/**
	 *
	 */
	_onGalleryAnimationComplete()
	{
		this.headGalleryTransitionCounter ++;
		if ( this.headGalleryTransitionCounter % 3 == 0 )
		{
			this._wipeFX();
		}

	}
	/**
	 *
	 */
	_onWipeComplete()
	{
		this.headGallery.resume();
	}
	/**
	 *
	 * @private
	 */
	_onPageAnimationComplete()
	{
		this._loadBackground();
	}
	/**
	 *
	 */
	render()
	{
		this._threeView.render();
	}

}