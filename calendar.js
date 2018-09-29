var DAYS_IN_MONTH = 25;




var day = 0;
var year = 0;

function manageDate(rate){

		var DAYS_IN_YEAR = DAYS_IN_MONTH * months.length;
		rate /= 1000;
		day += rate;
		if(	day > DAYS_IN_YEAR){ 
				
				year += 1;
				day = day % DAYS_IN_YEAR;
		}
		var month = months[Math.floor(day/DAYS_IN_MONTH)];		

		var dateText = "<tr>";
		dateText += "<td style=\"text-align:left\">";
		dateText += "Year " + year;
		dateText += "</td>";
		
		dateText += "<td style=\"text-align:right\">";
		dateText += month + " " + ( Math.floor(day) % DAYS_IN_MONTH + 1);
		dateText += "</td>";


		dateText += "</tr>";
		

		
		document.getElementById("DateTable").innerHTML = dateText;
		
}

function getYear(){

		return year;
}

function getMonth() {
		return		months[Math.floor(day/DAYS_IN_MONTH)];
}

function getDay(){

		return ( Math.floor(day) % DAYS_IN_MONTH + 1);
}

var months = [
		"Ossuary",
		"Saguinary",
		"Asteneia",
		"Fovos",
		"Caedes",
		"Gula",
		"Cruor",
		"Tectum",
		"Pestis",
		"Macellum",
		"Ira",
		"Lacrima",
		"Pyre"
]
