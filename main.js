

var displayPop = false;
var displayBuildings = false;
var category = {
		"resources" : resources,
		"buildings" : buildings,
		"population" :population,
		"events" : events,
		"miscellaneous" : miscellaneous
};


var currentEvent = "none";


function clamp(num, min, max){
		return Math.min(Math.max(num, min), max);
}




function getActiveFurnaceFraction(key){

		if( !("consumes" in buildings[key])){
				return 1;
		}

		return  buildings[key]["amount_active"]/ buildings[key]["value"];

}


function setFurnaceBar(key){

		var percentage = clamp( (getActiveFurnaceFraction(key) * 100), 0, 100);
		
		var barID = key + "BarID";

		document.getElementById(barID).style.width = percentage + "%";
}

function furnaceButton(key, value){

		buildings[key]["amount_active"] = clamp( (buildings[key]["amount_active"] + value), 0, buildings[key]["value"]);
		setFurnaceBar(key);
		for( var resourceKey in buildings[key]["consumes"]){
				calcAndSetResourceRate(resourceKey, key);

		}
		for( var resourceKey in buildings[key]["rateIncrease"]){
				calcAndSetResourceRate(resourceKey, key);

		}


		document.getElementById(key).innerHTML = getNameText(key);

		
}

function disableFurnace(key){

		var barID = key + "BarID";
		console.log("here");
		document.getElementById(barID).className += " furnaceDisabled";

}

function enableFurnace(key){
		var barID = key + "BarID";

		document.getElementById(barID).className = document.getElementById(barID).className.replace(" furnaceDisabled", "");

}





function manageUnlocks(){


		for( var thing in category){

				for(var object in category[thing]) {
						var unlock = "TRUE";
						
						if(category[thing][object]["discovered"] == "FALSE"){
								for(var reqClass in category[thing][object]["unlockReqs"]){
										for( var subReq in category[thing][object]["unlockReqs"][reqClass]){
												if(typeof(category[reqClass][subReq]) == "undefined"){
														console.log( "ERROR: " + object + " requirement " + subReq + " not found");
														unlock = "FALSE";
												}
												else{
														if(	category[reqClass][subReq]["discovered"] == "FALSE" ||
																category[reqClass][subReq]["value"] < category[thing][object]["unlockReqs"][reqClass][subReq]){
																unlock  = "FALSE";
																break;
														}
												}
										}
										if( unlock == "FALSE"){
												break;
										}

								}
								category[thing][object]["discovered"] = unlock;
						}

				}
		}
}		



function displayPopulation(){
		var text = "";

		if(!displayPop){
				var numPop = 0;
				for( var key in population){
						numPop += population[key]["resourceCap"];
				}
				if(numPop > 0){
						displayPop = true;
						document.getElementById("ResourcesTab").style.width = "50%";
						document.getElementById("PopulationTab").style.display = "block";
						document.getElementById("PopulationTab").style.width = "50%";

						
				}
		}

		
		
		for( var key in population){
				if( population[key]["discovered"] == "TRUE"
						&& population[key]["resourceCap"] > 0
					){

						var value =  population[key]["value"];
						value = Math.floor(value);
						
						text += "<tr>";
						text += "<td>" + key.replace(/^\w/, c => c.toUpperCase()) + "</td>";
						text += "<td>" + value  + "</td>";
						text += "<td>/" +  population[key]["resourceCap"] + "</td>";
						text += "</tr>";
				}
		}

		document.getElementById("populationTable").innerHTML = text;

}



function switchRightTabs(evt, tabName){
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("righttabcontent");
		for (i = 0; i < tabcontent.length; i++) {
				tabcontent[i].style.display = "none";
		}
    tablinks = document.getElementsByClassName("righttablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}



function switchLeftTabs(evt, tabName){
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("lefttabcontent");
		for (i = 0; i < tabcontent.length; i++) {
				tabcontent[i].style.display = "none";
		}
    tablinks = document.getElementsByClassName("lefttablinks");

    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}




function manageEvents(){

		if(currentEvent == "none"){

				for(var key in events){
						if(events[key]["discovered"] == "TRUE"
							 && events[key]["shown"] == "FALSE"
							){
								currentEvent = events[key];
								updateLog(document.getElementById("MessageBox").innerHTML);
								document.getElementById("MessageBox").innerHTML = currentEvent["message"];
								currentEvent.misc();
						}
				}
		}
		else{
				var shown = "TRUE";
				for(var reqClass in currentEvent["shownReqs"]){
						for( var subReq in currentEvent["shownReqs"][reqClass]){
								if(	category[reqClass][subReq]["discovered"] == "FALSE" ||
										category[reqClass][subReq]["value"] < currentEvent["shownReqs"][reqClass][subReq]){
										shown  = "FALSE";
								}
								
						}
				}
				currentEvent["shown"] = shown;
				if(shown == "TRUE"){
						var message = getDefaultMessage();
						updateLog(document.getElementById("MessageBox").innerHTML);
						document.getElementById("MessageBox").innerHTML = message;
						currentEvent = "none";
						
				}

		}
}
function getDefaultMessage(){

		return "You stand in a small clearing.";

}



function updateLog(message){

		var logText = "<p>[Year " + getYear() + ", " + getMonth() + " " + getDay() + "] " + message + "</p>";



		document.getElementById("LogContent").innerHTML = logText + document.getElementById("LogContent").innerHTML;

}



function mainLoop() {


		timestep = 10;  // actual number of miliseconds the function repeats in
		gameTimeRate = 2.5; // the rate at which ingame time flows, 2.5 felt right, might change later...

		
		manageDate(gameTimeRate);
		manageUnlocks();
		
		manageResources(timestep);
		
		manageBuildingButtons();
		manageEvents();
		manageFire();


		managePopulation(timestep);
		
		
		displayResources();
		displayPopulation();

		
		manageBuildingConsumption(timestep);
		window.setTimeout("mainLoop()", timestep);
}
