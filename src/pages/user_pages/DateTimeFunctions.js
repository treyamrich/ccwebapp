//Used to change date format for graphql query
export function formatDate(date) { 
	var dd = date.getDate();
	var mm = date.getMonth()+1; //Months start at 0
	var yyyy = date.getFullYear();
	if(dd<10) {
	    dd='0'+dd;
	} 
	if(mm<10) {
	    mm='0'+mm;
	} 
	return(yyyy+'-'+mm+'-'+dd);
}

//Used to subtract two times in a string format HH:MM
export function subtractTime(time1, time2) {
	var time1hr = parseInt(time1.substr(0, 2));
	var time1sec = parseInt(time1.substr(3, 5));

	var time2hr = parseInt(time2.substr(0, 2));
	var time2sec = parseInt(time2.substr(3, 5));
	
	var hrDiff = time2hr - time1hr;
	var secDiff = time2sec - time1sec;

	return hrDiff*60 + secDiff;
}