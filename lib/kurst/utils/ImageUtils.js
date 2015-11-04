import {ByteArray} from "./ByteArray";

export class ImageUtils {
	/**
	 * Converts an ArrayBuffer to a base64 string and makes an image from that
	 *
	 * @param image data as a ByteArray
	 *
	 * @return HTMLImageElement
	 *
	 */
	static arrayBufferToImage(data)
	{
		var byteStr = '';
		var bytes = new Uint8Array(data);
		var len = bytes.byteLength;
		for (var i = 0; i < len; i++)
			byteStr += String.fromCharCode(bytes[i]);
		var base64Image = window.btoa(byteStr);
		var str = 'data:image/png;base64,' + base64Image;
		var img = new Image();
		img.src = str;
		return img;
	}
	/**
	 * Converts an ByteArray to an Image - returns an HTMLImageElement
	 *
	 * @param image data as a ByteArray
	 *
	 * @return HTMLImageElement
	 *
	 */
	static byteArrayToImage(data)
	{
		var byteStr = '';
		var bytes = new Uint8Array(data.arraybytes);
		var len = bytes.byteLength;
		for (var i = 0; i < len; i++)
		{
			byteStr += String.fromCharCode(bytes[i]);
		}
		var base64Image = window.btoa(byteStr);
		var str = 'data:image/png;base64,' + base64Image;
		var img = new Image();
		img.src = str;
		return img;
	}
	/**
	 * Converts an Blob to an Image - returns an HTMLImageElement
	 *
	 * @param image data as a Blob
	 *
	 * @return HTMLImageElement
	 *
	 */
	static blobToImage(data)
	{
		var URLObj = window['URL'] || window['webkitURL'];
		var src = URLObj.createObjectURL(data);
		var img = new Image();
		img.src = src;
		return img;
	}

	/**
	 * Compare canvas data, source with reference. This modifies the source Uint8ClampedArray with diff image if showErrors is true
	 *
	 *
	 * @param source    - Uint8ClampedArray.data;
	 * @param reference - Uint8ClampedArray.data;
	 * @param showErrors boolean modify the source Uint8ClampedArray.data to show error differential
	 *
	 * @returns {DiffData}
	 */
	static compareCanvasData( source , reference , showErrors = false )
	{
		var diff    = new DiffData();
		var errors  = 0;

		for(var i = 0; i<reference.length; i+=4)
		{

			var sourceR = source[i];
			var sourceG = source[i+1];
			var sourceB = source[i+2];
			var sourceA = source[i+3];

			var refR = reference[i];
			var refG = reference[i+1];
			var refB = reference[i+2];
			var refA = reference[i+3];

			ImageDiff.compareComponent(sourceR , refR , showErrors , 255 ,0 );
			if ( ! ImageDiff.pixelDiff.pass ) errors ++;
			if ( showErrors ) source[i] = ImageDiff.pixelDiff.value;

			ImageDiff.compareComponent(sourceG , refG , showErrors , 0 ,0 );
			if ( ! ImageDiff.pixelDiff.pass ) errors ++;
			if ( showErrors ) source[i+1] = ImageDiff.pixelDiff.value;

			ImageDiff.compareComponent(sourceB , refB , showErrors , 0 ,0 );
			if ( ! ImageDiff.pixelDiff.pass ) errors ++;
			if ( showErrors ) source[i+2] = ImageDiff.pixelDiff.value;

			ImageDiff.compareComponent(sourceA , refA , showErrors , 255 ,255  );
			if ( ! ImageDiff.pixelDiff.pass ) errors ++;
			if ( showErrors ) source[i+3] = ImageDiff.pixelDiff.value;

		}

		diff.source             = source;
		diff.errors             = errors;
		diff.percentDifference  = ( errors / reference.length ) * 100;
		diff.pass               = ( errors == 0 );

		return diff;
	}
	/**
	 *
	 * compare pixel component data
	 *
	 * @param source        source pixel
	 * @param reference     reference pixel
	 * @param showError     boolean - show error modify source value with either errorValue or passValie
	 * @param errorValue    value to modify data with if components do not match
	 * @param passValue     value to modify data with if components match
	 *
	 * @returns {PixelDiff}
	 */
	static compareComponent( source , reference , showError = false , errorValue = 0 , passValue = 0 )
	{
		if (source == reference)
		{
			ImageDiff.pixelDiff.pass = true;

			if ( showError )
			{
				ImageDiff.pixelDiff.value = errorValue;
			}
		}
		else
		{
			ImageDiff.pixelDiff.pass = false;
			ImageDiff.pixelDiff.value = passValue;
		}

		return ImageDiff.pixelDiff;

	}
}
