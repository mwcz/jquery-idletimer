/*
 * Copyright (c) 2009 Nicholas C. Zakas
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/*
	mousewheel (deprecated) -> IE6.0, Chrome, Opera, Safari
	DOMMouseScroll (deprecated) -> Firefox 1.0
	wheel (standard) -> Chrome 31, Firefox 17, IE9, Firefox Mobile 17.0
	
	//No need to use, use DOMMouseScroll
	MozMousePixelScroll -> Firefox 3.5, Firefox Mobile 1.0
	
	//Events
	WheelEvent -> see wheel
	MouseWheelEvent -> see mousewheel
	MouseScrollEvent -> Firefox 3.5, Firefox Mobile 1.0
*/
( function( $ ) {

$.idleTimer = function( firstParam, elem ) {
    var opts;
    if (typeof firstParam === "object") {
        opts = firstParam;
        firstParam = null;
    } else if (typeof firstParam === "number") {
        opts = { timeout: firstParam };
        firstParam = null;
    }

	// defaults that are to be stored as instance props on the elem
	opts = $.extend( {
		idle: false,              //indicates if the user is idle
		timeout: 30000,           //the amount of time (ms) before the user is considered idle
		events: "mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove" // activity is one of these events
	}, opts );


	elem = elem || document;

	var jqElem = $( elem ),
		obj = jqElem.data("idleTimerObj") || {},

		/* (intentionally not documented)
		 * Toggles the idle state and fires an appropriate event.
		 * @return {void}
		 */
		toggleIdleState = function( myelem ) {

		    var obj = $.data(elem, "idleTimerObj") || {};

		    // toggle the state
		    obj.idle = !obj.idle;

		    // store toggle state date time
		    obj.olddate = +new Date();

		    // create a custom event, with state and name space
		    var event = $.Event((obj.idle ? "idle" : "active") + ".idleTimer");

		    // trigger event on object with elem and copy of obj
		    $(elem).trigger(event, [elem, $.extend({}, obj), e]);
		},

		/**
		 * Stops the idle timer. This removes appropriate event handlers
		 * and cancels any pending timeouts.
		 * @return {void}
		 * @method stop
		 * @static
		 */
		stop = function( jqElem ) {

			var obj = jqElem.data("idleTimerObj") || {};

			//set to disabled
			obj.enabled = false;

			//clear any pending timeouts
			clearTimeout( obj.tId );

			//detach the event handlers
			jqElem.off(".idleTimer");
		};

	obj.olddate = obj.olddate || +new Date();

    // determine which function to call
	if (firstParam === null && typeof obj.idle !== "undefined") {
	    // they think they want to init, but it already is, just reset
	    reset();
	    return jqElem;
	} else if (firstParam === null) {
	    // they want to init
	} else if (firstParam !== null && typeof obj.idle === "undefined") {
	    // they want to do something, but it isnt init
	    // not sure the best way to handle this
	    return false;
	} else if ( firstParam === "destroy" ) {
		stop( jqElem );
		return this;
	} else if ( firstParam === "getElapsedTime" ) {
		return ( +new Date() ) - obj.olddate;
	}


	/* (intentionally not documented)
	 * Handles a user event indicating that the user isn't idle.
	 * @param {Event} event A DOM2-normalized event object.
	 * @return {void}
	 */
	jqElem.on( $.trim( ( opts.events + " " ).split(" ").join(".idleTimer ") ), function() {
		var obj = $.data( this, "idleTimerObj" );

		//clear any existing timeout
		clearTimeout( obj.tId );

		//if the idle timer is enabled
		if ( obj.enabled ){
			//if it's idle, that means the user is no longer idle
			if ( obj.idle ){
				toggleIdleState( this );
			}

			//set a new timeout
			obj.tId = setTimeout( toggleIdleState, obj.timeout );
		}
	});

	obj.idle = opts.idle;
	obj.enabled = opts.enabled;
	obj.timeout = opts.timeout;

	//set a timeout to toggle state. May wish to omit this in some situations
	if ( opts.startImmediately ) {
		obj.tId = setTimeout( toggleIdleState, obj.timeout );
	}

	// assume the user is active for the first x seconds.
	jqElem.data( "idleTimer", "active" );

	// store our instance on the object
	jqElem.data("idleTimerObj", obj);

	return jqElem;
};

$.fn.idleTimer = function( firstParam ) {

	if ( this[0] ){
		return $.idleTimer( firstParam, this[0] );
	}

	return this;
};

})( jQuery );
