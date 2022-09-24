var currentMousePos = {x:0, y:0};
var jquery_dienstplan_opt = null;
var jquery_dienstplan_actual_user = null;

var jquery_dienstplan_setting = new Array();
jquery_dienstplan_setting.doing = false;
var gesture_timeout = false;
var gesture_settings = new Array();
gesture_settings.doing = false;

jquery_dienstplan_url = new Array();
jquery_dienstplan_url.urls = new Array();
jquery_dienstplan_url.urls['bookable'] = new Array();
jquery_dienstplan_url.urls['bookable']['edit'] = 'dienstplan/edit_bookable/';
jquery_dienstplan_url.urls['bookable']['delete'] = 'dienstplan/del_bookable/';
jquery_dienstplan_url.urls['bookable']['applyWeeks'] = 'dienstplan/apply_weeks/';
jquery_dienstplan_url.urls['bookable']['add'] = 'dienstplan/add_bookable/';


var times_dienstmodel1 = new Array();

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/**
 *	Dienstplan Week Menu - Plugin
 */
(function($){

	$.fn.dienstplanWeekMenu = function(opt) {

	    $.dienstplanWeekMenu(this, opt);

	    return this;
	}

	$.dienstplanWeekMenu = function (target, opt) {

		opt = $.extend({
			_target: target,
			mode: 'set',
			startTime: new Date(),
			endTime: new Date(),
			vacations: new Array()
		}, opt);

		var code = '';

		code += '	<ul id="dienstplan-tab-menu-tabs">\
						<li><a href="#dienstplan-week-menu">Men&uuml;</a></li>\
						<li><a href="#vacation">Urlaub/Auszeit</a></li>\
					</ul>'
		code += '<div id="dienstplan-week-menu">'
		code += '	<div class="dienstplan-week-menu">';
		code += '		<b>Legende</b><br />';
		if( opt.mode == 'book' || opt.mode == 'set')
		{
			var i = 0;
			for( i = 0; i < jquery_dienstplan_opt.jobs.length; i++ )
			{
				code += '	<div><div class="dienstplan-week-legend-item dienstplan-week-legend-box dienstplan-week-date-'+i+'"> </div><div class="dienstplan-week-legend-item">Bereitschaftszeit '+jquery_dienstplan_opt.jobs[i][1]+'-Dienst</div></div><br style="clear:both;" />';
			}
			code += '<hr />';
		}
		code += '	<div><div class="dienstplan-week-legend-item dienstplan-week-legend-box dienstplan-week-bookable"> </div><div class="dienstplan-week-legend-item">Buchbarer Bereitschaftsdient</div></div><br style="clear:both;"/>';
		if (opt.mode == 'set' || opt.mode == 'book') {
			code += '<br/>';
		}
		code += '</div>';
		if( opt.apply_week )
		{
			code += '<div class="dienstplan-week-menu">'
			code += '	<div><button id="apply_weeks_button" onclick="dienstplanApplyEventsToWeeks();">Bereitschaft f&uuml;r die n&auml;chsten Wochen &uuml;bernehmen</button></div>';
			code += '</div>';
		}
		code += '<div class="dienstplan-week-menu">'
		if( getCookie('dienstplan_show_my_box') == '1' )
		{
			code += '	<div><input type="checkbox" checked="1" id="show_my_box" onclick="dienstplan_update_show_my_box();">Meine Bereitschaftszeiten hervorheben</input></div>';
		} else
		{
			code += '	<div><input type="checkbox" id="show_my_box" onclick="dienstplan_update_show_my_box();">Meine Bereitschaftszeiten hervorheben</input></div>';
		}
		code += '</div>';
		code += '</div>';
		code += '<div id="vacation">';
		console.log(opt.vacations);
		for(var vid=0 in opt.vacations)
		{
			code += '<p class="vacation-of-user">';
			code += '<b>'+opt.vacations[vid]['DienstplanUser']['nachname']+', '+opt.vacations[vid]['DienstplanUser']['vorname']+'</b><br/>';
			var type = 'Urlaub';
			if(opt.vacations[vid]['DienstplanVacation']['type'] != 0)
				type = 'Auszeit'
			var startstamp = opt.vacations[vid]['DienstplanVacation']['start']*1000;
			var endstamp = opt.vacations[vid]['DienstplanVacation']['end']*1000;
			var startD = new Date(startstamp);
			var endD = new Date(endstamp);
			var relevant = opt.startTime <= startD && startD <= opt.endTime ||
							opt.startTime <= endD && endD <= opt.endTime ||
							startD <= opt.startTime && opt.startTime <= endD ||
							startD <= opt.endTime && opt.endTime <= endD;
			if(relevant)
				code += '<u>';
			code += startD.getDate()+'.'+(startD.getMonth()+1)+'.'+startD.getFullYear()+' - ';
			code += endD.getDate()+'.'+(endD.getMonth()+1)+'.'+endD.getFullYear()+' ('+type+')';
			if(relevant)
				code += '</u>';
			code += '<br />'

			/*
			for(var vid=0 in opt.vacations[uname][1])
			{
				var startstamp = opt.vacations[uname][1][vid]['start']*1000;
				var endstamp = opt.vacations[uname][1][vid]['end']*1000;
				var startD = new Date(startstamp);
				var endD = new Date(endstamp);
				var relevant = opt.startTime <= startD && startD <= opt.endTime ||
								opt.startTime <= endD && endD <= opt.endTime ||
								startD <= opt.startTime && opt.startTime <= endD ||
								startD <= opt.endTime && opt.endTime <= endD;
				if(relevant)
					code += '<u>';
				code += startD.getDate()+'.'+(startD.getMonth()+1)+'.'+startD.getFullYear()+' - ';
				code += endD.getDate()+'.'+(endD.getMonth()+1)+'.'+endD.getFullYear()+' (Auszeit)';
				if(relevant)
					code += '</u>';
				code += '<br />'
			}
			*/
			code += '</p>';
		}
		code += '</div>';

		$(target).append(code);
		$('#dienstplan-tab-menu').tabs();
		$('#dienstplan-tab-menu').tabs('select', 'menu');

		$(".dienstplan-week-button").buttonset();
		$(".dienstplan-week-button-checkbox").buttonset();
	}

})(jQuery);

/**
 *	Dienstplan Week - Plugin
 */
