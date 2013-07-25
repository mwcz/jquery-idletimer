(function($) {
/*
		======== A Handy Little QUnit Reference ========
		http://docs.jquery.com/QUnit

		Test methods:
			expect(numAssertions)
			stop(increment)
			start(decrement)
		Test assertions:
			ok(value, [message])
			equal(actual, expected, [message])
			notEqual(actual, expected, [message])
			deepEqual(actual, expected, [message])
			notDeepEqual(actual, expected, [message])
			strictEqual(actual, expected, [message])
			notStrictEqual(actual, expected, [message])
			raises(block, [expected], [message])
*/

	module("jQuery#idle-timer");

	asyncTest( "default behavior", function() {
		expect( 1 );

		$( document ).on( "idle.idleTimer", function(){
			ok( true, "idleTimer fires at document by default" );
			start();
			$.idleTimer( "destroy" );
		});
		$.idleTimer( 100 );
	});

	asyncTest( "Should clear timeout on keydown event", function() {
		expect( 3 );

		// trigger event every now and then to prevent going inactive
		var interval = setInterval( function()
		{
			$( document ).trigger( "keydown" );
			equal( $( document ).data( "idleTimer" ), "active", "State should be active" );
		}, 100);

		setTimeout( function()
		{
			clearTimeout( interval );
			start();
			$.idleTimer( "destroy" );
		}, 350);

		$.idleTimer( 200 );
	});

}(jQuery));
