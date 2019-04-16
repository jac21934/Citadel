var day = 0;
var year = 0;

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
];


function manageDate(rate, timeStep){
		rate *= timeStep;
		var DAYS_IN_YEAR = DAYS_IN_MONTH * months.length;
		rate *= CONVERT_FROM_MS_TO_S;
		time["day"] += rate;
		if(	time["day"] > DAYS_IN_YEAR){ 
				
				time["year"] += 1;
				time["day"] = time["day"] % DAYS_IN_YEAR;
		}
		var month = getMonth(); 
		var dateText = "<tr>";
		dateText += "<td style=\"text-align:left\">";
		dateText += "Year " + time["year"];
		dateText += "</td>";
		
		dateText += "<td style=\"text-align:right\">";
		dateText += month + " " +  getDay();
		dateText += "</td>";


		dateText += "</tr>";
		

		document.getElementById("DateTable").innerHTML = dateText;
		
}

function getYear(){

		return time["year"];
}

function getMonth() {
		return		months[Math.floor(time["day"]/DAYS_IN_MONTH)];
}

function getDay(){

		return ( Math.floor(time["day"]) % DAYS_IN_MONTH + 1);
}


