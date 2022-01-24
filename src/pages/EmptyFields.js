//Highlights input fields red if they're empty. Returns true if any fields were empty.
export function checkEmptyFields(fieldName) { 
	var empty = false; //flag variable
	var arr = document.getElementsByClassName(fieldName);
	for(var i=0; i<arr.length;i++){
        if(arr[i].value === "") {
        	empty = true;
            arr[i].style.borderColor = "red";
        } else {
        	arr[i].style.borderColor = "";
        }
	}
	if(empty) {
		return true; //If there are any empty fields
	} else { //Otherwise, reset to input styles to black
		for(var j=0; j<arr.length;j++){
	        arr[j].style.borderColor = "";
		}
	}
	return false;
}