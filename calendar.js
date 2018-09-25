
var DAYS_IN_YEAR = 325;



var day = 0;
var year = 0;

function manageDate(rate){
		rate /= 1000;
		day += rate;
		if(	day > DAYS_IN_YEAR){ 
				
				year += 1;
				day = day % DAYS_IN_YEAR;
		}
		var month = months[Math.floor(day/25)];		

		var dateText = "<tr>";
		dateText += "<td style=\"text-align:left\">";
		dateText += "Year " + year;
		dateText += "</td>";
		
		dateText += "<td style=\"text-align:right\">";
		dateText += month + " " + ( Math.floor(day) % 25 + 1);
		dateText += "</td>";


		dateText += "</tr>";
		

		
		document.getElementById("DateTable").innerHTML = dateText;
		
}


var months = [
		"Ossuary",
		"Saguinary",
		"Asteneia",
		"Fovos",
		"Caedes",
		"Gula",
		"Cruor",										// Needs name
		"Tectum",
		"Pestis",
		"Macellum",
		"Ira",
		"Lacrima",
		"Pyre"
]
