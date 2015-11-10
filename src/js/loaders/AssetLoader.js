import {Event} from "../../../lib/kurst/events/Event";
import {ProgressEvent} from "../../../lib/kurst/events/ProgressEvent";


import {EventDispatcher} from '../../../lib/kurst/events/EventDispatcher';
import {LoadItemVO} from './data/LoadItemVO';

/**
 * Asset loader for images / cube images
 */
export class AssetLoader extends EventDispatcher {
	//------------------------------------------------------------
	constructor( cubeView )
	{
		super();

		this.cubeView = cubeView;
		this.loadItems = new Array();
		this.loadedItems = new Array();
		this.loadDelegate = () => this.onItemLoaded();

		this.loaded = false;
	}

	//------------------------------------------------------------


	/**
	 * Add an image to the load queue
	 * @uri : string - url to image
	 * @id  : any    - image id
	 */
	queueCubeImage(uri, id)
	{
		var li  = new LoadItemVO();
			li.type = LoadItemVO.CUBE_IMAGE;
			li.id   = id;
			li.uri  = uri;
		this.loadItems.push(li);
	}
	/**
	 * Start loading assets
	 */
	start()
	{
		this.loadNextItem();
	}
	/**
	 *
	 * @param id
	 */
	getImage(id)
	{
		var l = this.loadedItems.length;
		var vo;
		for (var c = 0; c < l; c++)
		{
			vo = this.loadedItems[c];
			if (vo.id == id)
			{
				return vo.image;
			}
		}
		return null;
	}
	/**
	 *
	 * @param id
	 */
	getCubeImage(id)
	{
		var l = this.loadedItems.length;
		var vo;
		for (var c = 0; c < l; c++)
		{
			vo = this.loadedItems[c];
			if (vo.id == id)
			{
				return vo.cubeImage;
			}
		}
		return null;
	}

	//------------------------------------------------------------

	loadNextItem()
	{
		if (this.loadItems.length > 0)
		{
			var li = this.loadItems.shift();
			switch (li.type)
			{
				case LoadItemVO.IMAGE:
					li.image = new Image;
					li.image.onload = this.loadDelegate;
					li.image.src = li.uri;
					break;

				case LoadItemVO.CUBE_IMAGE:
					li.cubeImage = this.cubeView.createImage();
					li.cubeImage.addEventListener( Event.COMPLETE , this.loadDelegate );
					li.cubeImage.loadImage( li.uri );
					break;

			}
			this.currentLoadItem = li;
		}
		else
		{
			//console.log( 'all assetsLoaded' , this );
			this.loaded = true;
			this.dispatchEvent(new Event(Event.COMPLETE));
		}
	}

	/**
	 *
	 */
	onItemLoaded()
	{
		var e = new ProgressEvent(ProgressEvent.PROGRESS);

		switch (this.currentLoadItem.type)
		{
			case LoadItemVO.IMAGE:
				this.currentLoadItem.image.onload = null;
				e.image = this.currentLoadItem.image;
				break;

			case LoadItemVO.CUBE_IMAGE:
				e.image = this.currentLoadItem.cubeImage;
				this.currentLoadItem.cubeImage.removeEventListener( Event.COMPLETE , this.loadDelegate );
		}

		this.dispatchEvent( e );

		this.loadedItems.push(this.currentLoadItem);
		this.currentLoadItem = null;
		this.loadNextItem();
	}
}
