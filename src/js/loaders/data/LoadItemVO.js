/**
 * Load Item Value Object
 */
export class LoadItemVO {

	constructor()
	{
		this.type       = null; //li.type = LoadItemVO.BRUSH // LoadItemVO.IMAGE;
		this.id         = null; // ID of asset
		this.uri        = null; // URI of asset
		this.cubeImage  = null; // Brush
		this.image      = null; // HTMLImageElement
	}
}

LoadItemVO.IMAGE = 'IMAGE';
LoadItemVO.CUBE_IMAGE = 'CUBE_IMAGE';
