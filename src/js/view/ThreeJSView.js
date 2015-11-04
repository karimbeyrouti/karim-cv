import {THREE} from 'three'

export class ThreeJSView {

	constructor(width, height)
	{
		this.width = width ;
		this.height = height;
		this._setup()
	}

	//---------------------------------------------------------------------------

	/**
	 *
	 * @param width
	 * @param height
	 */
	setSize(width, height)
	{
		this.width = width;
		this.height = height;
		this.camera.aspect = this.width / this.height;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(this.width, this.height);
	}
	/**
	 *
	 * @param obj
	 */
	add( obj )
	{
		this.scene.add( obj )
	}
	/**
	 *
	 */
	render()
	{
		this.renderer.render(this.scene, this.camera);
	}

	//---------------------------------------------------------------------------

	/**
	 *
	 * @private
	 */
	_setup() {

		this.camera = new THREE.OrthographicCamera(this.width / -2, this.width / 2, this.height / -2, this.height / 2, 0, 1000);
		this.camera.position.set(0, 0, -1);
		this.camera.rotation.x = Math.PI;

		this.renderer = new THREE.WebGLRenderer({
			alpha: true,
			premultipliedAlpha: true,
			antialias: false
		});

		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.BasicShadowMap;
		this.renderer.setClearColor(0xffffff , 1);
		this.renderer.setSize(this.width, this.height);

		this.scene = new THREE.Scene();

		this.directionalLight = new THREE.DirectionalLight( 0xffffff , 1 );
		this.directionalLight.position.x = 0;
		this.directionalLight.position.y = 0;
		this.directionalLight.position.z = 1;
		this.directionalLight.position.normalize();
		this.directionalLight.castShadow = true;
		this.directionalLight.shadowDarkness = 0.25;
		this.directionalLight.shadowBias = 0.01;

		this.mouse =new THREE.Vector3();
		this.scene.add( this.directionalLight );

	}

}
