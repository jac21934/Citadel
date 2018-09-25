var buildingButtons = [];

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


function getDescriptionText(categoryKey, key){
		var text = "";

		text += "<div style='text-align:center'>";

		text += category[categoryKey][key]["description"];

		text += "</div> <br><br>";

		
		text += "<div style='text-align:center'>";

		text +=  "Cost";

		text += "</div>";
		
		text += "<hr>";

		for( newKey in category[categoryKey][key]["cost"]){
				text += newKey.replace(/^\w/, c => c.toUpperCase());
				text += "&emsp;";
				text += category[categoryKey][key]["cost"][newKey];
				text += "<br>";
		}
		text += "<br>";
		text += "<div style='text-align:center'>";

		text +=  "Effects";

		text += "</div>";
		
		text += "<hr>";	
		if("rateIncrease" in category[categoryKey][key]){
				for( newKey in category[categoryKey][key]["rateIncrease"]){
						text += newKey.replace(/^\w/, c => c.toUpperCase());
						text += "&emsp;";
						text += category[categoryKey][key]["rateIncrease"][newKey]["amount"];
						text += "/" + category[categoryKey][key]["rateIncrease"][newKey]["units"]; 
						text += "<br>";
				}
		}

		if("consumes" in category[categoryKey][key]){
				for( newKey in category[categoryKey][key]["consumes"]){
						text += newKey.replace(/^\w/, c => c.toUpperCase());
						text += "&emsp;";
						text += category[categoryKey][key]["consumes"][newKey]["value"];
						text += "/" + category[categoryKey][key]["consumes"][newKey]["units"]; 
						text += "<br>";
				}
		}






		if("resourceCapIncrease" in category[categoryKey][key]){
				for( newKey in category[categoryKey][key]["resourceCapIncrease"]){
						text += newKey.replace(/^\w/, c => c.toUpperCase());
						text += " Cap&emsp; +";
						text += category[categoryKey][key]["resourceCapIncrease"][newKey];
						text += "<br>";
				}
				
		}
		if("popCapIncrease" in category[categoryKey][key]){
				for( newKey in category[categoryKey][key]["popCapIncrease"]){
						text += newKey.replace(/^\w/, c => c.toUpperCase());
						text += " Cap&emsp; +";
						text += category[categoryKey][key]["popCapIncrease"][newKey];
						text += "<br>";
				}
				
		}

		

		return text;
		
}

function resourceButton(key){
		if(resources[key]["value"] < resources[key]["resourceCap"]){
				//				resources[key]["value"] = Math.min( (resources[key]["value"] + 1), resources[key]["resourceCap"]);
				addToResource(key ,100);
		}
		displayResources();
}




function buildingButton(key){
		console.log(key + " " + buildings[key]["value"]);
		
		buildings[key]["value"] += 1;

		console.log(key + " " + buildings[key]["value"]);

 		for( var newKey in buildings[key]["cost"]){
				resources[newKey]["value"] -= buildings[key]["cost"][newKey];
				buildings[key]["cost"][newKey] = buildings[key].process();
				

				
		}
		
		

		if( "rateIncrease" in buildings[key]){
				for( var newKey in buildings[key]["rateIncrease"]){
						resources[newKey]["rate"] += buildings[key]["rateIncrease"][newKey]["amount"];
						
				}
		}

		if( "consumes" in buildings[key]){
				for( var newKey in buildings[key]["consumes"]){
						resources[newKey]["rate"] -= buildings[key]["consumes"][newKey]["value"];
						
				}
		}


		if( "resourceCapIncrease" in buildings[key]){
				for( var newKey in buildings[key]["resourceCapIncrease"]){
						resources[newKey]["resourceCap"] += buildings[key]["resourceCapIncrease"][newKey];
						
				}
		}

		if( "popCapIncrease" in buildings[key]){
				for( var newKey in buildings[key]["popCapIncrease"]){
						
						population[newKey]["resourceCap"] += buildings[key]["popCapIncrease"][newKey];
						
				}
		}
		

		
		var nameText = key.replace(/^\w/, c => c.toUpperCase());

		var number = buildings[key]["value"];

		nameText += ' (' + number + ')';

		document.getElementById(key).innerHTML = nameText;

		var keyID = key + "ID";

		document.getElementById(keyID).title = getDescriptionText("buildings", key);
		
		displayResources();
		
}


// function manageBuildingConsumption(){

// 		for( var key in buildings){

				
// 				if("consumes" in buildings[key]
// 					 && buildings[key]["value"] > 0
// 					 && buildings[key]["disabled"] == "FALSE"){
// 						console.log(key);
// 						var disabled = "FALSE";
// 						for( var resourceID in buildings[key]["consumes"]){
// 								console.log(buildings[key]["value"] *buildings[key]["consumes"][resourceID]["value"]);
// 								if(resources[resourceID]["value"] - buildings[key]["value"] *buildings[key]["consumes"][resourceID]["value"] <= 0){

