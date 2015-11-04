/**
 * USAGE:
 *
 *
 *	export class PoolTest
 *	{
 *		constructor()
 *		{
 *
 *			this.counter    = 0;
 *			this.pool       = new ObjectPool( () => this.itemConstructor()  , ( item ) => this.itemDestructor( item ) , 50 , 50 );
 *			this.items      = [];
 *
 *			for ( var c = 0 ; c < 101 ; c ++ )
 *			{
 *				var item        = this.pool.pop();
 *					item.name   = 'name_c';
 *				this.items.push ( item );
 *			}
 *
 *			console.log( this.pool );
 *
 *			setTimeout(()=> this.pushBackToPool() , 10000 );
 *		}
 *
 *		pushBackToPool()
 *		{
 *			for ( var d = 0 ; d < this.items.length ; d ++ )
 *			{
 *				this.pool.push( this.items.pop() );
 *			}
 *		}
 *
 *		itemConstructor()
 *		{
 *			return new PoolTestItem( this.counter ++ );
 *		}
 *
 *		itemDestructor( item )
 *		{
 *			item.name = null;
 *		}
 *
 *	}
 *
 *	module.exports = PoolTest;
 *
 **/
class ObjectPool
{

	//------------------------------------------------------------------------------------------
	// CONSTRUCTOR
	//------------------------------------------------------------------------------------------

	/**
	 *
	 * @param cnstrctr      : Function      - Pool item function factory
	 * @param destructor    : Function      - Pool item destructor ( when pool.dispose is called )
	 * @param size          : number        - Size of pool
	 * @param resize        : number        - number of items to resize pool by
	 */
	constructor( cnstrctr , destructor , size , resize= 0)
	{

		//------------------------------------------------------------------------------------------
		// PRIVATE VARIABLES
		//------------------------------------------------------------------------------------------

		this.m_cache		= [];
		this.m_index		= new Object();

		this.m_constructor	= null;
		this.m_destructor	= null;

		this.m_size			= 0;
		this.m_resize		= 0;
		this.m_position		= 0;

		this.m_constructor = cnstrctr;
		this.m_destructor  = destructor;
		this.m_resize      = resize;

		this._expand( size );
	}

	//------------------------------------------------------------------------------------------
	// PUBLIC METHODS
	//------------------------------------------------------------------------------------------

	/**
	 * pop an item from the pool
	 */
	pop()
	{
		var o = null;

		if( this.m_position == this.m_size )
		{

			if( this.m_resize == 0 )
				throw new Error( "The pool is empty" );

			this._expand( this.m_resize );

		}

		o = this.m_cache[ this.m_position++ ];
		this.m_index[ o ] = null;

		return o;

	}
	/**
	 * push an item back to the pool
	 */
	push( o )
	{

		if( this.m_index[ o ] === undefined )
			throw new Error( "The specified object does not belong to the pool" );


		if( this.m_index[ o ] === o )
			return; // object is already in pool

		this.m_index[ o ] = o;
		this.m_cache[ --this.m_position ] = o;

	}
	/**
	 * destro the pool
	 */
	dispose()
	{
		var i = this.m_size;

		while( i-- > 0 )
		{
			this.m_destructor( this.m_cache[ i ] );
		}

		this.m_cache       = null;
		this.m_index       = null;
		this.m_constructor = null;
		this.m_destructor  = null;
		this.m_size        = 0;
		this.m_resize      = 0;
		this.m_position    = 0;

	}

	//------------------------------------------------------------------------------------------
	// PRIVATE METHODS
	//------------------------------------------------------------------------------------------

	/**
	 * _expand the pool
	 */
	_expand( count )
	{

		var i = this.m_size;
		var n = this.m_size + count;
		var o = null;

		while( i < n )
		{
			o = this.m_constructor();

			this.m_cache[ i ] = o;
			this.m_index[ o ] = o;

			i++;
		}

		this.m_size = n;
	}

	//------------------------------------------------------------------------------------------
	// GET
	//------------------------------------------------------------------------------------------

	/**
	 * Length of pool
	 */
	getLength ()
	{
		return this.m_size;
	}

}

module.exports = ObjectPool;

