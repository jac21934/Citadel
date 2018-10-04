var currentEvents;

var OldTime;
var NewTime;

var displayPop = false;
var displayBuildings = false;
var category = {
		"resources" : resources,
		"buildings" : buildings,
		"population" :population,
		"events" : events,
		"miscellaneous" : miscellaneous,
};




function clamp(num, min, max){
		return Math.min(Math.max(num, min), max);
}

function randomInteger(min,max){
		return Math.floor(Math.random() * (max - min) + min );
}



function getActiveFurnaceFraction(key){

		if( !("consumes" in buildings[key])){
				return 1;
		}

		return  buildings[key]["amount_active"]/ buildings[key]["value"];

}


function lookAround(){

		flags["lookAround"] = true;


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


function exploreButton(){
		var rollTheDice = Math.random();
		var rollFailed = true;
		closeEvent("ExploringFailed");

		//Check discoveries in order
		if(!flags["Mine_Discovered"]){
				if( rollTheDice < MINE_DISCOVER_CHANCE){
						flags["Mine_Discovered"] = true;
						rollFailed = false;		
				}
		}
		else if(!flags["Overlook_Discovered"]){
				if( rollTheDice < OVERLOOK_DISCOVER_CHANCE){
						flags["Overlook_Discovered"] = true;
						rollFailed = false;
				}
		}

		
		if(rollFailed){

				flags["Exploring_Failed"] = true;
		}
		else{

				flags["Exploring_Failed"] = false;
		}


		for(var i = 0; i < currentEvents.length; i++){
				
				if(currentEvents[i].includes("Explore")){
						closeEvent(key);
				}
		}

		manageEvents();
				
}


function closeEvent(key){
		//remove event correctly
		

		if(!(currentEvents.includes(key))){
				return;
		}
		console.log(currentEvents);
		
		removeMessage(key);
		var buffEvents = [];
		for(var i = 0; i < currentEvents.length; i++){
				if (currentEvents[i] != key){
						buffEvents.push(currentEvents[i]);
				}
		}
		currentEvents = buffEvents;

		events[key]["shown"] = "TRUE";

		if(events[key]["repeatable"] == "TRUE"){
				events[key]["shown"] = "FALSE";
				events[key]["discovered"] = "FALSE";
				for(var flag in events[key]["unlockBools"]){
						flags[flag] = false;
				}
		}
		
		console.log(currentEvents);
		console.log("\n");
}

function disableFurnace(key){

		var barID = key + "BarID";
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
														break;
												}
												else{
														if(	(category[reqClass][subReq]["discovered"] == "FALSE"
																 && subReq != object) 
																|| category[reqClass][subReq]["value"] < category[thing][object]["unlockReqs"][reqClass][subReq]){
																unlock  = "FALSE";
																break;
														}
												}
										}
										if( unlock == "FALSE"){
												break;
										}

								}
								if("unlockBools" in category[thing][object]){
										for(var reqBool in category[thing][object]["unlockBools"]){
												if(typeof(flags[reqBool]) == "undefined"){
														console.log( "ERROR: " + object + " requirement flag " + reqBool + " not found");
														unlock = "FALSE";
														break;
												}
												else{
														
														if(flags[reqBool] != category[thing][object]["unlockBools"][reqBool]){
																unlock = "FALSE";
																break;
														}
												}
										}
								}
								category[thing][object]["discovered"] = unlock;
						}

				}
		}
}		


pops = [];




function switchRightTabs(evt, tabName){
    var i, tabcontent, tablinks;
		var flagName = tabName + "Clicked";
		
    tabcontent = document.getElementsByClassName("righttabcontent");
		for (i = 0; i < tabcontent.length; i++) {
				tabcontent[i].style.display = "none";
				var flag = tabcontent[i].id + "Clicked";
				flags[flag] = false;

		}
    tablinks = document.getElementsByClassName("righttablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");

    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
		flags[flagName] = true;

}



function switchLeftTabs(evt, tabName){
    var i, tabcontent, tablinks;
		var flagName = tabName + "Clicked";

		tabcontent = document.getElementsByClassName("lefttabcontent");
		for (i = 0; i < tabcontent.length; i++) {
				tabcontent[i].style.display = "none";
				var flag = tabcontent[i].id + "Clicked";
				flags[flag] = false;
				
		}
    tablinks = document.getElementsByClassName("lefttablinks");

    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
				
    }
    document.getElementById(tabName).style.display = "block";

		flags[flagName] = true;
		
    evt.currentTarget.className += " active";
}



