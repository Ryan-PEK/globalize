/**
 * Globalize Runtime v1.3.0-alpha.5
 *
 * http://github.com/jquery/globalize
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2017-05-24T13:49Z
 */
/*!
 * Globalize Runtime v1.3.0-alpha.5 2017-05-24T13:49Z Released under the MIT license
 * http://git.io/TrdQbw
 */
(function( root, factory ) {

	"use strict";

	// UMD returnExports
	if ( typeof define === "function" && define.amd ) {

		// AMD
		define([
			"../globalize-runtime",
			"./number"
		], factory );
	} else if ( typeof exports === "object" ) {

		// Node, CommonJS
		module.exports = factory(
			require( "../globalize-runtime" ),
			require( "./number" )
		);
	} else {

		// Extend global
		factory( root.Globalize );
	}
}(this, function( Globalize ) {



var createErrorUnsupportedFeature = Globalize._createErrorUnsupportedFeature,
	looseMatching = Globalize._looseMatching,
	regexpEscape = Globalize._regexpEscape,
	removeLiteralQuotes = Globalize._removeLiteralQuotes,
	runtimeKey = Globalize._runtimeKey,
	stringPad = Globalize._stringPad,
	validateParameterPresence = Globalize._validateParameterPresence,
	validateParameterType = Globalize._validateParameterType,
	validateParameterTypeString = Globalize._validateParameterTypeString;


var validateParameterTypeDate = function( value, name ) {
	validateParameterType( value, name, value === undefined || value instanceof Date, "Date" );
};


var ZonedDateTime = (function() {
function definePrivateProperty(object, property, value) {
  Object.defineProperty(object, property, {
    value: value
  });
}

function getUntilsIndex(original, untils) {
  var index = 0;
  var originalTime = original.getTime();

  // TODO Should we do binary search for improved performance?
  while (index < untils.length - 1 && originalTime >= untils[index]) {
    index++;
  }
  return index;
}

function setWrap(fn) {
  var offset1 = this.getTimezoneOffset();
  var ret = fn();
  this.original.setTime(new Date(this.getTime()));
  var offset2 = this.getTimezoneOffset();
  this.original.setMinutes(this.original.getMinutes() + offset2 - offset1);
  return ret;
}

var ZonedDateTime = function(date, timeZoneData) {
  definePrivateProperty(this, "original", new Date(date.getTime()));
  definePrivateProperty(this, "local", new Date(date.getTime()));
  definePrivateProperty(this, "timeZoneData", timeZoneData);
  definePrivateProperty(this, "setWrap", setWrap);
  if (!(timeZoneData.untils && timeZoneData.offsets && timeZoneData.isdsts)) {
    throw new Error("Invalid IANA data");
  }
  this.setTime(this.local.getTime() - this.getTimezoneOffset() * 60 * 1000);
};

ZonedDateTime.prototype.clone = function() {
  return new ZonedDateTime(this.original, this.timeZoneData);
};

ZonedDateTime.prototype.getFullYear = function() {
  return this.local.getUTCFullYear();
};

ZonedDateTime.prototype.getMonth = function() {
  return this.local.getUTCMonth();
};

ZonedDateTime.prototype.getDate = function() {
  return this.local.getUTCDate();
};

ZonedDateTime.prototype.getDay = function() {
  return this.local.getUTCDay();
};

ZonedDateTime.prototype.getHours = function() {
  return this.local.getUTCHours();
};

ZonedDateTime.prototype.getMinutes = function() {
  return this.local.getUTCMinutes();
};

ZonedDateTime.prototype.getSeconds = function() {
  return this.local.getUTCSeconds();
};

ZonedDateTime.prototype.getMilliseconds = function() {
  return this.local.getUTCMilliseconds();
};

// Note: Define .valueOf = .getTime for arithmetic operations like date1 - date2.
ZonedDateTime.prototype.valueOf =
ZonedDateTime.prototype.getTime = function() {
  return this.local.getTime() + this.getTimezoneOffset() * 60 * 1000;
};

ZonedDateTime.prototype.getTimezoneOffset = function() {
  var index = getUntilsIndex(this.original, this.timeZoneData.untils);
  return this.timeZoneData.offsets[index];
};

ZonedDateTime.prototype.setFullYear = function(year) {
  var local = this.local;
  return this.setWrap(function() {
    return local.setUTCFullYear(year);
  });
};

ZonedDateTime.prototype.setMonth = function(month) {
  var local = this.local;
  return this.setWrap(function() {
    return local.setUTCMonth(month);
  });
};

ZonedDateTime.prototype.setDate = function(date) {
  var local = this.local;
  return this.setWrap(function() {
    return local.setUTCDate(date);
  });
};

ZonedDateTime.prototype.setHours = function(hour) {
  var local = this.local;
  return this.setWrap(function() {
    return local.setUTCHours(hour);
  });
};

ZonedDateTime.prototype.setMinutes = function(minutes) {
  var local = this.local;
  return this.setWrap(function() {
    return local.setUTCMinutes(minutes);
  });
};

ZonedDateTime.prototype.setSeconds = function(seconds) {
  var local = this.local;

  // setWrap is needed here just because abs(seconds) could be >= a minute.
  return this.setWrap(function() {
    return local.setUTCSeconds(seconds);
  });
};

ZonedDateTime.prototype.setMilliseconds = function(milliseconds) {
  var local = this.local;

  // setWrap is needed here just because abs(seconds) could be >= a minute.
  return this.setWrap(function() {
    return local.setUTCMilliseconds(milliseconds);
  });
};

ZonedDateTime.prototype.setTime = function(time) {
  return this.local.setTime(time);
};

ZonedDateTime.prototype.isDST = function() {
  var index = getUntilsIndex(this.original, this.timeZoneData.untils);
  return Boolean(this.timeZoneData.isdsts[index]);
};

ZonedDateTime.prototype.inspect = function() {
  var index = getUntilsIndex(this.original, this.timeZoneData.untils);
  var abbrs = this.timeZoneData.abbrs;
  return this.local.toISOString().replace(/Z$/, "") + " " +
    (abbrs && abbrs[index] + " " || (this.getTimezoneOffset() * -1) + " ") +
    (this.isDST() ? "(daylight savings)" : "");
};

return ZonedDateTime;
}());


/**
 * dayOfWeek( date, firstDay )
 *
 * @date
 *
 * @firstDay the result of `dateFirstDayOfWeek( cldr )`
 *
 * Return the day of the week normalized by the territory's firstDay [0-6].
 * Eg for "mon":
 * - return 0 if territory is GB, or BR, or DE, or FR (week starts on "mon");
 * - return 1 if territory is US (week starts on "sun");
 * - return 2 if territory is EG (week starts on "sat");
 */
var dateDayOfWeek = function( date, firstDay ) {
	return ( date.getDay() - firstDay + 7 ) % 7;
};




/**
 * distanceInDays( from, to )
 *
 * Return the distance in days between from and to Dates.
 */
var dateDistanceInDays = function( from, to ) {
	var inDays = 864e5;
	return ( to.getTime() - from.getTime() ) / inDays;
};




/**
 * startOf changes the input to the beginning of the given unit.
 *
 * For example, starting at the start of a day, resets hours, minutes
 * seconds and milliseconds to 0. Starting at the month does the same, but
 * also sets the date to 1.
 *
 * Returns the modified date
 */
var dateStartOf = function( date, unit ) {
	date = date instanceof ZonedDateTime ? date.clone() : new Date( date.getTime() );
	switch ( unit ) {
		case "year":
			date.setMonth( 0 );
		/* falls through */
		case "month":
			date.setDate( 1 );
		/* falls through */
		case "day":
			date.setHours( 0 );
		/* falls through */
		case "hour":
			date.setMinutes( 0 );
		/* falls through */
		case "minute":
			date.setSeconds( 0 );
		/* falls through */
		case "second":
			date.setMilliseconds( 0 );
	}
	return date;
};




/**
 * dayOfYear
 *
 * Return the distance in days of the date to the begin of the year [0-d].
 */
var dateDayOfYear = function( date ) {
	return Math.floor( dateDistanceInDays( dateStartOf( date, "year" ), date ) );
};




/**
 * Returns a new object created by using `object`'s values as keys, and the keys as values.
 */
var objectInvert = function( object, fn ) {
	fn = fn || function( object, key, value ) {
		object[ value ] = key;
		return object;
	};
	return Object.keys( object ).reduce(function( newObject, key ) {
		return fn( newObject, key, object[ key ] );
	}, {});
};




// Invert key and values, e.g., {"year": "yY"} ==> {"y": "year", "Y": "year"}
var dateFieldsMap = objectInvert({
	"era": "G",
	"year": "yY",
	"quarter": "qQ",
	"month": "ML",
	"week": "wW",
	"day": "dDF",
	"weekday": "ecE",
	"dayperiod": "a",
	"hour": "hHkK",
	"minute": "m",
	"second": "sSA",
	"zone": "zvVOxX"
}, function( object, key, value ) {
	value.split( "" ).forEach(function( symbol ) {
		object[ symbol ] = key;
	});
	return object;
});




/**
 * millisecondsInDay
 */
var dateMillisecondsInDay = function( date ) {

	// TODO Handle daylight savings discontinuities
	return date - dateStartOf( date, "day" );
};




var datePatternRe = ( /([a-z])\1*|'([^']|'')+'|''|./ig );




/**
 * hourFormat( date, format, timeSeparator, formatNumber )
 *
 * Return date's timezone offset according to the format passed.
 * Eg for format when timezone offset is 180:
 * - "+H;-H": -3
 * - "+HHmm;-HHmm": -0300
 * - "+HH:mm;-HH:mm": -03:00
 * - "+HH:mm:ss;-HH:mm:ss": -03:00:00
 */
var dateTimezoneHourFormat = function( date, format, timeSeparator, formatNumber ) {
	var absOffset,
		offset = date.getTimezoneOffset();

	absOffset = Math.abs( offset );
	formatNumber = formatNumber || {
		1: function( value ) {
			return stringPad( value, 1 );
		},
		2: function( value ) {
			return stringPad( value, 2 );
		}
	};

	return format

		// Pick the correct sign side (+ or -).
		.split( ";" )[ offset > 0 ? 1 : 0 ]

		// Localize time separator
		.replace( ":", timeSeparator )

		// Update hours offset.
		.replace( /HH?/, function( match ) {
			return formatNumber[ match.length ]( Math.floor( absOffset / 60 ) );
		})

		// Update minutes offset and return.
		.replace( /mm/, function() {
			return formatNumber[ 2 ]( Math.floor( absOffset % 60 ) );
		})

		// Update minutes offset and return.
		.replace( /ss/, function() {
			return formatNumber[ 2 ]( Math.floor( absOffset % 1 * 60 ) );
		});
};




var dateWeekDays = [ "sun", "mon", "tue", "wed", "thu", "fri", "sat" ];




/**
 * format( date, properties )
 *
 * @date [Date instance].
 *
 * @properties
 *
 * TODO Support other calendar types.
 *
 * Disclosure: this function borrows excerpts of dojo/date/locale.
 */
var dateFormat = function( date, numberFormatters, properties ) {
	var parts = [];

	var timeSeparator = properties.timeSeparator;

	// create globalize date with given timezone data
	if ( properties.timeZoneData ) {
		date = new ZonedDateTime( date, properties.timeZoneData() );
	}

	properties.pattern.replace( datePatternRe, function( current ) {
		var aux, dateField, type, value,
			chr = current.charAt( 0 ),
			length = current.length;

		if ( chr === "j" ) {

			// Locale preferred hHKk.
			// http://www.unicode.org/reports/tr35/tr35-dates.html#Time_Data
			chr = properties.preferredTime;
		}

		if ( chr === "Z" ) {

			// Z..ZZZ: same as "xxxx".
			if ( length < 4 ) {
				chr = "x";
				length = 4;

			// ZZZZ: same as "OOOO".
			} else if ( length < 5 ) {
				chr = "O";
				length = 4;

			// ZZZZZ: same as "XXXXX"
			} else {
				chr = "X";
				length = 5;
			}
		}

		// z...zzz: "{shortRegion}", e.g., "PST" or "PDT".
		// zzzz: "{regionName} {Standard Time}" or "{regionName} {Daylight Time}",
		//       e.g., "Pacific Standard Time" or "Pacific Daylight Time".
		if ( chr === "z" ) {
			if ( date.isDST ) {
				value = date.isDST() ? properties.daylightTzName : properties.standardTzName;
			}

			// Fall back to "O" format.
			if ( !value ) {
				chr = "O";
				if ( length < 4 ) {
					length = 1;
				}
			}
		}

		switch ( chr ) {

			// Era
			case "G":
				value = properties.eras[ date.getFullYear() < 0 ? 0 : 1 ];
				break;

			// Year
			case "y":

				// Plain year.
				// The length specifies the padding, but for two letters it also specifies the
				// maximum length.
				value = date.getFullYear();
				if ( length === 2 ) {
					value = String( value );
					value = +value.substr( value.length - 2 );
				}
				break;

			case "Y":

				// Year in "Week of Year"
				// The length specifies the padding, but for two letters it also specifies the
				// maximum length.
				// yearInWeekofYear = date + DaysInAWeek - (dayOfWeek - firstDay) - minDays
				value = new Date( date.getTime() );
				value.setDate(
					value.getDate() + 7 -
					dateDayOfWeek( date, properties.firstDay ) -
					properties.firstDay -
					properties.minDays
				);
				value = value.getFullYear();
				if ( length === 2 ) {
					value = String( value );
					value = +value.substr( value.length - 2 );
				}
				break;

			// Quarter
			case "Q":
			case "q":
				value = Math.ceil( ( date.getMonth() + 1 ) / 3 );
				if ( length > 2 ) {
					value = properties.quarters[ chr ][ length ][ value ];
				}
				break;

			// Month
			case "M":
			case "L":
				value = date.getMonth() + 1;
				if ( length > 2 ) {
					value = properties.months[ chr ][ length ][ value ];
				}
				break;

			// Week
			case "w":

				// Week of Year.
				// woy = ceil( ( doy + dow of 1/1 ) / 7 ) - minDaysStuff ? 1 : 0.
				// TODO should pad on ww? Not documented, but I guess so.
				value = dateDayOfWeek( dateStartOf( date, "year" ), properties.firstDay );
				value = Math.ceil( ( dateDayOfYear( date ) + value ) / 7 ) -
					( 7 - value >= properties.minDays ? 0 : 1 );
				break;

			case "W":

				// Week of Month.
				// wom = ceil( ( dom + dow of `1/month` ) / 7 ) - minDaysStuff ? 1 : 0.
				value = dateDayOfWeek( dateStartOf( date, "month" ), properties.firstDay );
				value = Math.ceil( ( date.getDate() + value ) / 7 ) -
					( 7 - value >= properties.minDays ? 0 : 1 );
				break;

			// Day
			case "d":
				value = date.getDate();
				break;

			case "D":
				value = dateDayOfYear( date ) + 1;
				break;

			case "F":

				// Day of Week in month. eg. 2nd Wed in July.
				value = Math.floor( date.getDate() / 7 ) + 1;
				break;

			// Week day
			case "e":
			case "c":
				if ( length <= 2 ) {

					// Range is [1-7] (deduced by example provided on documentation)
					// TODO Should pad with zeros (not specified in the docs)?
					value = dateDayOfWeek( date, properties.firstDay ) + 1;
					break;
				}

			/* falls through */
			case "E":
				value = dateWeekDays[ date.getDay() ];
				value = properties.days[ chr ][ length ][ value ];
				break;

			// Period (AM or PM)
			case "a":
				value = properties.dayPeriods[ date.getHours() < 12 ? "am" : "pm" ];
				break;

			// Hour
			case "h": // 1-12
				value = ( date.getHours() % 12 ) || 12;
				break;

			case "H": // 0-23
				value = date.getHours();
				break;

			case "K": // 0-11
				value = date.getHours() % 12;
				break;

			case "k": // 1-24
				value = date.getHours() || 24;
				break;

			// Minute
			case "m":
				value = date.getMinutes();
				break;

			// Second
			case "s":
				value = date.getSeconds();
				break;

			case "S":
				value = Math.round( date.getMilliseconds() * Math.pow( 10, length - 3 ) );
				break;

			case "A":
				value = Math.round( dateMillisecondsInDay( date ) * Math.pow( 10, length - 3 ) );
				break;

			// Zone
			case "z":
				break;

			case "v":

				// v...vvv: "{shortRegion}", eg. "PT".
				// vvvv: "{regionName} {Time}",
				//       e.g., "Pacific Time".
				if ( properties.genericTzName ) {
					value = properties.genericTzName;
					break;
				}

			/* falls through */
			case "V":

				//VVVV: "{explarCity} {Time}", e.g., "Los Angeles Time"
				if ( properties.timeZoneName ) {
					value = properties.timeZoneName;
					break;
				}

				if ( current === "v" ) {
					length = 1;
				}

			/* falls through */
			case "O":

				// O: "{gmtFormat}+H;{gmtFormat}-H" or "{gmtZeroFormat}", eg. "GMT-8" or "GMT".
				// OOOO: "{gmtFormat}{hourFormat}" or "{gmtZeroFormat}", eg. "GMT-08:00" or "GMT".
				if ( date.getTimezoneOffset() === 0 ) {
					value = properties.gmtZeroFormat;
				} else {

					// If O..OOO and timezone offset has non-zero minutes, show minutes.
					if ( length < 4 ) {
						aux = date.getTimezoneOffset();
						aux = properties.hourFormat[ aux % 60 - aux % 1 === 0 ? 0 : 1 ];
					} else {
						aux = properties.hourFormat;
					}

					value = dateTimezoneHourFormat(
						date,
						aux,
						timeSeparator,
						numberFormatters
					);
					value = properties.gmtFormat.replace( /\{0\}/, value );
				}
				break;

			case "X":

				// Same as x*, except it uses "Z" for zero offset.
				if ( date.getTimezoneOffset() === 0 ) {
					value = "Z";
					break;
				}

			/* falls through */
			case "x":

				// x: hourFormat("+HH[mm];-HH[mm]")
				// xx: hourFormat("+HHmm;-HHmm")
				// xxx: hourFormat("+HH:mm;-HH:mm")
				// xxxx: hourFormat("+HHmm[ss];-HHmm[ss]")
				// xxxxx: hourFormat("+HH:mm[:ss];-HH:mm[:ss]")
				aux = date.getTimezoneOffset();

				// If x and timezone offset has non-zero minutes, use xx (i.e., show minutes).
				if ( length === 1 && aux % 60 - aux % 1 !== 0 ) {
					length += 1;
				}

				// If (xxxx or xxxxx) and timezone offset has zero seconds, use xx or xxx
				// respectively (i.e., don't show optional seconds).
				if ( ( length === 4 || length === 5 ) && aux % 1 === 0 ) {
					length -= 2;
				}

				value = [
					"+HH;-HH",
					"+HHmm;-HHmm",
					"+HH:mm;-HH:mm",
					"+HHmmss;-HHmmss",
					"+HH:mm:ss;-HH:mm:ss"
				][ length - 1 ];

				value = dateTimezoneHourFormat( date, value, ":" );
				break;

			// timeSeparator
			case ":":
				value = timeSeparator;
				break;

			// ' literals.
			case "'":
				value = removeLiteralQuotes( current );
				break;

			// Anything else is considered a literal, including [ ,:/.@#], chinese, japonese, and
			// arabic characters.
			default:
				value = current;

		}
		if ( typeof value === "number" ) {
			value = numberFormatters[ length ]( value );
		}

		dateField = dateFieldsMap[ chr ];
		type = dateField ? dateField : "literal";

		// Concat two consecutive literals
		if ( type === "literal" && parts.length && parts[ parts.length - 1 ].type === "literal" ) {
			parts[ parts.length - 1 ].value += value;
			return;
		}

		parts.push( { type: type, value: value } );

	});

	return parts;

};




var dateFormatterFn = function( dateToPartsFormatter ) {
	return function dateFormatter( value ) {
		return dateToPartsFormatter( value ).map( function( part ) {
			return part.value;
		}).join( "" );
	};
};




/**
 * isLeapYear( year )
 *
 * @year [Number]
 *
 * Returns an indication whether the specified year is a leap year.
 */
var dateIsLeapYear = function( year ) {
	return new Date( year, 1, 29 ).getMonth() === 1;
};




/**
 * lastDayOfMonth( date )
 *
 * @date [Date]
 *
 * Return the last day of the given date's month
 */
var dateLastDayOfMonth = function( date ) {
	return new Date( date.getFullYear(), date.getMonth() + 1, 0 ).getDate();
};




/**
 * Differently from native date.setDate(), this function returns a date whose
 * day remains inside the month boundaries. For example:
 *
 * setDate( FebDate, 31 ): a "Feb 28" date.
 * setDate( SepDate, 31 ): a "Sep 30" date.
 */
var dateSetDate = function( date, day ) {
	var lastDay = new Date( date.getFullYear(), date.getMonth() + 1, 0 ).getDate();

	date.setDate( day < 1 ? 1 : day < lastDay ? day : lastDay );
};




/**
 * Differently from native date.setMonth(), this function adjusts date if
 * needed, so final month is always the one set.
 *
 * setMonth( Jan31Date, 1 ): a "Feb 28" date.
 * setDate( Jan31Date, 8 ): a "Sep 30" date.
 */
var dateSetMonth = function( date, month ) {
	var originalDate = date.getDate();

	date.setDate( 1 );
	date.setMonth( month );
	dateSetDate( date, originalDate );
};




var outOfRange = function( value, low, high ) {
	return value < low || value > high;
};




/**
 * parse( value, tokens, properties )
 *
 * @value [String] string date.
 *
 * @tokens [Object] tokens returned by date/tokenizer.
 *
 * @properties [Object] output returned by date/tokenizer-properties.
 *
 * ref: http://www.unicode.org/reports/tr35/tr35-dates.html#Date_Format_Patterns
 */
var dateParse = function( value, tokens, properties ) {
	var amPm, day, daysOfYear, month, era, hour, hour12, timezoneOffset, valid,
		YEAR = 0,
		MONTH = 1,
		DAY = 2,
		HOUR = 3,
		MINUTE = 4,
		SECOND = 5,
		MILLISECONDS = 6,
		date = new Date(),
		truncateAt = [],
		units = [ "year", "month", "day", "hour", "minute", "second", "milliseconds" ];

	// Create globalize date with given timezone data.
	if ( properties.timeZoneData ) {
		date = new ZonedDateTime( date, properties.timeZoneData() );
	}

	if ( !tokens.length ) {
		return null;
	}

	valid = tokens.every(function( token ) {
		var century, chr, value, length;

		if ( token.type === "literal" ) {

			// continue
			return true;
		}

		chr = token.type.charAt( 0 );
		length = token.type.length;

		if ( chr === "j" ) {

			// Locale preferred hHKk.
			// http://www.unicode.org/reports/tr35/tr35-dates.html#Time_Data
			chr = properties.preferredTimeData;
		}

		switch ( chr ) {

			// Era
			case "G":
				truncateAt.push( YEAR );
				era = +token.value;
				break;

			// Year
			case "y":
				value = token.value;
				if ( length === 2 ) {
					if ( outOfRange( value, 0, 99 ) ) {
						return false;
					}

					// mimic dojo/date/locale: choose century to apply, according to a sliding
					// window of 80 years before and 20 years after present year.
					century = Math.floor( date.getFullYear() / 100 ) * 100;
					value += century;
					if ( value > date.getFullYear() + 20 ) {
						value -= 100;
					}
				}
				date.setFullYear( value );
				truncateAt.push( YEAR );
				break;

			case "Y": // Year in "Week of Year"
				throw createErrorUnsupportedFeature({
					feature: "year pattern `" + chr + "`"
				});

			// Quarter (skip)
			case "Q":
			case "q":
				break;

			// Month
			case "M":
			case "L":
				if ( length <= 2 ) {
					value = token.value;
				} else {
					value = +token.value;
				}
				if ( outOfRange( value, 1, 12 ) ) {
					return false;
				}

				// Setting the month later so that we have the correct year and can determine
				// the correct last day of February in case of leap year.
				month = value;
				truncateAt.push( MONTH );
				break;

			// Week (skip)
			case "w": // Week of Year.
			case "W": // Week of Month.
				break;

			// Day
			case "d":
				day = token.value;
				truncateAt.push( DAY );
				break;

			case "D":
				daysOfYear = token.value;
				truncateAt.push( DAY );
				break;

			case "F":

				// Day of Week in month. eg. 2nd Wed in July.
				// Skip
				break;

			// Week day
			case "e":
			case "c":
			case "E":

				// Skip.
				// value = arrayIndexOf( dateWeekDays, token.value );
				break;

			// Period (AM or PM)
			case "a":
				amPm = token.value;
				break;

			// Hour
			case "h": // 1-12
				value = token.value;
				if ( outOfRange( value, 1, 12 ) ) {
					return false;
				}
				hour = hour12 = true;
				date.setHours( value === 12 ? 0 : value );
				truncateAt.push( HOUR );
				break;

			case "K": // 0-11
				value = token.value;
				if ( outOfRange( value, 0, 11 ) ) {
					return false;
				}
				hour = hour12 = true;
				date.setHours( value );
				truncateAt.push( HOUR );
				break;

			case "k": // 1-24
				value = token.value;
				if ( outOfRange( value, 1, 24 ) ) {
					return false;
				}
				hour = true;
				date.setHours( value === 24 ? 0 : value );
				truncateAt.push( HOUR );
				break;

			case "H": // 0-23
				value = token.value;
				if ( outOfRange( value, 0, 23 ) ) {
					return false;
				}
				hour = true;
				date.setHours( value );
				truncateAt.push( HOUR );
				break;

			// Minute
			case "m":
				value = token.value;
				if ( outOfRange( value, 0, 59 ) ) {
					return false;
				}
				date.setMinutes( value );
				truncateAt.push( MINUTE );
				break;

			// Second
			case "s":
				value = token.value;
				if ( outOfRange( value, 0, 59 ) ) {
					return false;
				}
				date.setSeconds( value );
				truncateAt.push( SECOND );
				break;

			case "A":
				date.setHours( 0 );
				date.setMinutes( 0 );
				date.setSeconds( 0 );

			/* falls through */
			case "S":
				value = Math.round( token.value * Math.pow( 10, 3 - length ) );
				date.setMilliseconds( value );
				truncateAt.push( MILLISECONDS );
				break;

			// Zone
			case "z":
			case "Z":
			case "O":
			case "v":
			case "V":
			case "X":
			case "x":
				if ( typeof token.value === "number" ) {
					timezoneOffset = token.value;
				}
				break;
		}

		return true;
	});

	if ( !valid ) {
		return null;
	}

	// 12-hour format needs AM or PM, 24-hour format doesn't, ie. return null
	// if amPm && !hour12 || !amPm && hour12.
	if ( hour && !( !amPm ^ hour12 ) ) {
		return null;
	}

	if ( era === 0 ) {

		// 1 BC = year 0
		date.setFullYear( date.getFullYear() * -1 + 1 );
	}

	if ( month !== undefined ) {
		dateSetMonth( date, month - 1 );
	}

	if ( day !== undefined ) {
		if ( outOfRange( day, 1, dateLastDayOfMonth( date ) ) ) {
			return null;
		}
		date.setDate( day );
	} else if ( daysOfYear !== undefined ) {
		if ( outOfRange( daysOfYear, 1, dateIsLeapYear( date.getFullYear() ) ? 366 : 365 ) ) {
			return null;
		}
		date.setMonth( 0 );
		date.setDate( daysOfYear );
	}

	if ( hour12 && amPm === "pm" ) {
		date.setHours( date.getHours() + 12 );
	}

	if ( timezoneOffset !== undefined ) {
		date.setMinutes( date.getMinutes() + timezoneOffset - date.getTimezoneOffset() );
	}

	// Truncate date at the most precise unit defined. Eg.
	// If value is "12/31", and pattern is "MM/dd":
	// => new Date( <current Year>, 12, 31, 0, 0, 0, 0 );
	truncateAt = Math.max.apply( null, truncateAt );
	date = dateStartOf( date, units[ truncateAt ] );

	// Get date back from globalize date.
	if ( date instanceof ZonedDateTime ) {

		// TODO can we improve this? E.g., toDate()
		date = new Date( date.getTime() );
	}

	return date;
};




/**
 * Generated by:
 *
 * regenerate().add( require( "unicode-7.0.0/categories/N/symbols" ) ).toString();
 *
 * https://github.com/mathiasbynens/regenerate
 * https://github.com/mathiasbynens/unicode-7.0.0
 */
var regexpN = /[0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]|\uD800[\uDD07-\uDD33\uDD40-\uDD78\uDD8A\uDD8B\uDEE1-\uDEFB\uDF20-\uDF23\uDF41\uDF4A\uDFD1-\uDFD5]|\uD801[\uDCA0-\uDCA9]|\uD802[\uDC58-\uDC5F\uDC79-\uDC7F\uDCA7-\uDCAF\uDD16-\uDD1B\uDE40-\uDE47\uDE7D\uDE7E\uDE9D-\uDE9F\uDEEB-\uDEEF\uDF58-\uDF5F\uDF78-\uDF7F\uDFA9-\uDFAF]|\uD803[\uDE60-\uDE7E]|\uD804[\uDC52-\uDC6F\uDCF0-\uDCF9\uDD36-\uDD3F\uDDD0-\uDDD9\uDDE1-\uDDF4\uDEF0-\uDEF9]|\uD805[\uDCD0-\uDCD9\uDE50-\uDE59\uDEC0-\uDEC9]|\uD806[\uDCE0-\uDCF2]|\uD809[\uDC00-\uDC6E]|\uD81A[\uDE60-\uDE69\uDF50-\uDF59\uDF5B-\uDF61]|\uD834[\uDF60-\uDF71]|\uD835[\uDFCE-\uDFFF]|\uD83A[\uDCC7-\uDCCF]|\uD83C[\uDD00-\uDD0C]/;




/**
 * tokenizer( value, numberParser, properties )
 *
 * @value [String] string date.
 *
 * @numberParser [Function]
 *
 * @properties [Object] output returned by date/tokenizer-properties.
 *
 * Returns an Array of tokens, eg. value "5 o'clock PM", pattern "h 'o''clock' a":
 * [{
 *   type: "h",
 *   lexeme: "5"
 * }, {
 *   type: "literal",
 *   lexeme: " "
 * }, {
 *   type: "literal",
 *   lexeme: "o'clock"
 * }, {
 *   type: "literal",
 *   lexeme: " "
 * }, {
 *   type: "a",
 *   lexeme: "PM",
 *   value: "pm"
 * }]
 *
 * OBS: lexeme's are always String and may return invalid ranges depending of the token type.
 * Eg. "99" for month number.
 *
 * Return an empty Array when not successfully parsed.
 */
var dateTokenizer = function( value, numberParser, properties ) {
	var valid,
		timeSeparator = properties.timeSeparator,
		tokens = [],
		widths = [ "abbreviated", "wide", "narrow" ];

	function regexpSourceSomeTerm( terms ) {
		return "(" + terms.filter(function( item ) {
			return item;
		}).reduce(function( memo, item ) {
			return memo + "|" + item;
		}) + ")";
	}

	value = looseMatching( value );

	valid = properties.pattern.match( datePatternRe ).every(function( current ) {
		var aux, chr, length, numeric, tokenRe,
			token = {};

		function hourFormatParse( tokenRe, numberParser ) {
			var aux = value.match( tokenRe );
			numberParser = numberParser || function( value ) {
				return +value;
			};

			if ( !aux ) {
				return false;
			}

			// hourFormat containing H only, e.g., `+H;-H`
			if ( aux.length < 8 ) {
				token.value =
					( aux[ 1 ] ? -numberParser( aux[ 1 ] ) : numberParser( aux[ 4 ] ) ) * 60;

			// hourFormat containing H and m, e.g., `+HHmm;-HHmm`
			} else {
				token.value =
					( aux[ 1 ] ? -numberParser( aux[ 1 ] ) : numberParser( aux[ 7 ] ) ) * 60 +
					( aux[ 1 ] ? -numberParser( aux[ 4 ] ) : numberParser( aux[ 10 ] ) );
			}

			return true;
		}

		// Transform:
		// - "+H;-H" -> /\+(\d\d?)|-(\d\d?)/
		// - "+HH;-HH" -> /\+(\d\d)|-(\d\d)/
		// - "+HHmm;-HHmm" -> /\+(\d\d)(\d\d)|-(\d\d)(\d\d)/
		// - "+HH:mm;-HH:mm" -> /\+(\d\d):(\d\d)|-(\d\d):(\d\d)/
		//
		// If gmtFormat is GMT{0}, the regexp must fill {0} in each side, e.g.:
		// - "+H;-H" -> /GMT\+(\d\d?)|GMT-(\d\d?)/
		function hourFormatRe( hourFormat, gmtFormat, timeSeparator ) {
			var re;

			if ( !gmtFormat ) {
				gmtFormat = "{0}";
			}

			re = hourFormat
				.replace( "+", "\\+" )

				// Unicode equivalent to (\\d\\d)
				.replace( /HH|mm/g, "((" + regexpN.source + ")(" + regexpN.source + "))" )

				// Unicode equivalent to (\\d\\d?)
				.replace( /H|m/g, "((" + regexpN.source + ")(" + regexpN.source + ")?)" );

			if ( timeSeparator ) {
				re = re.replace( /:/g, timeSeparator );
			}

			re = re.split( ";" ).map(function( part ) {
				return gmtFormat.replace( "{0}", part );
			}).join( "|" );

			return new RegExp( re );
		}

		function oneDigitIfLengthOne() {
			if ( length === 1 ) {

				// Unicode equivalent to /\d/
				numeric = true;
				return tokenRe = regexpN;
			}
		}

		function oneOrTwoDigitsIfLengthOne() {
			if ( length === 1 ) {

				// Unicode equivalent to /\d\d?/
				numeric = true;
				return tokenRe = new RegExp( "(" + regexpN.source + "){1,2}" );
			}
		}

		function oneOrTwoDigitsIfLengthOneOrTwo() {
			if ( length === 1 || length === 2 ) {

				// Unicode equivalent to /\d\d?/
				numeric = true;
				return tokenRe = new RegExp( "(" + regexpN.source + "){1,2}" );
			}
		}

		function twoDigitsIfLengthTwo() {
			if ( length === 2 ) {

				// Unicode equivalent to /\d\d/
				numeric = true;
				return tokenRe = new RegExp( "(" + regexpN.source + "){2}" );
			}
		}

		// Brute-force test every locale entry in an attempt to match the given value.
		// Return the first found one (and set token accordingly), or null.
		function lookup( path ) {
			var array = properties[ path.join( "/" ) ];

			if ( !array ) {
				return null;
			}

			// array of pairs [key, value] sorted by desc value length.
			array.some(function( item ) {
				var valueRe = item[ 1 ];
				if ( valueRe.test( value ) ) {
					token.value = item[ 0 ];
					tokenRe = item[ 1 ];
					return true;
				}
			});
			return null;
		}

		token.type = current;
		chr = current.charAt( 0 );
		length = current.length;

		if ( chr === "Z" ) {

			// Z..ZZZ: same as "xxxx".
			if ( length < 4 ) {
				chr = "x";
				length = 4;

			// ZZZZ: same as "OOOO".
			} else if ( length < 5 ) {
				chr = "O";
				length = 4;

			// ZZZZZ: same as "XXXXX"
			} else {
				chr = "X";
				length = 5;
			}
		}

		if ( chr === "z" ) {
			var standardTzName = properties.standardTzName;
			var daylightTzName = properties.daylightTzName;
			if ( standardTzName || daylightTzName ) {
				token.value = null;
				tokenRe = new RegExp(
					regexpSourceSomeTerm([ standardTzName, daylightTzName ])
				);
			}
		}

		// v...vvv: "{shortRegion}", eg. "PT".
		// vvvv: "{regionName} {Time}" or "{regionName} {Time}",
		// e.g., "Pacific Time"
		// http://unicode.org/reports/tr35/tr35-dates.html#Date_Format_Patterns
		if ( chr === "v" ) {
			if ( properties.genericTzName ) {
				token.value = null;
				tokenRe = new RegExp( properties.genericTzName );

			// Fall back to "V" format.
			} else {
				chr = "V";
				length = 4;
			}
		}

		if ( chr === "V" && properties.timeZoneName ) {
			token.value = length === 2 ? properties.timeZoneName : null;
			tokenRe = new RegExp( properties.timeZoneName );
		}

		switch ( chr ) {

			// Era
			case "G":
				lookup([
					"gregorian/eras",
					length <= 3 ? "eraAbbr" : ( length === 4 ? "eraNames" : "eraNarrow" )
				]);
				break;

			// Year
			case "y":
			case "Y":
				numeric = true;

				// number l=1:+, l=2:{2}, l=3:{3,}, l=4:{4,}, ...
				if ( length === 1 ) {

					// Unicode equivalent to /\d+/.
					tokenRe = new RegExp( "(" + regexpN.source + ")+" );
				} else if ( length === 2 ) {

					// Lenient parsing: there's no year pattern to indicate non-zero-padded 2-digits
					// year, so parser accepts both zero-padded and non-zero-padded for `yy`.
					//
					// Unicode equivalent to /\d\d?/
					tokenRe = new RegExp( "(" + regexpN.source + "){1,2}" );
				} else {

					// Unicode equivalent to /\d{length,}/
					tokenRe = new RegExp( "(" + regexpN.source + "){" + length + ",}" );
				}
				break;

			// Quarter
			case "Q":
			case "q":

				// number l=1:{1}, l=2:{2}.
				// lookup l=3...
				oneDigitIfLengthOne() || twoDigitsIfLengthTwo() ||
					lookup([
						"gregorian/quarters",
						chr === "Q" ? "format" : "stand-alone",
						widths[ length - 3 ]
					]);
				break;

			// Month
			case "M":
			case "L":

				// number l=1:{1,2}, l=2:{2}.
				// lookup l=3...
				//
				// Lenient parsing: skeleton "yMd" (i.e., one M) may include MM for the pattern,
				// therefore parser accepts both zero-padded and non-zero-padded for M and MM.
				// Similar for L.
				oneOrTwoDigitsIfLengthOneOrTwo() || lookup([
					"gregorian/months",
					chr === "M" ? "format" : "stand-alone",
					widths[ length - 3 ]
				]);
				break;

			// Day
			case "D":

				// number {l,3}.
				if ( length <= 3 ) {

					// Equivalent to /\d{length,3}/
					numeric = true;
					tokenRe = new RegExp( "(" + regexpN.source + "){" + length + ",3}" );
				}
				break;

			case "W":
			case "F":

				// number l=1:{1}.
				oneDigitIfLengthOne();
				break;

			// Week day
			case "e":
			case "c":

				// number l=1:{1}, l=2:{2}.
				// lookup for length >=3.
				if ( length <= 2 ) {
					oneDigitIfLengthOne() || twoDigitsIfLengthTwo();
					break;
				}

			/* falls through */
			case "E":
				if ( length === 6 ) {

					// Note: if short day names are not explicitly specified, abbreviated day
					// names are used instead http://www.unicode.org/reports/tr35/tr35-dates.html#months_days_quarters_eras
					lookup([
						"gregorian/days",
						[ chr === "c" ? "stand-alone" : "format" ],
						"short"
					]) || lookup([
						"gregorian/days",
						[ chr === "c" ? "stand-alone" : "format" ],
						"abbreviated"
					]);
				} else {
					lookup([
						"gregorian/days",
						[ chr === "c" ? "stand-alone" : "format" ],
						widths[ length < 3 ? 0 : length - 3 ]
					]);
				}
				break;

			// Period (AM or PM)
			case "a":
				lookup([
					"gregorian/dayPeriods/format/wide"
				]);
				break;

			// Week
			case "w":

				// number l1:{1,2}, l2:{2}.
				oneOrTwoDigitsIfLengthOne() || twoDigitsIfLengthTwo();
				break;

			// Day, Hour, Minute, or Second
			case "d":
			case "h":
			case "H":
			case "K":
			case "k":
			case "j":
			case "m":
			case "s":

				// number l1:{1,2}, l2:{2}.
				//
				// Lenient parsing:
				// - skeleton "hms" (i.e., one m) always includes mm for the pattern, i.e., it's
				//   impossible to use a different skeleton to parse non-zero-padded minutes,
				//   therefore parser accepts both zero-padded and non-zero-padded for m. Similar
				//   for seconds s.
				// - skeleton "hms" (i.e., one h) may include h or hh for the pattern, i.e., it's
				//   impossible to use a different skeleton to parser non-zero-padded hours for some
				//   locales, therefore parser accepts both zero-padded and non-zero-padded for h.
				//   Similar for d (in skeleton yMd).
				oneOrTwoDigitsIfLengthOneOrTwo();
				break;

			case "S":

				// number {l}.

				// Unicode equivalent to /\d{length}/
				numeric = true;
				tokenRe = new RegExp( "(" + regexpN.source + "){" + length + "}" );
				break;

			case "A":

				// number {l+5}.

				// Unicode equivalent to /\d{length+5}/
				numeric = true;
				tokenRe = new RegExp( "(" + regexpN.source + "){" + ( length + 5 ) + "}" );
				break;

			// Zone
			case "v":
			case "V":
			case "z":
				if ( tokenRe && new RegExp( "^" + tokenRe.source ).test( value ) ) {
					break;
				}
				if ( chr === "V" && length === 2 ) {
					break;
				}

			/* falls through */
			case "O":

				// O: "{gmtFormat}+H;{gmtFormat}-H" or "{gmtZeroFormat}", eg. "GMT-8" or "GMT".
				// OOOO: "{gmtFormat}{hourFormat}" or "{gmtZeroFormat}", eg. "GMT-08:00" or "GMT".
				if ( value === properties[ "timeZoneNames/gmtZeroFormat" ] ) {
					token.value = 0;
					tokenRe = new RegExp( properties[ "timeZoneNames/gmtZeroFormat" ] );
				} else {
					aux = properties[ "timeZoneNames/hourFormat" ].some(function( hourFormat ) {
						tokenRe = hourFormatRe(
							hourFormat,
							properties[ "timeZoneNames/gmtFormat" ],
							timeSeparator
						);
						if ( hourFormatParse( tokenRe, numberParser ) ) {
							return true;
						}
					});
					if ( !aux ) {
						return null;
					}
				}
				break;

			case "X":

				// Same as x*, except it uses "Z" for zero offset.
				if ( value === "Z" ) {
					token.value = 0;
					tokenRe = /Z/;
					break;
				}

			/* falls through */
			case "x":

				// x: hourFormat("+HH;-HH")
				// xx or xxxx: hourFormat("+HHmm;-HHmm")
				// xxx or xxxxx: hourFormat("+HH:mm;-HH:mm")
				tokenRe = hourFormatRe(
					length === 1 ? "+HH;-HH" : ( length % 2 ? "+HH:mm;-HH:mm" : "+HHmm;-HHmm" )
				);
				if ( !hourFormatParse( tokenRe ) ) {
					return null;
				}
				break;

			case "'":
				token.type = "literal";
				tokenRe = new RegExp( regexpEscape( removeLiteralQuotes( current ) ) );
				break;

			default:
				token.type = "literal";
				tokenRe = new RegExp( regexpEscape( current ) );
		}

		if ( !tokenRe ) {
			return false;
		}

		// Get lexeme and consume it.
		// TODO: Improve performance by reducing the abusive use of regexps.
		value = value.replace( new RegExp( "^" + tokenRe.source ), function( lexeme ) {
			token.lexeme = lexeme;
			if ( numeric ) {
				token.value = numberParser( lexeme );
			}
			return "";
		});

		if ( !token.lexeme ) {
			return false;
		}

		if ( numeric && isNaN( token.value ) ) {
			return false;
		}

		tokens.push( token );
		return true;
	});

	if ( value !== "" ) {
		valid = false;
	}

	return valid ? tokens : [];
};




var dateParserFn = function( numberParser, parseProperties, tokenizerProperties ) {
	return function dateParser( value ) {
		var tokens;

		validateParameterPresence( value, "value" );
		validateParameterTypeString( value, "value" );

		tokens = dateTokenizer( value, numberParser, tokenizerProperties );
		return dateParse( value, tokens, parseProperties ) || null;
	};
};




var dateToPartsFormatterFn = function( numberFormatters, properties ) {
	return function dateToPartsFormatter( value ) {
		validateParameterPresence( value, "value" );
		validateParameterTypeDate( value, "value" );

		return dateFormat( value, numberFormatters, properties );
	};

};




Globalize._dateFormat = dateFormat;
Globalize._dateFormatterFn = dateFormatterFn;
Globalize._dateParser = dateParse;
Globalize._dateParserFn = dateParserFn;
Globalize._dateTokenizer = dateTokenizer;
Globalize._dateToPartsFormatterFn = dateToPartsFormatterFn;
Globalize._validateParameterTypeDate = validateParameterTypeDate;

function optionsHasStyle( options ) {
	return options.skeleton !== undefined ||
		options.date !== undefined ||
		options.time !== undefined ||
		options.datetime !== undefined ||
		options.raw !== undefined;
}

Globalize.dateFormatter =
Globalize.prototype.dateFormatter = function( options ) {
	options = options || {};
	if ( !optionsHasStyle( options ) ) {
		options.skeleton = "yMd";
	}
	return Globalize[ runtimeKey( "dateFormatter", this._locale, [ options ] ) ];
};

Globalize.dateToPartsFormatter =
Globalize.prototype.dateToPartsFormatter = function( options ) {
	options = options || {};
	if ( !optionsHasStyle( options ) ) {
		options.skeleton = "yMd";
	}
	return Globalize[ runtimeKey( "dateToPartsFormatter", this._locale, [ options ] ) ];
};

Globalize.dateParser =
Globalize.prototype.dateParser = function( options ) {
	options = options || {};
	if ( !optionsHasStyle( options ) ) {
		options.skeleton = "yMd";
	}
	return Globalize[ runtimeKey( "dateParser", this._locale, [ options ] ) ];
};

Globalize.formatDate =
Globalize.prototype.formatDate = function( value, options ) {
	validateParameterPresence( value, "value" );
	validateParameterTypeDate( value, "value" );

	return this.dateFormatter( options )( value );
};

Globalize.formatDateToParts =
Globalize.prototype.formatDateToParts = function( value, options ) {
	validateParameterPresence( value, "value" );
	validateParameterTypeDate( value, "value" );

	return this.dateToPartsFormatter( options )( value );
};

Globalize.parseDate =
Globalize.prototype.parseDate = function( value, options ) {
	validateParameterPresence( value, "value" );
	validateParameterTypeString( value, "value" );

	return this.dateParser( options )( value );
};

return Globalize;




}));
