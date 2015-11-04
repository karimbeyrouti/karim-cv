export class Delegate {
	constructor(func = null)
	{
		this._func = func;
	}
	/**
	 Creates a functions wrapper for the original function so that it runs
	 in the provided context.
	 @parameter obj Context in which to run the function.
	 @paramater func Function to run.
	 */
	static create(obj, func)
	{
		var f = function ()
		{
			return func.apply(obj, arguments);
		};
		return f;
	}

	createDelegate(obj)
	{
		return Delegate.create(obj, this._func);
	}
}
