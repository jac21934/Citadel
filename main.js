

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




var numActive = 0;

function furnaceButton(key, value){

		var numFurnace = 10;

		numActive = clamp( (numActive + value), 0, numFurnace);
		var percentage = numActive/numFurnace * 100;

		document.getElementById("testPogressBar").style.width = percentage + "%";


}



function checkConsumption(obj, timestep){
		var timescale = timestep/1000;
		if(obj["value"] <= 0){
				return;
		}
		if( "consumes" in obj ){

				if( !("disabled" in obj)){
						obj["disabled"] = "FALSE";
				}


				if(obj["disabled"] == "FALSE"){
						for(var key in obj["consumes"]){
								var rate = obj["consumes"][key]["value"] * obj["value"] * timescale; 
								if(resource[key]["value"] - rate < 0){
								}
						}
				}
		}
}





function manageBuildingRates(key){

		var obj = buildings[key];
		var amount = 0;

		if( "consumes" in obj){

				amount = obj["amount_active"];
		}
		else{
				amount = obj["value"];
		}


		for(var resourceKey in obj["rateIncrease"]){

				//remove all building effects
				if( key in resource[resourceKey]["effectedBy"]){
						resources[resourceKey]["rate"] -= obj["rateIncrease"][resourceKey] * amount; 
				}

				//if not disabled add new effects
				if(obj["disabled"] == "FALSE"){
						
				}
		}
}

function manageBuildingConsumption(rate){

		timeStep = rate/1000;
		
		for( var key in buildings){

				
				if("consumes" in buildings[key]){
						if( buildings[key]["value"] > 0
								&& buildings[key]["disabled"] == "FALSE"){
								console.log(key);
								var disabled = "FALSE";
								for( var resourceID in buildings[key]["consumes"]){
										var nextDecr = buildings[key]["value"] *buildings[key]["consumes"][resourceID]["value"] * timeStep;
										if(resources[resourceID]["value"] - nextDecr  <= 0){

												disabled = "TRUE";
												
										}
										
								}
								if(disabled ==  "TRUE"){
										for( var resourceID in buildings[key]["consumes"]){
												resources[resourceID]["rate"] += buildings[key]["value"] *buildings[key]["consumes"][resourceID]["value"];
										}
										for( var resourceID in buildings[key]["rateIncrease"] ){
												resources[resourceID]["rate"] -= buildings[key]["value"] *buildings[key]["rateIncrease"][resourceID]["value"];
										}
								}

								buildings[key]["disabled"] = disabled;
								continue;
						}
						if(buildings[key]["disabled"] == "TRUE"){
								var disabled = "TRUE";
								for( var resourceID in buildings[key]["consumes"]){
										var nextDecr = buildings[key]["value"] *buildings[key]["consumes"][resourceID]["value"] * timeStep;
										if(resources[resourceID]["value"] - nextDecr  >= 0){

												disabled = "FALSE";
												
										}
										
								}

								if(disabled ==  "FALSE"){
										for( var resourceID in buildings[key]["consumes"]){
												resources[resourceID]["rate"] -= buildings[key]["value"] *buildings[key]["consumes"][resourceID]["value"];
										}
										for( var resourceID in buildings[key]["rateIncrease"] ){
												resources[resourceID]["rate"] += buildings[key]["value"] *buildings[key]["rateIncrease"][resourceID]["value"];
										}
								}
								
								
						}
				}
				
		}

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
						document.getElementById("MessageBox").innerHTML = message;
						currentEvent = "none";
						
				}

		}
}
function getDefaultMessage(){

		return "You stand in a small clearing.";

}





function mainLoop() {

		timestep = 10;
		
		manageResources(timestep);
		
		manageDate(2.5);
		manageBuildingButtons();
		displayResources();
		displayPopulation();
		manageUnlocks();
		manageEvents();
		manageFire();
//		manageBuildingConsumption(timestep);
		window.setTimeout("mainLoop()", timestep);
}