function removeMessage(id){
		id += "Message";
		
		var messages = document.getElementsByClassName("message");
		
		var messageCounter = 0;
		
		for( var i = 0; i < messages.length; i++){
				if(messages[i].id == id){
						updateLog(messages[i].innerHTML);
						document.getElementById("MessageBox").removeChild(messages[i]);
//						break;

				}
		}

		var messages = document.getElementsByClassName("message");

		if(messages.length == 0){

				addDefaultMessage();
		}

}


function addMessage(message, id){
		//		console.log(document.getElementById("MessageBox").childNodes);

		if(id == "default"){
				console.log("ERROR: id = \"default\" is reserved.");
				return;
		}
		
		
		
		id += "Message";
		document.getElementById("MessageBox").innerHTML += "<p class=\'message\' id=\'" + id + "\'>" +  message + "</p>";		

		var defaultMessageBox = document.getElementById("defaultMessage");
		if(typeof(defaultMessageBox) != "undefined"){
				removeDefaultMessage();
		}

		


}

function addDefaultMessage(){
		document.getElementById("MessageBox").innerHTML = "<p class=\'message\' id=\'defaultMessage\'>" +  getDefaultMessage() + "</p>" + 	document.getElementById("MessageBox").innerHTML ;		
}

function removeDefaultMessage(){

		if(document.getElementById("defaultMessage") != null){
				updateLog(document.getElementById("defaultMessage").innerHTML);
				
				document.getElementById("MessageBox").removeChild(document.getElementById("defaultMessage"));
		}
		
}


function checkForNewEvents(){
		for(var key in events){
				
				if(events[key]["discovered"] == "TRUE"
					 && events[key]["shown"] == "FALSE"
					 && !(currentEvents.includes(key))
					){
						currentEvents.push(key);
						events[key].misc();
						addMessage(events[key]["message"], key);
				}
		}
		
}

function checkCurrentEvents(){
		for( var i = 0; i < currentEvents.length; i++){
				key =  currentEvents[i];
				var shown = "TRUE";
				for( var reqClass in events[key]["shownReqs"]){
						for( var subReq in events[key]["shownReqs"][reqClass]){
								if(	category[reqClass][subReq]["discovered"] == "FALSE" ||
										category[reqClass][subReq]["value"] < events[key]["shownReqs"][reqClass][subReq]){
										shown  = "FALSE";
										break;
								}
						}
						if( shown == "FALSE"){
								break;
						}
				}
				if( shown == "TRUE"){
						for( var reqBool  in events[key]["shownBools"]){
								if( flags[reqBool] != events[key]["shownBools"][reqBool]){
										shown = "FALSE";
										break;								
								}
						}
				}
				events[key]["shown"] = shown;

				if(events[key]["shown"] == "TRUE"){
						console.log(key + " needs to be closed");
						// //remove event correctly
						// removeMessage(key);
						// if(events[key]["repeatable"] == "TRUE"){
						// 		events[key]["shown"] = "FALSE";
						// 		events[key]["discovered"] = "FALSE";
						// }
						
						closeEvent(key);
				}
				
		}

}

function manageEvents(){
		
		//handle activating new events
		checkForNewEvents();

		//handle removing old events
		checkCurrentEvents();
		
}




function getDefaultMessage(){
		var message = "";

		if(events["litAFire"]["discovered"] == "TRUE"){
				message = "You stand in a small campsite.";
		}
		else{
				message = "You stand in a small clearing.";
		}
		return message; 

}



function updateLog(message){

		var logText = "<tr>";


		
		logText += "<td style=\"vertical-align: top;text-align:text-top\" width=\"15%\">[Year " + getYear() + ", " + getMonth() + " " + getDay() + "]</td> ";
		logText += "<td width=\"85%\">" +  message + "</td>";

		logText += "</tr>";
		logText += "<tr></tr>";


		document.getElementById("LogContent").innerHTML = logText + document.getElementById("LogContent").innerHTML;

}


function loadGame(){
		currentEvents = new Array(0);
		
		requestAnimationFrame(mainLoop);

}


var oldTimeStamp = 0;

function mainLoop(timeStamp) {

		var timestep = timeStamp - oldTimeStamp;
		var gameTimeRate = 0.1; // the rate at which ingame time flows, 2.5 felt right, might change later...		

		manageUnlocks();

		
		displayResources();
		displayPopulation();
		displayScience();
		
		manageDate(gameTimeRate, timestep);
		manageResources(timestep);
		
		manageBuildingButtons();
		manageEvents();
		manageFire();

		

		managePopulation(timestep);
		manageBuildingConsumption(timestep);

		oldTimeStamp = timeStamp;
		requestAnimationFrame(mainLoop);
		
}
