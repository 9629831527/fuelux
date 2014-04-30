/*
 * Fuel UX Intelligent Bootstrap Dropdowns
 * https://github.com/ExactTarget/fuelux
 *
 * Copyright (c) 2014 ExactTarget
 * Licensed under the MIT license.
 */

// -- BEGIN UMD WRAPPER PREFACE --

// For more information on UMD visit: 
// https://github.com/umdjs/umd/blob/master/jqueryPlugin.js

(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// if AMD loader is available, register as an anonymous module.
		define(['jquery'], factory);
	} else {
		// OR use browser globals if AMD is not present
		factory(jQuery);
	}
}(function ($) {
	// -- END UMD WRAPPER PREFACE --
		
	// -- BEGIN MODULE CODE HERE --
	
	$(document.body).on("click", "[data-toggle=dropdown][data-dropauto]", function( event ) {

		if( $(this).data().dropauto === "auto" ) {
			// have the drop down decide where to place itself
			console.log($(this).next('.dropdown-menu'));
			_autoDropDown( $(this).next('.dropdown-menu') );
		}
	});

	//Intelligent suggestions dropdown
	$(document.body).on("suggest", function(event, element) {
		_autoDropDown( $(element) );
		$(element).parent().addClass('open');
	});

	function _autoDropDown( menu ) {
		// hide while the browser thinks
		$(menu).css({ visibility: "hidden" });
		// decide where to put menu
		var isDropUp = dropUpCheck( menu ) ? menu.parent().addClass("dropup") : menu.parent().removeClass("dropup");

		$(menu).css({ visibility: "visible" });
	}

	function dropUpCheck( element ) {
		// caching container
		var $container = _getContainer( element );

		// building object with measurementsances for later use
		var measurements                = {};
		measurements.parentHeight       = element.parent().outerHeight();
		measurements.parentOffsetTop    = element.parent().offset().top;
		measurements.dropdownHeight     = element.outerHeight();
		measurements.containerHeight    = $container.overflowElement.outerHeight();

		// this needs to be different if the window is the container or another element is
		measurements.containerOffsetTop = ( !! $container.isWindow ) ? $container.overflowElement.scrollTop() : $container.overflowElement.offset().top;

		// doing the calculations
		measurements.fromTop    = measurements.parentOffsetTop - measurements.containerOffsetTop;
		measurements.fromBottom = measurements.containerHeight - measurements.parentHeight - ( measurements.parentOffsetTop - measurements.containerOffsetTop );

		// actual determination of where to put menu
		// false = drop down
		// true = drop up
		if( measurements.dropdownHeight < measurements.fromBottom ) {
			return false;
		} else if ( measurements.dropdownHeight < measurements.fromTop ) {
			return true;
		} else if ( measurements.dropdownHeight >= measurements.fromTop && measurements.dropdownHeight >= measurements.fromBottom ) {
			// decide which one is bigger and put it there
			if( measurements.fromTop >= measurements.fromBottom ) {
				return true;
			} else {
				return false;
			}
		}
	}

	function _getContainer( element ) {
		var containerElement = window;
		var isWindow = true;

		$.each( element.parents(), function(index, value) {
			if( $(value).css('overflow') !== 'visible' ) {
				containerElement = value;
				isWindow = false;
				return false;
			}
		});

		return {
			overflowElement: $( containerElement ),
			isWindow: isWindow
		};
	}

// -- BEGIN UMD WRAPPER AFTERWORD --
}));
	// -- END UMD WRAPPER AFTERWORD --