
import {AppController} from "./controllers/AppController";
import {JSUtils} from '../../lib/kurst/utils/JSUtils';
export class Main
{
	constructor()
	{
		if ( this.hasWebGL() )
			this._appController = new AppController();
	}
	/**
	 *
	 * @returns {boolean}
	 */
	hasWebGL()
	{
		var noGLDiv = JSUtils.getId('noWebGL');

		if (!window.WebGLRenderingContext || JSUtils.isMobile())
		{
			noGLDiv.style.visibility = 'visible';
			return false;
		}

		noGLDiv.parentNode.removeChild(noGLDiv);

		return true;
	}

}