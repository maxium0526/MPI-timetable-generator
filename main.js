var KEYWORDS = ['Sem', 'Class Code', 'Learning Module', 'Instructor', 'Room', 'Period', 'Time', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', '學期', '班別編號', '學科單元', '講師', '課室', '時期', '時間', '日', '一', '二', '三', '四', '五', '六'];
var REGEXPS = [/Number of classes/, /班別數目/];

var rawInput = $("#raw-input");
var rawSubmit = $("#raw-submit");
var rawResult = $("#raw-result");
var raw = null;
var clearedRaw = null;
var rawCourses = null;
var codeCourses = null;
var objCourses = null; 

function clearRaw(raw, keywords, regexps){
	let strs = raw.split(/(\t|\r\n|\r|\n)/);//split by space, tab and line 
	strs = strs.map(str=>str.trim());//remove useless spaces
	strs = strs.filter(str=>str.length>1);//remove strs length equal or less than 1
	strs = strs.filter(str=>keywords.indexOf(str)<0)//remove strs that belongs to the keywords
	for(let regexp of regexps){
		strs = strs.filter(str=>!regexp.test(str));//remove strs by regexp(s)
	}
	return strs;
}

function toCourses(strs){
	let courses = [];
	let course = null;
	for(let i=0; i<strs.length;i++){
		if(/[A-Z]{2,4}\d{3,4}\-\w{3,5}/.test(strs[i])){
			if(course){
				courses.push(course);
			}
			course = {};
			course.code = strs[i];
			course.strs = [];
			course.sessions = [];
		} else {
			course.strs.push(strs[i]);
		}
	}
	courses.push(course);

	for(let course of courses){
		course.title = course.strs[0];
		for(let i=1; i+3<course.strs.length; i+=4){
			let session = {};
			session.instructor = course.strs[i];
			session.isEnable = true;
			if(course.strs[i+1]=='由講師安排 To be arranged by lecturers'){
				session.room = '-';
				session.period = '-';
				session.time = '-';
				session.isEnable = false;
				i-=2;
			} else {
				session.room = course.strs[i+1];
				session.period = course.strs[i+2];
				session.time = course.strs[i+3];
			}
			course.sessions.push(session);
		}
	}

	return courses;
}

rawSubmit.on("click",function(e){
	objCourses = [];

	raw = rawInput.val();
	clearedRaw = clearRaw(raw, KEYWORDS, REGEXPS);
	console.log(clearedRaw);
	// rawCourses = raw.split(/[A-Z]{2,4}\d{3,4}\-\w{3,5}/);
	// codeCourses = raw.match(/[A-Z]{2,4}\d{3,4}\-\w{3,5}/g);

	// rawCourses.shift();

	// for(let i=0; i<rawCourses.length; i++){
	// 	objCourses.push(toCourseObject(codeCourses[i],rawCourses[i]));
	// }

	objCourses = toCourses(clearedRaw);

	let table = $("#table");
	table.empty();
	table.append($('<tr><td>班別編號</td><td>科目名稱</td><td>講師</td><td>課室</td><td>時期</td><td>時間</td><td>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td></tr>'));

	for(var course of objCourses){		
		for(var session of course.sessions){
			let tr = $("<tr>").attr("id",course.code);
			tr.append($("<td>").append($('<input type="text" class="form-control">').val(course.code)));
			tr.append($("<td>").append($('<input type="text" class="form-control">').val(course.title)));
			tr.append($("<td>").append($('<input type="text" class="form-control">').val(session.instructor)));
			tr.append($("<td>").append($('<input type="text" class="form-control">').val(session.room)));
			tr.append($("<td>").append($('<input type="text" class="form-control">').val(session.period)));
			tr.append($("<td>").append($('<input type="text" class="form-control">').val(session.time)));

			tr.append($("<td>").append($('<input type="checkbox" class="form-control">')));
			tr.append($("<td>").append($('<input type="checkbox" class="form-control">')));
			tr.append($("<td>").append($('<input type="checkbox" class="form-control">')));
			tr.append($("<td>").append($('<input type="checkbox" class="form-control">')));
			tr.append($("<td>").append($('<input type="checkbox" class="form-control">')));
			tr.append($("<td>").append($('<input type="checkbox" class="form-control">')));
			tr.append($("<td>").append($('<input type="checkbox" class="form-control">')));

			tr.appendTo(table);
		}
	}
	$("#step-2").css("visibility","visible");
	table.css("visibility","visible");
	$("#table-submit").css("visibility","visible");
	
	console.log(toCourses(clearedRaw))
});

// function toCourseObject(code, raw){
// 	result = {};
// 	result.code = code;
// 	args = raw.split(/(\t|\r\n|\r|\n)/).map(arg=>arg.trim()).filter(arg=>arg.length>1);
// 	result.title = args[0];
// 	result.sessions = [];
// 	for(let i=1; i+3<args.length; i=i+4){
// 		let session = {};
// 		session.instructor = args[i];
// 		if(args[i+1]=='由講師安排 To be arranged by lecturers'){
// 			session.room = '-';
// 			session.period = '-';
// 			session.time = '-';
// 			i-=2;
// 		} else {
// 			session.room = args[i+1];
// 			session.period = args[i+2];
// 			session.time = args[i+3];
// 		}
		

// 		if(session.period.split("-").length===1) session.period = session.period+"-"+session.period; //for single-day session

// 		result.sessions.push(session);
// 	}
// 	return result;
// }

$("#table-submit").on("click",function(e){
	checkbox = $('input[type=checkbox]');

	let objSessions = [];

	let trs = $("#table").find("tr");
	for(let tr of trs){
		tds = $(tr).find("td");
		if(/[A-Z]{4}\d{3,4}\-\w{3,5}/.test(tds.eq(0).find('input[type="text"]').val())){
			let dows = [];
			for(let i=0; i<7; i++){
				if(tds.eq(i+6).find('input[type="checkbox"]').eq(0).prop("checked")) dows.push(i);
			}
			objSessions.push({
				code: tds.eq(0).find('input[type="text"]').val(),
				title: tds.eq(1).find('input[type="text"]').val(),
				instructor: tds.eq(2).find('input[type="text"]').val(),
				room: tds.eq(3).find('input[type="text"]').val(),
				period: tds.eq(4).find('input[type="text"]').val(),
				time: tds.eq(5).find('input[type="text"]').val(),
				dows: dows
			});
		}
	}

	let eventSources = [];
	let minTimeFrom = "2359";
	let maxTimeTo = "0000";
	for(let session of objSessions){
		let events = [];

		

		if(session.period=='-'){
			session.from = null;
			session.to = null;
		} else {
			let dates = session.period.split("-");
			session.from = new Date(dates[0]);
			session.to = new Date(dates.length===1?dates[0]:dates[1]);  //for single-day session
		}

		if(session.time=='-'){
			session.timeFrom = null;
			session.timeTo = null;
		} else {
			let timeFrom = session.time.split("-")[0].replace(":","");
	 		let timeTo = session.time.split("-")[1].replace(":","");
	 		session.timeFrom = timeFrom;
	 		session.timeTo = timeTo;

			if(timeFrom<minTimeFrom) minTimeFrom = timeFrom;
			if(timeTo>maxTimeTo) maxTimeTo = timeTo;
		}

		session.classes = [];
		for(let dow of session.dows){

			//compute the first day 
			let firstDay = new Date(session.from.getTime());
			firstDay.setDate(firstDay.getDate()-firstDay.getDay()+dow);
			//the first day above might be out of the range of the peroid. if yes, add more 1 week
			if(firstDay < session.from){
				firstDay.setDate(firstDay.getDate()+7)
			}

			//push classes use for, for(first day, peroid, +1 week)
			for(let sessionDate = firstDay; sessionDate <= session.to; sessionDate.setDate(sessionDate.getDate()+7)){
				session.classes.push({
					date: new Date(sessionDate.getFullYear(),sessionDate.getMonth(), sessionDate.getDate())
				})
				console.log(sessionDate,session.to)
			}
			
		}
		for(let c of session.classes){
			events.push({
				title: session.title,
				start: c.date.getFullYear()+"-"+("0"+(c.date.getMonth()+1)).slice(-2)+"-"+("0"+c.date.getDate()).slice(-2)+"T"+session.timeFrom.substring(0,2)+":"+session.timeFrom.substring(2,4)+":00",
				end: c.date.getFullYear()+"-"+("0"+(c.date.getMonth()+1)).slice(-2)+"-"+("0"+c.date.getDate()).slice(-2)+"T"+session.timeTo.substring(0,2)+":"+session.timeTo.substring(2,4)+":00"
			})
		}

		eventSources.push(events);
	}

	console.log(objSessions);
	console.log(eventSources)

	calendar = $("#calendar").fullCalendar({
		defaultView: 'agendaWeek',
		allDaySlot: false,
		minTime: minTimeFrom.substring(0,2)+":00:00",
		maxTime: (parseInt(maxTimeTo.substring(0,2))+1).toString()+":00:00",

		eventSources: eventSources
	});

	console.log(minTimeFrom)
	console.log(maxTimeTo)
	
});