(function($){

	$.fn.dienstplanWeek = function(opt) {

	    $.dienstplanWeek(this, opt);
	    dienstplan_update_show_my_box();
	    return this;
	}

	$.dienstplanWeek = function (target, opt) {

		// Default Values
		opt = $.extend({
			_target: target,
			mode: 'set', // 'set' OR 'book'
			sizeMode: 'small',
			users: new Array(),
			jobs: new Array(),
			events: new Array(),
			vacations: new Array(),
			startTime: new Date(),
			endTime: new Date(),
			startActionMode: null,
			baseScriptUrl: 'http://localhost/servers/sofort-kundendienst.de/',
			backwardButton: null,
			forwardButton: null,
			weekLabel: null,
			trash: null,
			addMenu: true,
			urlParams: '?wid=42',
			dayLabels: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
			monthLabels: ['Januar', 'Februar', 'M�rz', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
			startHour: 6,
			endHour: 18,
			timeAtom: 6, // Minimale L�nge der Zeitspanne, die ausgew�hlt werden kann. (in Stunden)
			dienstmode: 0, // 0: beginnend bei 0:00 fortlaufend mit timeAtom, 1: timeAtom wird ignoriert. dienste in zyklen w�hlbar
			startCycle24: 0,
			midCycle24: 24,
			firma_id: null,
			current_user_id: -1,
			is_admin: 0,
			apply_week: 0,
			delete_mode: 0,
			delete_border: 0,
			delete_date: 0,
			bergstrasse_special: false,
		}, opt);

		if (opt.endHour > 23) {
			opt.endHour = 23;
		}

		jquery_dienstplan_opt = opt;
		jquery_dienstplan_url.urlParams = opt.urlParams;
		jquery_dienstplan_url.baseUrl = opt.baseScriptUrl;
		jquery_dienstplan_actual_user = opt.users[0];
		times_dienstmodel1 = generateTimes( opt );
		createMatrix_dienstmode1( opt );

		for( var i = 0; i < opt.events.length; i++ )
		{
			dienstplan_week_drawEvent( opt.events[i] );
		}
	}

	function generateTimes( opt )
	{
		if(opt.dienstmode == 0)
			return generateTimes_mode0(opt);
		if(opt.dienstmode == 1)
			return generateTimes_mode1(opt);
	}

	function generateTimes_mode0(opt)
	{
		var dayStartDate = new Date(opt.startTime.getTime());
		var dayEndDate = new Date(opt.endTime.getTime());
		dayEndDate.setDate(dayEndDate.getDate()+1);
		var times = new Object();
		for( var j = 0; j < opt.jobs.length; j++ )
		{
			var job = opt.jobs[j];
			for( var i = 0; i < 7; i++ )
			{
				var currentDate = new Date(dayStartDate.getTime());
				var endDate = new Date(dayStartDate.getTime());
				currentDate.setDate(currentDate.getDate()+i);
				endDate.setDate(endDate.getDate()+i+1);

				do
				{
					if( !times[job[0]] )
						times[job[0]] = new Array();
					var atomStartDate = new Date(currentDate.getTime());
					currentDate.setTime( currentDate.getTime()+ opt.timeAtom*60*60*1000 );
					var summerHour1 = timestampOfSummerTimeHour( atomStartDate.getFullYear() )*1000;
					var winterHour1 = timestampOfWinterTimeHour( atomStartDate.getFullYear() )*1000;
					if( atomStartDate.getTime() <= summerHour1 &&
						summerHour1+3600000 <= currentDate.getTime() )
					{
						times[job[0]].push( new Array( currentDate.getTime(), currentDate.getTime() ) );
						console.log('ZEROTIME');
					}
					else if( atomStartDate.getTime() <= winterHour1 &&
						winterHour1+3600000 <= currentDate.getTime() )
					{
						currentDate.setTime( currentDate.getTime()+ 3600000 );
					}
					times[job[0]].push( new Array( atomStartDate.getTime(), currentDate.getTime() ) );

				} while( currentDate < endDate );
			}
		}
		return times;
	}

	function generateTimes_mode1(opt)
	{
		var endDate = new Date(opt.endTime.getTime());
		endDate.setDate(endDate.getDate()+1);

		var startTime = opt.startTime.getTime();
		var endTime = endDate.getTime();

		var times = new Object();
		if(opt.startCycle24 != 0)
		{
			for( var j = 0; j < opt.jobs.length; j++ )
			{
				var job = opt.jobs[j];
				// First time starts one Week before
				var dateS = new Date(startTime);
				dateS.setDate(dateS.getDate()-1);
				dateS.setHours(opt.midCycle24);
				var dateE = new Date(startTime);
				dateE.setHours(opt.startCycle24);

				if( j == 3 && opt.bergstrasse_special )
				{
					dateS = new Date(startTime);
					dateS.setDate(dateS.getDate()-1);
					dateS.setHours(7);
					dateE = new Date(startTime);
					dateE.setHours(7);
				}

				if( !times[job[0]] )
					times[job[0]] = new Array();
				times[job[0]].push(new Array( dateS.getTime(), dateE.getTime() ));
			}
		}

		var start = 0; // 0: startCycle24 is start, 1: midCycle24 is start
		var dayDate = new Date(startTime);
		do
		{
			for( var j = 0; j < opt.jobs.length; j++ )
			{
				var job = opt.jobs[j];
				var dateS = null;
				var dateE = null;
				if( start == 0 )
				{
					dateS = new Date(dayDate.getTime());
					dateS.setHours( opt.startCycle24 );
					dateE = new Date(dayDate.getTime());
					dateE.setHours( opt.midCycle24 );
				} else
				{
					var nextDayDate = new Date(dayDate.getTime());
					nextDayDate.setDate( nextDayDate.getDate()+1 );

					dateS = new Date(dayDate.getTime());
					dateS.setHours( opt.midCycle24 );
					dateE = new Date(nextDayDate.getTime());
					dateE.setHours( opt.startCycle24 );
				}
				if( j == 3 && opt.bergstrasse_special )
				{
					if(start == 0)
					{
						var nextDayDate = new Date(dayDate.getTime());
						nextDayDate.setDate( nextDayDate.getDate()+1 );

						dateS = new Date(dayDate.getTime());
						dateS.setHours( 7 );
						dateE = new Date(nextDayDate.getTime());
						dateE.setHours( 7 );
					} else
					{
						continue;
					}
				}
				if( !times[job[0]] )
					times[job[0]] = new Array();
				times[job[0]].push(new Array( dateS.getTime(), dateE.getTime() ));
			}
			if(start==0)
				start = 1;
			else
			{
				dayDate.setDate(dayDate.getDate()+1);
				start = 0;
			}
		} while( dayDate.getTime() < endTime );
		return times;
	}

	function countHours( startStamp, endStamp, addSummerRemWinterHour )
	{
		var startDate = new Date(startStamp);
		startDate.setMinutes(0);
		var endDate = new Date(endStamp);
		endDate.setMinutes(0);

		var hours = 0;
		var currentDate = new Date(startStamp);
		currentDate.setMinutes(0);
		while( currentDate.getTime() < endDate.getTime() )
		{
			hours++;
			currentDate.setTime( currentDate.getTime()+1*60*60*1000 );
		}

		if( addSummerRemWinterHour )
		{
			var summerHour1 = timestampOfSummerTimeHour( startDate.getFullYear() )*1000;
			var winterHour1 = timestampOfWinterTimeHour( startDate.getFullYear() )*1000;
			//var summerHour2 = timestampOfSummerTimeHour( endDate.getFullYear() );
			//var winterHour2 = timestampOfWinterTimeHour( endDate.getFullYear() );
			if( (startDate.getTime() <= summerHour1 &&
				summerHour1+3600000 <= endDate.getTime()) )
			{
				console.log('summertime');
				hours += 1;
			}
			else if( startDate.getTime() <= winterHour1 &&
				winterHour1+3600000 <= endDate.getTime() )
			{
				hours -= 1;
			}
		}

		return hours;
	}

	function createMatrix_dienstmode1( opt )
	{
		var target = opt._target;
		var code = '';
		var item = '';

		code = '';
		code += '<div id="dienstplan-week-navigation-days" UNSELECTABLE="on">';

		// Looping Days
		var id = null;
		var iEvent = 0;
		var iDay = 0;
		var actualDate = new Date();
		var col = null;
		var colDayCode = '';
		var timeSlotCode = '';
		for (
			var actualTime=opt.startTime.getTime();
			actualTime<=opt.endTime.getTime();
			actualTime=actualTime+(60*60*24*1000)
		) {

			iDay++;
			actualDate.setTime(actualTime);

			// Adding Time Labels and backward button
			if (actualTime == opt.startTime.getTime()) {

				code += '<div class="dienstplan-week-item">';

				code += '<div class="dienstplan-week-item-label dienstplan-week-item-time-label dienstplan-week-item-time-label-left">';
				code += opt.backwardButton ? opt.backwardButton : '<div/>';

				code += '<div class="dienstplan-week-item-week-label">'+(opt.weekLabel ? opt.weekLabel : '&nbsp;')+'</div>';
				code += '</div>';

				var hourCounter = 0;
				for (var iHour=opt.startHour; iHour<=opt.endHour; iHour++) {
					hourCounter++;
					code += '<div class="dienstplan-week-item-time dienstplan-week-item-time-left '+(hourCounter%2 ? ' dienstplan-week-item-switch ' : '')+'">'+(iHour<10 ? '0'+iHour : iHour)+':00</div>';
				}
				code += '</div>';
			}

			// Adding Day Label
			item = '';
			item += '<div class="dienstplan-week-item-label '+(iDay%2 ? ' dienstplan-week-item-switch ' : '')+'">';
			item += opt.dayLabels[actualDate.getDay()];
			item += '<br/>';
			item += actualDate.getDate()+'.'+(actualDate.getMonth()+1)+'. <br/>';

			// Adding Jobs Label
			jobsDayCode = '';
			for (var iJob=0; iJob<opt.jobs.length; iJob++) {
				job = opt.jobs[iJob];

				jobsDayCode += '<div class="dienstplan-week-job-item dienstplan-week-job-label-'+job[1]+' dienstplan-week-job-item-'+opt.sizeMode+' " ';

				jobsDayCode += ' title="'+job[1]+'">'+job[1];
				jobsDayCode += '</div>';
			}
			item += '<div class="dienstplan-week-job">'+jobsDayCode+'</div><br style="clear: both;" />';

			item += '</div>';

			// Adding Time Slots for Jobs
			timeSlotCode = '';
			var taString = opt.timeAtom+'';

			//TODO was macht es?
			taString = taString.replace(/\./g, '_');

			for (var iJob=0; iJob<opt.jobs.length; iJob++) {

				job = opt.jobs[iJob];

				timeSlotJobCode = '';
				var currentDayDate = new Date(actualTime);
				var currentDayEndDate = new Date(currentDayDate.getTime());
				currentDayEndDate.setDate(currentDayEndDate.getDate()+1);
				currentDayEndDate.setTime(currentDayEndDate.getTime()-1);
				var printedDates
				for (var i=0; i < times_dienstmodel1[job[0]].length; i++) {

					var sDate = new Date(times_dienstmodel1[job[0]][i][0]);
					var eDate = new Date(times_dienstmodel1[job[0]][i][1]);
					if( !(sDate.getDate() == currentDayDate.getDate()) &&
						!(eDate.getDate() == currentDayDate.getDate()) )
					{
						console.log('cnt');
						continue;
					}
					var hours = countHours( times_dienstmodel1[job[0]][i][0], times_dienstmodel1[job[0]][i][1], true );
					var actualDate = new Date( times_dienstmodel1[job[0]][i][0] );
					if(sDate.getDate() != currentDayDate.getDate())
						actualDate = new Date(currentDayDate.getTime());
					var classHours = hours;
					var startTime = times_dienstmodel1[job[0]][i][0];
					var endTime = times_dienstmodel1[job[0]][i][1];
					if( times_dienstmodel1[job[0]][i][0] < currentDayDate.getTime() )
					{
						classHours = countHours( currentDayDate.getTime(), times_dienstmodel1[job[0]][i][1], true );
						startTime = currentDayDate.getTime();
					}
					if( times_dienstmodel1[job[0]][i][1] > currentDayEndDate.getTime() )
					{
						classHours = countHours( times_dienstmodel1[job[0]][i][0], currentDayEndDate.getTime(), true );
						endTime = currentDayEndDate.getTime();
					}
					/*
					var datefyear = new Date(startTime);
					datefyear = datefyear.getFullYear();
					var summerTimeTime = timestampOfSummerTimeHour(datefyear)*1000;
					if( startTime <= summerTimeTime && summerTimeTime <= endTime-1 )
					{
						classHours++;
					}
					*/

					timeSlotJobCode += '<div class="dienstplan-week-timeslot-hour">';
					id = actualDate.getFullYear()+'_'+actualDate.getMonth()+'_'+actualDate.getDate()+'_'+actualDate.getHours()+'_'+job[0];
					var classID = 'times_id_'+i+'_'+iJob;
					timeSlotJobCode += '<div ';
					timeSlotJobCode += ' id="'+id+'" ';
					timeSlotJobCode += ' class="dienstplan-week-timeslot-item dienstplan-week-timeslot-item-size-'+classHours;
					timeSlotJobCode += ' dienstplan-week-maintime '+classID+'" '
					/*
					if( /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream )
					{
						timeSlotJobCode += ' ontouchstart="dienstplan_week_highlightTimeSlotItem(1, this, '+job[0]+');dienstplan_week_enableEventAdding(this);" ';
						timeSlotJobCode += ' ontouchend="dienstplan_week_finishEventAdding(this);" ';
					} else
					{
						timeSlotJobCode += ' onmousedown="dienstplan_week_enableEventAdding(this);" ';
						timeSlotJobCode += ' onmouseup="dienstplan_week_finishEventAdding(this);" ';
					}
					*/

					//var mouseOut = 'dienstplan_week_highlightTimeSlotItem(0, this, '+job[0]+');';
					//var mouseIn = 'dienstplan_week_highlightTimeSlotItem(1, this, '+job[0]+');';

					//timeSlotJobCode += ' onmouseout="'+mouseOut+'" ';
					//timeSlotJobCode += ' onmouseover="'+mouseIn+'"';

					timeSlotJobCode += '><div/></div>';
					timeSlotJobCode += '</div>';
				}

				id = actualDate.getFullYear()+'_'+actualDate.getMonth()+'_'+actualDate.getDate()+'_'+job[0];
				timeSlotCode += '<div class="dienstplan-week-timeslot" id="'+id+'">'+timeSlotJobCode+'</div>';
			}
			item += '<div class="dienstplan-week-timeslot-day">'+timeSlotCode+'</div>';

			// Adding Item to Code
			code += '<div class="dienstplan-week-item">'+item+'</div>';
		}

		// Adding Time Label and forward button

		code += '<div class="dienstplan-week-item">';
		code += '<div class="dienstplan-week-item-label dienstplan-week-item-time-label-right dienstplan-week-item-time-label">';
		code += opt.forwardButton ? opt.forwardButton : '<div/>';
		code += '<div class="dienstplan-week-item-week-label">'+(opt.weekLabel ? opt.weekLabel : '&nbsp;')+'</div>';
		code += '</div>';

		var hourCounter = 0;
		for (var iHour=opt.startHour; iHour<=opt.endHour; iHour++) {
			hourCounter++;
			code += '<div class="dienstplan-week-item-time dienstplan-week-item-time-right '+(hourCounter%2 ? ' dienstplan-week-item-switch ' : '')+'">'+(iHour<10 ? '0'+iHour : iHour)+':00</div>';
		}
		code += '</div>';

		code += '</div>';

		// Adding Dialog Box
		code += '<div id="dialog" style="display: none;"><p>This is the default dialog which is useful for displaying information. The dialog window can be moved, resized and closed with the icon.</p></div>';
		code += '<div id="dialog_loading" style="display: none;"><p>This is the default dialog which is useful for displaying information. The dialog window can be moved, resized and closed with the icon.</p></div>';

		// Adding Popup Div
		code += '<div id="popup" style="position: absolute; display: none;" class="dienstplan-week-popup"></div>';
		code += '<div id="popup_context" style="position: absolute; display: none;" class="dienstplan-week-popup"></div>';
		code += '<div id="dienstplan-week-flash" style="position: absolute; display: none; left: 150px; top: 150px;"></div>';

		// Adding Event Container
		code += '<div id="eventContainer"><div /></div>';

		// Adding Code to Calendar
		$(target).append(code);

		// register events
		$('.dienstplan-week-timeslot-item').each(function(){
			$(this).bind('vmousedown', function(){
				dienstplan_week_enableEventAdding(this);
			});
			$(this).bind('vmouseup', function(){
				dienstplan_week_finishEventAdding(this);
			});

			var col = colFromTimeslot( this );
			$(this).bind('vmouseover', function(){
				dienstplan_week_highlightTimeSlotItem(1, this, col);
			});
			$(this).bind('vmouseout', function(){
				dienstplan_week_highlightTimeSlotItem(0, this, col);
			});
		})

		// Adding Menu
		if (opt.addMenu) {
			$(target).append('<div id="dienstplan-tab-menu"></div>');
			$("#dienstplan-tab-menu").dienstplanWeekMenu({
				mode: opt.mode,
				vacations: opt.vacations,
				startTime: opt.startTime,
				endTime: opt.endTime,
				apply_week: opt.apply_week,
			});
		}

		// Adding Size Classes
		$('#'+target.attr('id')+' DIV.dienstplan-week-timeslot-item').addClass( 'dienstplan-week-timeslot-item-'+opt.sizeMode );
		$('#'+target.attr('id')+' DIV.dienstplan-week-item-time').addClass( 'dienstplan-week-item-time-'+opt.sizeMode );

		// bind events
		$('#popup_context').bind( 'mouseleave', function() {
			$('#popup_context').hide();
		} );
	}
})(jQuery);

// Gibt true zur�ck, wenn das �bergebene Datum genau die Stunde repr�sentiert,
// die am Tag, zu dem die Uhr auf Sommerzeit umgestellt wird, nicht existiert.
function isNonExistingSummerTimeHour( year, month, day, hour )
{
	year = parseInt( year );
	month = parseInt( month );
	day = parseInt( day );
	hour = parseInt( hour );

	if( month != 2 || hour != 2 )
		return false;

	ldmarch = new Date( year, 2, 31, 1, 0, 0 );
	ldmarch.setTime( ldmarch.getTime() - (ldmarch.getDay()*86400000) );
	if( ldmarch.getDate() == day )
		return true;

	return false;
}

function timestampOfSummerTimeHour( year )
{
	year = parseInt( year );
	ldmarch = new Date( year, 2, 31, 2, 0, 0 );
	ldmarch.setTime( ldmarch.getTime() - (ldmarch.getDay()*86400000) );
	return ldmarch.getTime()/1000;
}

function timestampOfWinterTimeHour( year )
{
	year = parseInt( year );
	ldmarch = new Date( year, 9, 31, 2, 0, 0 );
	ldmarch.setTime( ldmarch.getTime() - ((ldmarch.getDay()*86400000)+(60*60*1000)) );
	return ldmarch.getTime()/1000;
}

function drawEventPart( part, event )
{
	var cssClass = '';
	cssClass += 'dienstplan-week-date-'+event[3];
	cssClass += ' dienstplan-week-event ';
	cssClass += ' ui-widget-content ';

	// Appending Event
	var event_id = 'event_id_'+event[1];

	// Positioning Element Size
	var time = new Date(part[0]);

	var item_id = time.getFullYear()+'_'+time.getMonth()+'_'+time.getDate()+'_'+time.getHours()+'_'+event[3];

	// Aborting if Event is not in Timeslot Area
	if ( ! document.getElementById(item_id)) {
		return false;
	}

	// Adding HTML Code of Event
	var eventPosition = $('#'+item_id).position();
	var element = document.createElement('div');
	$(element).attr('class', cssClass+' '+event_id);

	var amountHours = (part[1]-part[0])/(1000*60*60);

	var summerTimeTime = timestampOfSummerTimeHour(time.getFullYear())*1000;
	var winterTimeTime = timestampOfWinterTimeHour(time.getFullYear())*1000;

	if( part[0] <= summerTimeTime && summerTimeTime <= part[1]-1 )
	{
		amountHours++;
	}
	if( part[0] <= winterTimeTime && winterTimeTime <= part[1]-1 )
	{
		amountHours--;
	}

	var itemWidth = $('#'+item_id).width()-2;
	var itemHeight = Math.ceil(amountHours*20)-3;



	$(element).css('position', 'absolute');
	$(element).css('left', Math.ceil(eventPosition.left));
	$(element).css('top', Math.ceil(eventPosition.top)-1);
	//$('#'+event_id).css('width', itemWidth+'px');
	//$('#'+event_id).css('heigth', itemHeight+'px');
	$(element).height(itemHeight);
	$(element).width(itemWidth);

	$('#eventContainer').append(element);
}

function dienstplan_week_drawEvent(event) {

	var eventParts = new Array();
	var event_id = 'event_id_'+event[1];

	var eventStart = new Date( event[4]*1000 );
	var eventEnd = new Date( (event[4]+event[5])*1000 );
	var currentDate = new Date(eventStart.getTime());
	while(currentDate < eventEnd)
	{
		var startNextDay = new Date(currentDate.getTime());
		startNextDay.setDate(currentDate.getDate()+1);
		startNextDay.setHours(0);
		var endOfTimePart = eventEnd;
		if(startNextDay < endOfTimePart)
			endOfTimePart = startNextDay;
		eventParts.push( new Array( currentDate.getTime(), endOfTimePart.getTime() ) );

		currentDate = endOfTimePart;
	}

	for( var i = 0; i < eventParts.length; i++ )
	{
		drawEventPart( eventParts[i], event );
	}

	var user = null;
	for( var i = 0; i < jquery_dienstplan_opt.users.length && user == null; i++ )
	{
		if( jquery_dienstplan_opt.users[i][0] == event[2] )
			user = jquery_dienstplan_opt.users[i];
	}

	$('.'+event_id).each(function(){
		$(this).bind( 'vclick', function() {
			window.setTimeout(function(){dienatplan_week_showEvent( event );}, 200);
		} );
		$(this).bind( 'mouseover', function () {
			position = $(this).position();
			var html = '';
			if( user == null )
				html += '<b>Mitarbeiter: </b>not found<br />';
			else
			{
				html += '<b>Mitarbeiter: </b>'+user[1]+' '+user[2]+'<br />';
				if( user[4] )
					html += user[4]+'<br />';
			}

			$('#popup').css('position', 'fixed');
			$('#popup').css('left', currentMousePos.x+20);
			$('#popup').css('top', currentMousePos.y);
			$('#popup').css('z-index', 999999);
			$('#popup').html(html);
			$('#popup').show();
		} );
	});

	$('.'+event_id).each(function(){$(this).bind( 'mouseout', function () {
		$('#popup').hide();
	} );});

	// context-menu
	$('.'+event_id).each(function(){$(this).bind(  'contextmenu', function() {
		if( ( user && jquery_dienstplan_opt.current_user_id == user[0] ) ||
			jquery_dienstplan_opt.is_admin )
		{
			if ( $('#popup_context').css('display') == 'none')
			{
				var xPos = currentMousePos.x;
				var yPos = currentMousePos.y;

				var contextMenu = $('<div id="dienstplan-week-context-item-container"></div>');
				$('#popup_context').css('position', 'fixed');
				$('#popup_context').css('left', xPos);
				$('#popup_context').css('top', yPos);
				$('#popup_context').css('z-index', 999999);
				$('#popup_context').html('');
				$('#popup_context').append(contextMenu);

				if( jquery_dienstplan_opt.is_admin )
				{
					$('#dienstplan-week-context-item-container')
					.append(
						$('<div id="dienstplan-week-context-bookable">Bearbeiten</div>')
							.addClass('dienstplan-week-context-item dienstplan-week-context-item-unselected')
							.bind(
								'click',
								function() {
									dienatplan_week_editEvent( event );
									$('#popup_context').hide();
								}
							)
					)
				}

				deleteItem = $('<div id="dienstplan-week-context-bookable">L&ouml;schen</div>');
				if( event_deletable( event ) || jquery_dienstplan_opt.is_admin )
				{
					deleteItem
					.addClass('dienstplan-week-context-item dienstplan-week-context-item-unselected')
					.bind(
						'click',
						function() {
							dienatplan_week_deleteEvent( event );
							$('#popup_context').hide();
						}
					);
				}
				$('#dienstplan-week-context-item-container')
				.append(
					deleteItem
				)

				$('.dienstplan-week-context-item-unselected').bind( 'mouseover', function() {
					$(this).css('background', '#009');
					$(this).css('color', '#fff');
				} );
				$('.dienstplan-week-context-item-unselected').bind( 'mouseleave', function() {
					$(this).css('background', '#fff');
					$(this).css('color', '#009');
				} );

				$('#popup_context').show();

			}
		}
		return false;
	} );});

	dienstplan_update_show_my_box();
	return event;
}

function event_deletable( event )
{
	// is date in past?
	var stamp = Math.floor( new Date().getTime() / 1000 );
	if( parseInt(event[4]) < stamp )
		return false;

	if(jquery_dienstplan_opt.delete_mode == 0)
	{
		if(jquery_dienstplan_opt.delete_border == 0)
			return true;

		var daysToDate = Math.floor( Math.abs( stamp - parseInt(event[4]) ) / 60 / 60 / 24 );
		if( daysToDate < jquery_dienstplan_opt.delete_border )
			return false;

		return true;
	} else
	{
		if(jquery_dienstplan_opt.delete_date <= 0 || jquery_dienstplan_opt.delete_date >= 28)
			return true;

		var date = new Date(event[4]*1000);
		date.setMonth(date.getMonth()-1);
		date.setDate(jquery_dienstplan_opt.delete_date);
		date.setHours(0);
		date.setSeconds(0);

		var currentDate = new Date();
		if(currentDate.getTime() < date.getTime())
			return true;
		return false;
	}
}

function dienstplan_week_users_select(_default)
{
	code = '<select onchange="jquery_dienstplan_actual_user=jquery_dienstplan_opt.users[this.value];">';
	for( var i = 0; i < jquery_dienstplan_opt.users.length; i++ )
	{
		mt = jquery_dienstplan_opt.users[i];
		code += '<option value="'+i+'"';
		if( typeof _default !== 'undefined' )
		{
			if( mt[0] == _default )
			{
				jquery_dienstplan_actual_user = mt;
				code += 'selected';
			}
		} else
		{
			if(jquery_dienstplan_actual_user != null)
				if( mt[0] == jquery_dienstplan_actual_user[0] )
					code += 'selected';
		}
		code += '>'+mt[2]+', '+mt[1]+'</option>';
	}
	code += '</select>';
	return code;
}

function dienatplan_week_deleteEvent( event )
{
	var html = 'Soll der Termin wirklich gel&ouml;scht werden?';
	// Open Dialog
	$(function() {
		$("#dialog").attr('title', 'Termin l&ouml;schen?');
		$("#dialog").html(html);
		$("#dialog").dialog({
			resizable: false,
			draggable: false,
			modal: false,
			buttons: {
				'Nein': function() {
					$(this).dialog('close');
				},
				'Ja': function() {
					var url = '';
					url += jquery_dienstplan_url.baseUrl+jquery_dienstplan_url.urls['bookable']['delete']+jquery_dienstplan_url.urlParams;
					url += '&id='+event[1];

					$.ajax({
						type: 'GET',
						url: url,
						cache: false,
						dataType: 'json',
						success: function(result) {
							if (result.error) {

								dienstplan_week_showError(result.error);
							}
							else {
								$('.event_id_'+event[1]).each(function(){$(this).remove();});
								index = jquery_dienstplan_opt.events.indexOf( event );
								jquery_dienstplan_opt.events.splice(index, 1);
							}
						},
						error: function(error) {
							dienstplan_week_showError('unbekannter Fehler');
						}
					});

					$(this).dialog('close');
				}
			}
		});
	});
}

function dienstplanApplyEventsToWeeks()
{
	var html = '<b>Zeitraum:</b><br /> ';
	html += '<input type="text" value="4" id="input_duration_weeks" /> Wochen<br />'
	if( jquery_dienstplan_opt.is_admin )
	{
		html += '<b>Benutzer:</b><br />';
		html += dienstplan_week_users_select();
	}
	// Open Dialog
	$(function() {
		$("#dialog").attr('title', 'Termine &uuml;bernehmen');
		$("#dialog").html(html);
		$("#dialog").dialog({
			resizable: false,
			draggable: false,
			modal: false,
			buttons: {
				'Nein': function() {
					$(this).dialog('close');
				},
				'Ja': function() {
					// crawl data
					var apply_uid = jquery_dienstplan_actual_user[0];
					if( !jquery_dienstplan_opt.is_admin )
						apply_uid = jquery_dienstplan_opt.current_user_id;
					var apply_weeks = $('#input_duration_weeks').val()

					var apply_events = new Array();
					for( var i = 0; i < jquery_dienstplan_opt.events.length; i++ )
					{
						if(jquery_dienstplan_opt.events[i][2] == apply_uid)
						{
							apply_events[apply_events.length] = jquery_dienstplan_opt.events[i];
						}
					}

					var url = '';
					url += jquery_dienstplan_url.baseUrl+jquery_dienstplan_url.urls['bookable']['applyWeeks']+jquery_dienstplan_url.urlParams;

					$.ajax({
						type: 'POST',
						url: url,
						cache: false,
						dataType: 'json',
						data: {'json': JSON.stringify(apply_events), 'weeks': apply_weeks},
						success: function(result) {
							if (result.error) {

								dienstplan_week_showError(result.error);
							}
							else {
								/*
								$('#'+event[7]).remove();
								index = jquery_dienstplan_opt.events.indexOf( event );
								jquery_dienstplan_opt.events.splice(index, 1);
								*/
							}
						},
						error: function(error) {
							dienstplan_week_showError('unbekannter Fehler');
						}
					});

					$(this).dialog('close');
				}
			}
		});
	});
}

function dienatplan_week_editEvent( event )
{
	var html = '';
	html += '<b>Neuer Mitarbeiter: </b>'+dienstplan_week_users_select(event[2])+'<br />';

	// Open Dialog
	$(function() {
		$("#dialog").attr('title', 'Mitarbeiter &auml;ndern');
		$("#dialog").html(html);
		$("#dialog").dialog({
			resizable: false,
			draggable: false,
			modal: false,
			buttons: {
				'Nein': function() {
					$(this).dialog('close');
				},
				'Ja': function() {
					var url = '';
					url += jquery_dienstplan_url.baseUrl+jquery_dienstplan_url.urls['bookable']['edit']+jquery_dienstplan_url.urlParams;
					url += '&id='+event[1];
					url += '&user='+jquery_dienstplan_actual_user[0];

					$.ajax({
						type: 'GET',
						url: url,
						cache: false,
						dataType: 'json',
						success: function(result) {
							if (result.error) {

								dienstplan_week_showError(result.error);
							}
							else {
								event[2] = jquery_dienstplan_actual_user[0]+'';
								$('.event_id_'+event[1]).each(function(){$(this).remove();});
								event[7] = null;
								dienstplan_week_drawEvent(event);
							}
						},
						error: function(error) {
							dienstplan_week_showError('unbekannter Fehler');
						}
					});

					$(this).dialog('close');
				}
			}
		});
	});
}

function dienatplan_week_showEvent( event )
{
	var username = 'nicht gefunden';
	var user = null;
	var numberstr = '';
	for( var i = 0; i < jquery_dienstplan_opt.users.length; i++ )
	{
		mt = jquery_dienstplan_opt.users[i];
		if( mt[0] == event[2] )
		{
			username = mt[1]+' '+mt[2];
			user = mt[0];
			if( mt[4] )
				numberstr = mt[4];
		}
	}

	var start = new Date(event[4]*1000);
	var end = new Date((event[4]+event[5])*1000)
	var startstr;
	hour = start.getHours()+'';
	if( hour.length < 2 )
		hour = '0'+hour;
	min = start.getMinutes()+'';
	if( min.length < 2 )
		min = '0'+min;
	startstr = hour+':'+min;
	var endstr;
	hour = end.getHours()+'';
	if( hour.length < 2 )
		hour = '0'+hour;
	min = end.getMinutes()+'';
	if( min.length < 2 )
		min = '0'+min;
	endstr = hour+':'+min;
	if(endstr=='00:00')
		endstr = '24:00';

	var colstr = jquery_dienstplan_opt.jobs[event[3]][1]+'-Dienst';

	var html = '';
	html += '<b>Mitarbeiter: </b>'+username+'<br />';
	html += numberstr+'<br />';
	html += '<b>Start: </b>'+startstr+'<br />';
	html += '<b>Ende: </b>'+endstr+'<br />';

	buttons = {};
	buttons['Ok'] = function() {
		$(this).dialog('close');
	};
	if( jquery_dienstplan_opt.current_user_id == user ||
			jquery_dienstplan_opt.is_admin )
	{
		if( jquery_dienstplan_opt.is_admin )
		{
			buttons['Edit'] = function() {
				$(this).dialog('close');
				dienatplan_week_editEvent( event );
			};
		}
		if( event_deletable(event) || jquery_dienstplan_opt.is_admin )
		{
			buttons['Delete'] = function() {
				$(this).dialog('close');
				dienatplan_week_deleteEvent( event );
			};
		}
	}


	// Open Dialog
	$(function() {
		$("#dialog").html(html);
		$("#dialog").dialog({
			resizable: false,
			draggable: false,
			modal: false,
			title: colstr,
			buttons: buttons
		});
	});
	$('.ui-dialog-buttonpane')
    .find('button:contains("Delete")')
    .removeClass('ui-button-text-only')
    .addClass('ui-button-text-icon-primary')
    .html('<span class="ui-icon ui-icon-trash"></span>');
    $('.ui-dialog-buttonpane')
    .find('button:contains("Edit")')
    .removeClass('ui-button-text-only')
    .addClass('ui-button-text-icon-primary')
    .html('<span class="ui-icon ui-icon-pencil"></span>');
}

function dienstplan_week_showError(error)
{
	// TODO sch�ner
	alert(error);
}

function getIdClassFromTimeslot(timeslot)
{
	var classes = timeslot.getAttribute('class').split(' ');
	var regex = /^(times_id_\d+_\d+)/;
	for( var i = 0; i < classes.length; i++ )
	{
		var cl = classes[i];
		if(regex.test(cl))
		{
			var match = regex.exec(cl);
			return match[1];
		}
	}
	firstP = regex.exec( $(jquery_dienstplan_setting.first).attr('id') );
	return null;
}

function startTimeFromTimeslot( timeslot )
{
	var idReg = /^times_id_(\d+)_(\d+)/;
	var idRegPars = idReg.exec(getIdClassFromTimeslot(timeslot));
	var id = idRegPars[1];
	var job = idRegPars[2];
	var time = new Date( times_dienstmodel1[job][id][0] );
	return time;
}

function endTimeFromTimeslot( timeslot )
{
	var idReg = /^times_id_(\d+)_(\d+)/;
	var idRegPars = idReg.exec(getIdClassFromTimeslot(timeslot));
	var id = idRegPars[1];
	var job = idRegPars[2];5
	var time = new Date( times_dienstmodel1[job][id][1] );
	return time;
}

function colFromTimeslot( timeslot )
{
	var idReg = /^times_id_(\d+)_(\d+)/;
	return idReg.exec(getIdClassFromTimeslot(timeslot))[2];
}

function dienstplan_week_enableEventAddingGesture(element)
{
	jquery_dienstplan_setting.doing = false;
	gesture_settings.doing = false;
	jquery_dienstplan_setting.hold = true;
	$('body').css('cursor', 'default');

	var start = startTimeFromTimeslot( element );
	dayString = jquery_dienstplan_opt.dayLabels[start.getDay()]+' '+start.getDate()+'.'+(start.getMonth()+1);

	hour = start.getHours()+'';
	if( hour.length < 2 )
		hour = '0'+hour;
	min = start.getMinutes()+'';
	if( min.length < 2 )
		min = '0'+min;
	time = hour+':'+min;

	col = jquery_dienstplan_opt.jobs[colFromTimeslot(element)][1];

	var html = '';
	html += '<b>Start: </b>' + dayString + ' um ' + time + '<br/>';
	html += 'Klicken sie nun auf das Ende des Bereitschafts-Zeitraums.';
	var aborted = true;
	// Open Dialog
	$(function() {
		$("#dialog").attr('title', col+'-Dienst');
		$("#dialog").html(html);
		$("#dialog").dialog({
			resizable: false,
			draggable: true,
			modal: false,
			close: function() {
				jquery_dienstplan_setting.hold = false;
				if(aborted)
				{
					$('.dienstplan-week-maintime').removeClass( 'dienstplan-week-date-0' );
					$('.dienstplan-week-maintime').removeClass( 'dienstplan-week-date-1' );
					$('.dienstplan-week-maintime').removeClass( 'dienstplan-week-date-2' );
					$('.dienstplan-week-maintime').removeClass( 'dienstplan-week-date-3' );
					$('.dienstplan-week-black').removeClass( 'dienstplan-week-date-0' );
					$('.dienstplan-week-black').removeClass( 'dienstplan-week-date-1' );
					$('.dienstplan-week-black').removeClass( 'dienstplan-week-date-2' );
					$('.dienstplan-week-black').removeClass( 'dienstplan-week-date-3' );
				}
			},
			buttons: {
				'Abbrechen': function() {
					$(this).dialog('close');

				},
				'Ok': function() {
					aborted = false;
					$(this).dialog('close');
					gesture_settings.doing = true;
					jquery_dienstplan_setting.doing = true;
				}
			}
		});
	});

}

function dienstplan_week_highlightTimeSlotItem(light, item, col)
{
	//if( gesture_timeout != false )
	//	alert('clear');
	window.clearTimeout(gesture_timeout);
	if(!item)
		return;
	if( jquery_dienstplan_setting.hold ) return;
	if( !jquery_dienstplan_setting.doing && !gesture_settings.doing )
	{
		if( dienstplan_week_eventAdding_isValidItem(item) )
		{
			var idclass = getIdClassFromTimeslot(item);
			if( light )
			{
				$('.'+idclass).each( function() {$(this).addClass('dienstplan-week-date-'+col);} );
			} else
			{
				$('.'+idclass).each( function() {$(this).removeClass('dienstplan-week-date-'+col);} );
			}
		} else
		{
		}
	}
	else
	{
		if( dienstplan_week_eventAdding_isValidItem(item) )
		{
			jquery_dienstplan_setting.second = item;
		} else
		{
			jquery_dienstplan_setting.second = jquery_dienstplan_setting.first;
		}
		var idclass = getIdClassFromTimeslot(jquery_dienstplan_setting.first);
		var idReg = /^times_id_(\d+)_(\d+)/;
		idclassP = idReg.exec(idclass);
		// color Items
		$('.dienstplan-week-maintime').removeClass( 'dienstplan-week-date-0' );
		$('.dienstplan-week-maintime').removeClass( 'dienstplan-week-date-1' );
		$('.dienstplan-week-maintime').removeClass( 'dienstplan-week-date-2' );
		$('.dienstplan-week-maintime').removeClass( 'dienstplan-week-date-3' );

		var startTime = new Date( startTimeFromTimeslot(jquery_dienstplan_setting.first));
		var endTime = new Date( startTimeFromTimeslot(jquery_dienstplan_setting.second));
		if( endTime.getTime() < startTime.getTime() )
		{
			//var startTime = new Date( startTimeFromTimeslot(jquery_dienstplan_setting.second));
			//var endTime = new Date( endTimeFromTimeslot(jquery_dienstplan_setting.first));
			var tmp = startTime;
			startTime = endTime;
			endTime = tmp;
		}
		for( var i = 0; i < times_dienstmodel1[idclassP[2]].length; i++ )
		{
			var time = times_dienstmodel1[idclassP[2]][i][0];
			if( time >= startTime.getTime() && time <= endTime.getTime() )
			{
				var classID = 'times_id_'+i+'_'+idclassP[2];
				var cl = 'dienstplan-week-date-'+idclassP[2];
				$('.'+classID).each(function(){$(this).addClass( cl );});
			}
		}
	}

}

function dienstplan_week_enableEventAdding( element )
{
	if(!element)
		return;
	if(jquery_dienstplan_setting.doing == false && !jquery_dienstplan_setting.hold &&
		dienstplan_week_eventAdding_isValidItem( element ) )
	{
		gesture_timeout = window.setTimeout(function(){dienstplan_week_enableEventAddingGesture(element)}, 2000);

		$('body').css('cursor', 'pointer');
		jquery_dienstplan_setting.doing = true;
		jquery_dienstplan_setting.first = element;
		jquery_dienstplan_setting.second = element;
	}
}

function dienstplan_week_finishEventAdding( element )
{
	window.clearTimeout( gesture_timeout );
	if( jquery_dienstplan_setting.doing == true )
	{
		if( element != null )
			if( dienstplan_week_eventAdding_isValidItem(element) )
			{
				jquery_dienstplan_setting.second = element;
			}
		col = colFromTimeslot(jquery_dienstplan_setting.first);
		jquery_dienstplan_setting.doing = false;
		gesture_settings.doing = false;
		jquery_dienstplan_setting.hold = true;

		from = startTimeFromTimeslot( jquery_dienstplan_setting.first );
		to = endTimeFromTimeslot( jquery_dienstplan_setting.second );
		if( to <= from )
		{
			from = startTimeFromTimeslot( jquery_dienstplan_setting.second );
			to = endTimeFromTimeslot( jquery_dienstplan_setting.first );
		}

		dateFrom = new Date(from);
		dateTo = new Date(to);
		duration = to - from;
		durationH = (to - from)/(1000*60*60);
		dayString = jquery_dienstplan_opt.dayLabels[dateFrom.getDay()]+' '+dateFrom.getDate()+'.'+(dateFrom.getMonth()+1);

		$('body').css('cursor', 'default');

		dateDuration = new Date(duration);
		hour = dateFrom.getHours()+'';
		if( hour.length < 2 )
			hour = '0'+hour;
		min = dateFrom.getMinutes()+'';
		if( min.length < 2 )
			min = '0'+min;

		jquery_dienstplan_setting.first = null;

		var html = '';
		html += '<b>Tag: </b>'+dayString+'<br />';
		html += '<b>Start: </b>'+hour+':'+min+' Uhr<br />';
		html += '<b>Dauer: </b>'+durationH+' Stunden<br />';
		if( jquery_dienstplan_opt.is_admin )
			html += '<b>Mitarbeiter: </b>'+dienstplan_week_users_select()+'<br />';

		// Open Dialog
		$(function() {
			$("#dialog").attr('title', 'Bereitschaftszeit anlegen');
			$("#dialog").html(html);
			$("#dialog").dialog({
				resizable: false,
				draggable: true,
				modal: false,
				close: function() {
					$('.dienstplan-week-maintime').removeClass( 'dienstplan-week-date-0' );
					$('.dienstplan-week-maintime').removeClass( 'dienstplan-week-date-1' );
					$('.dienstplan-week-maintime').removeClass( 'dienstplan-week-date-2' );
					$('.dienstplan-week-maintime').removeClass( 'dienstplan-week-date-3' );
					$('.dienstplan-week-black').removeClass( 'dienstplan-week-date-0' );
					$('.dienstplan-week-black').removeClass( 'dienstplan-week-date-1' );
					$('.dienstplan-week-black').removeClass( 'dienstplan-week-date-2' );
					$('.dienstplan-week-black').removeClass( 'dienstplan-week-date-3' );
					jquery_dienstplan_setting.hold = false;
				},
				buttons: {
					'Nein': function() {
						$(this).dialog('close');
					},
					'Ja': function() {
						var url = '';
						url += jquery_dienstplan_url.baseUrl+jquery_dienstplan_url.urls['bookable']['add']+jquery_dienstplan_url.urlParams;
						url += '&start='+(from/1000);
						url += '&duration='+(duration/1000);
						if( jquery_dienstplan_opt.is_admin )
							url += '&maintainer='+jquery_dienstplan_actual_user[0];
						else
							url += '&maintainer='+jquery_dienstplan_opt.current_user_id;
						url += '&technician='+col;

						$.ajax({
							type: 'GET',
							url: url,
							cache: false,
							dataType: 'json',
							success: function(result) {
								if (result.error) {

									dienstplan_week_showError(result.error);
								}
								else {
									var event = new Array(
										'date',
										result.data.id,
										result.data.maintainer,
										col,
										from/1000,
										duration/1000
									);
									jquery_dienstplan_opt.events[jquery_dienstplan_opt.events.length] = event;
									dienstplan_week_drawEvent(event);
								}
							},
							error: function(error) {
								dienstplan_week_showError('unbekannter Fehler');
							}
						});

						$(this).dialog('close');
					}
				}
			});
		});
	}
}

function dienstplan_week_eventAdding_isValidItem( element )
{
	if(!element)
		return false;
	var col = parseInt(colFromTimeslot( element ));
	if(jquery_dienstplan_setting.doing)
		col = parseInt(colFromTimeslot(jquery_dienstplan_setting.first));

	var startElement = element;
	var endElement = element;
	if( jquery_dienstplan_setting.doing )
	{
		endElement = jquery_dienstplan_setting.first;
	}

	if( startTimeFromTimeslot(startElement).getTime() >
		startTimeFromTimeslot(endElement).getTime())
	{
		var tmp = startElement;
		startElement = endElement;
		endElement = tmp;
	}
	var sTimeDate = startTimeFromTimeslot(startElement);
	var eTimeDate = endTimeFromTimeslot(endElement);

	var sTime = sTimeDate.getTime()/1000;
	var eTime = eTimeDate.getTime()/1000;
	for( var i = 0; i < jquery_dienstplan_opt.events.length; i++ )
	{
		if(col != jquery_dienstplan_opt.events[i][3])
			continue;
		eSTime = jquery_dienstplan_opt.events[i][4];
		eETime = jquery_dienstplan_opt.events[i][4]+jquery_dienstplan_opt.events[i][5];

		if( sTime < eSTime && eSTime < eTime )
			return false;
		if( sTime < eETime && eETime < eTime )
			return false;
		if( eSTime < sTime && sTime < eETime )
			return false;
		if( eSTime < eTime && eTime < eETime )
			return false;
		if( eSTime == sTime && eETime == eTime )
			return false;
	}
	return true;
}

function dienstplan_week_timestampFromSlot( element, start )
{
	var regex = /^(\d+)_(\d+)_(\d+)_(\d+)_(\d+)/;
	elementP = regex.exec( $(element).attr('id') );

	date = new Date( parseInt(elementP[1]), parseInt(elementP[2]), parseInt(elementP[3]), parseInt(elementP[4])/**jquery_dienstplan_opt.timeAtom*/, 0, 0 );
	if( start )
		return date.getTime() / 1000;

	return ( date.getTime() / 1000 ) + (jquery_dienstplan_opt.timeAtom*60*60);
}

function dienstplan_update_show_my_box()
{
	if($('#show_my_box').attr('checked'))
	{
		setCookie('dienstplan_show_my_box', '1', 1);
		for( var i = 0; i < jquery_dienstplan_opt.events.length; i++ )
		{
			event = jquery_dienstplan_opt.events[i];
			if( parseInt(event[2]) == parseInt( jquery_dienstplan_opt.current_user_id ) )
			{
				$('.event_id_'+event[1]).addClass('users_event');
			}
		}
	} else
	{
		setCookie('dienstplan_show_my_box', '0', 1);
		$('.users_event').removeClass('users_event');
	}
}

$(document).mouseup( function(event){ dienstplan_week_finishEventAdding( null ); } );

$(document).mousemove(function(event) {
	currentMousePos.x = event.pageX-$(document).scrollLeft();
	currentMousePos.y = event.pageY-$(document).scrollTop();
});
