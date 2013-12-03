

function printDate (date, fmt) {
	return fmt.replace(/%Y/, date.getFullYear()).replace(/%m/, date.getMonth() + 1).replace(/%d/, date.getDate());
}

function addMonths (date, diff) {
	var m1 = date.getMonth();
	var y1 = date.getFullYear();
	var m2 = (y1 * 12 + m1 + diff) % 12;
	var y2 = (y1 * 12 + m1 + diff - m2) / 12;

	return new Date(y2, m2, getMonthDays(y2, m2));
}
function addMonths2 (date, diff, day) {
	var m1 = date.getMonth();
	var y1 = date.getFullYear();
	var m2 = (y1 * 12 + m1 + diff) % 12;
	var y2 = (y1 * 12 + m1 + diff - m2) / 12;
	
	return new Date(y2, m2, day);
}
function getMonthDays (y, m) {
	var isLeap = ((y % 4 == 0) && (y % 100 != 0)) || (y % 400 == 0);
	var MD = [31,28 + (isLeap ? 1 : 0),31,30,31,30,31,31,30,31,30,31];
	return MD[m];
}

function lst2map (lst, prop) {
	var map = {};

	for (var i = 0; i < lst.length; i++) {
		map[enkey(lst[i][prop ||'val' ])] = lst[i];
	}
	
	return map;
}

function enkey (val) {
	return 'val.' + val;
}

function mapget (map, val) {
	return map[enkey(val)] || {} 
}

function parseDate (str) {
	if (!str) {
		return new Date();
	}
	
	var ret = 0;

	getDateStr(str).replace(/(\d{4})[\-\/年](\d{1,2})[\-\/月](\d{1,2})日?/, function (str, y, m, d) {
		ret = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
	});
	
	return ret;
}
function getDateStr (str) {
	if (!str) {
		return '';
	}
	return str.replace(/T.+$/, '');
}


//*******************************duan****************************************

function expanddatelst (date, start, len) {
	var result = [];
	
	for (var i = 0; i < len; i++) {
		result.push(printDate(addMonths(date, start + i), '%Y年%m月'));
	}
	
	return result;
}


function getIndentText (text, layer) {
	var pad = '　　';
	for (var i = 0; i < layer; i++) {
		text = pad + text;
	}
	return text;
}