// 										disabled = "TRUE";
// 										resources[resourceID]["rate"] += buildings[key]["value"] *buildings[key]["consumes"][resourceID];
// 								}
// 						}
// 						buildings[key]["disabled"] = disabled;
						
// 				}

// 		}

// }

function manageBuildingButtons(){
		var text = "";


		for (var key in buildings){
				if(buildings[key]["discovered"] == "TRUE"
					 && !buildingButtons.includes(key)
					){
						if(!displayBuildings){
								document.getElementById("BuildingsButton").style = "block";
								displayBuildings = true;

						}
						buildingButtons.push(key);
						var descriptionText = getDescriptionText("buildings", key);
						var keyID = key + "ID";
						
						text += "<div id=\'" + keyID + "\'  tabindex='0'  style='highlight:none;width: max-content;height=max-content;display:inline-block;'  title=";
						text += '\"' + descriptionText + '\" >';
						
						text += '<button id="';
						text += key;
						text+= '" type="button" class="button building disallowed"';
						text += ' onclick="buildingButton(\'' + key + '\')"';
						
						text += " style='pointer-events: none;'";
						text += " disabled";
						text +=">";
						text += key.replace(/^\w/, c => c.toUpperCase());
						text += '</button>';
						text += "</div>";
				}
				
		}

		if(text != ""){
				var x = document.getElementsByClassName("ui-tooltip");
				console.log(x[0]);
				console.log(typeof(x[0]));				
				x[0].parentNode.removeChild(x[0]);
				document.getElementById("Buildings").innerHTML += text;
		}
		checkBuildingButtons();
}


function checkBuildingButtons(){
		
	  var i, buttons;
    buttons = document.getElementsByClassName("building");
		for (i = 0; i < buttons.length; i++) {
				
				if(buttons[i].disabled){
			 			if(checkBuildingCost(buttons[i].id)){
								buttons[i].className = 	buttons[i].className.replace(" disallowed",  "");
								buttons[i].disabled = false;
								buttons[i].style.pointerEvents = "auto";
			 			}
				}
				else{
						if(!checkBuildingCost(buttons[i].id)){
								buttons[i].className += " disallowed";
								buttons[i].disabled = true;
								buttons[i].style.pointerEvents = "none";								
						}
				}
		}
}

function checkBuildingCost(key){

		var canBuild = true;

		for( var newKey in buildings[key]["cost"]){

				if(resources[newKey]["value"] < buildings[key]["cost"][newKey]){
						canBuild = false;
				}
		}

		return canBuild;

}




function manageUnlocks(){


		for( var thing in category){

				for(var object in category[thing]) {
						var unlock = "TRUE";
						
						if(category[thing][object]["discovered"] == "FALSE"){
								for(var reqClass in category[thing][object]["unlockReqs"]){
										for( var subReq in category[thing][object]["unlockReqs"][reqClass]){
												
												if(	category[reqClass][subReq]["discovered"] == "FALSE" ||
														category[reqClass][subReq]["value"] < category[thing][object]["unlockReqs"][reqClass][subReq]){
														unlock  = "FALSE";
														break;
												}
										}
										if( unlock == "FALSE"){
												break;
										}

								}
						}
						category[thing][object]["discovered"] = unlock;
				}
		}
}		


function displayResources(){
		var text = "";

		for( var key in resources){
				if( resources[key]["discovered"] == "TRUE"){

						var value =  resources[key]["value"];
						value = Math.round(value * 10) / 10;
						
						text += "<tr>";
						text += "<td>" + key.replace(/^\w/, c => c.toUpperCase()) + "</td>";
						text += "<td>" + value  + "</td>";
						text += "<td>/" +  resources[key]["resourceCap"] + "</td>";
						text += "<td>" + "(" + resources[key]["rate"] + "/" + resources[key]["rateUnits"] + ")"  + "</td>";
						text += "</tr>";
				}
		}

		document.getElementById("resourceTable").innerHTML = text;

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
				if( population[key]["discovered"] == "TRUE"){

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


function addToResource(key, amount){
				resources[key]["value"] = Math.max(0, Math.min((resources[key]["value"] + amount), resources[key]["resourceCap"]));
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

		
		for( var key in resources){
				if( resources[key]["discovered"] == "TRUE"){
						var toAdd = resources[key]["rate"]/100;
						addToResource(key, toAdd);

				}
		}
		
		manageDate(10);
		manageBuildingButtons();
		displayResources();
		displayPopulation();
		manageUnlocks();
		manageEvents();
		manageFire();
	//	manageBuildingConsumption();
		window.setTimeout("mainLoop()", 10);
}
