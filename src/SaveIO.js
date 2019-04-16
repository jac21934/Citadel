function downloadSaveFile() {
		var element = document.createElement('a');

		var save_name = "Citadel_" + getMonth() + "_"  + getDay() + "_" +  getYear() + ".save";
		var text = "";


		text = "TIME=" + getTimeSaveString() + "\n";
		text += "FLAGS=" + getFlagsSaveString() + "\n";
		text += "RESOURCES=" + getResourceSaveString() + "\n";
		text += "BUILDINGS=" + getBuildingSaveString() + "\n";
		text += "POPULATION=" + getPopulationSaveString() + "\n";
		
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', save_name);

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();
		
		document.body.removeChild(element);
}

function NewDownloadSaveFile() {
		var element = document.createElement('a');

		var save_name = "Citadel_" + getMonth() + "_"  + getDay() + "_" +  getYear() + ".save";
		var text = "";

		// console.log(JSON.stringify(saveEventsJSON()));
		// all JSON objects saved
		text =  "TIME=" + JSON.stringify(time) + "\n";
		text += "FLAGS=" + JSON.stringify(saveFlagsJSON()) + "\n";
		text += "EVENTS=" + JSON.stringify(saveEventsJSON()) + "\n";
		text += "RESOURCES=" + JSON.stringify(saveResourcesJSON()) + "\n";
		text += "BUILDINGS=" + JSON.stringify(saveBuildingsJSON()) + "\n";
		text += "POPULATION=" + JSON.stringify(savePopulationJSON()) + "\n";

		// get current message vector
		// text += "MESSAGES=" + currentEvents.toString() + "\n";

		// text += "HTML=" + document.getElementsByTagName("BODY")[0].innerHTML + "\n";
		// console.log( document.getElementsByTagName("BODY")[0].innerHTML);
		
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', save_name);

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();
		
		document.body.removeChild(element);
}

function getHTML(string){

		var htmlBuff = string.split("HTML=");

		var htmlString = "";
		
		if(htmlBuff.length == 2){

				htmlString = htmlBuff[1];
				if( htmlString.charAt(htmlString.length - 1) == "\n"){
						htmlString = htmlString.slice(0,-1);
				}
				
				
		}
		
		return htmlString;
}

function NewLoadSave(saveString){

		var savArr = saveString.split('\n');
		
		var buffArr;
		
		for(var i = 0; i < savArr.length; i++){
				if(savArr[i] == ""){
						continue;
				}

				buffArr = savArr[i].split('=');

				if(buffArr.length == 2){

						switch(buffArr[0]) {
						case "TIME":	
								time = JSON.parse(buffArr[1]);
								
								break;
								
						case "FLAGS":
								setFlagsFromJSON(JSON.parse(buffArr[1]));
								break;

						case "EVENTS":
								setEventsFromJSON(JSON.parse(buffArr[1]));
								reloadEvents();
								break;
								
						case "RESOURCES":
								setResourcesFromJSON(JSON.parse(buffArr[1]));
								break;
								
						case "BUILDINGS":
								setBuildingsFromJSON(JSON.parse(buffArr[1]));
								break;

						case "POPULATION":
								setPopulationFromJSON(JSON.parse(buffArr[1]));
								break;

						case "MESSAGES":
								console.log(buffArr[1]);
								break;
						}
				}
		}
}

function saveEventsJSON(){


		var saveEvents = {};

		for( var event in events){

				if(events[event]["discovered"] == "TRUE"){
						saveEvents[event] = events[event]["shown"];
						// saveEvents[event]["discovered"] = "TRUE";
						// saveEvents[event]["shown"] = events[event]["shown"];
				}

		}

		return saveEvents;
		
}

function saveFlagsJSON(){

		var saveFlags = {};

		for( var flag in flags){
				if( (defaultTrueFlags.includes(flag) && flags[flag] == false)
						|| flags[flag] == true
					){
						saveFlags[flag] = flags[flag];
				}

		}

		return saveFlags;
}


function saveResourcesJSON(){

		var saveRes = {};

		for(var res in resources){
				if(resources[res]["discovered"] == "TRUE"){
						saveRes[res] = {};
						saveRes[res]["value"] = resources[res]["value"];
						saveRes[res]["resourceCap"] = resources[res]["resourceCap"];
						saveRes[res]["rate"] = resources[res]["rate"];
				}
				
		}

		return saveRes;
}


function saveBuildingsJSON(){

		var saveBuild = {};
		
		for(var build in buildings){
				if(buildings[build]["discovered"] == "TRUE"){
						saveBuild[build] = {};
						saveBuild[build]["value"] = buildings[build]["value"];
						saveBuild[build]["amount_active"] = buildings[build]["amount_active"];
						saveBuild[build]["disabled"] = buildings[build]["disabled"];
						if("resourseCapLimited" in buildings[build]){
								saveBuild[build]["resourseCapLimited"] = buildings[build]["resourseCapLimited"];
						}
						if("consumptionLimited" in buildings[build]){
								saveBuild[build]["consumptionLimited"] = buildings[build]["consumptionLimited"];
						}
						
				}
		}
		console.log(saveBuild);
		return saveBuild;
}

function savePopulationJSON(){

		var savePop = {};

		for( var pop in population){
				if(population[pop]["discovered"] ==  "TRUE"){

						savePop[pop] = {};

						savePop[pop]["value"] = population[pop]["value"];
						savePop[pop]["resourceCap"] = population[pop]["resourceCap"];
						savePop[pop]["killTime"] = population[pop]["killTime"];
						
				}				
		}
		return savePop;
}

function setFlagsFromJSON(someJSON){

		for( var flagKey in someJSON){
				if( flagKey in flags){
						flags[flagKey] = someJSON[flagKey];
				}
		}

}

function setBuildingsFromJSON(someJSON){

		for( var buildKey in someJSON){
				if(buildKey in buildings){
						buildings[buildKey]["discovered"] = "TRUE";
						buildings[buildKey]["value"] = someJSON[buildKey]["value"];
						buildings[buildKey]["amount_active"] = someJSON[buildKey]["amount_active"];
						buildings[buildKey]["disabled"] = someJSON[buildKey]["disabled"];
						if("resourseCapLimited" in buildings[buildKey]){
								buildings[buildKey]["resourseCapLimited"] = someJSON[buildKey]["resourseCapLimited"];
						}
						if("consumptionLimited" in buildings[buildKey]){
								buildings[buildKey]["consumptionLimited"] = someJSON[buildKey]["consumptionLimited"];
						}
						calcBuildingCost(buildKey);
						// refreshBuildingText(buildKey);
				}

		}


}

function setEventsFromJSON(someJSON){

		for( var evKey in someJSON){
				if(evKey in events){
						events[evKey]["discovered"] = "TRUE"; //someJSON[evKey]["discovered"];
						events[evKey]["shown"] = someJSON[evKey];
				}
		}

}


function reloadEvents(){

		for(var event in events){
				if(events[event]["discovered"] == "TRUE"
					 // && events[event]["shown"] == "TRUE"
					){
						events[event].misc();
						
				}
		}
		checkForNewEvents();
		
}


function setResourcesFromJSON(someJSON){

		for(var resKey in someJSON){
				if(resKey in resources){
						resources[resKey]["discovered"] = "TRUE";
						resources[resKey]["value"] = someJSON[resKey]["value"];
						resources[resKey]["resourceCap"] = someJSON[resKey]["resourceCap"];
						resources[resKey]["rate"] = someJSON[resKey]["rate"];
				}
		}
}

function setPopulationFromJSON(someJSON){


		for(var popKey in someJSON){

				if(popKey in population){
						population[popKey]["discovered"] = "TRUE";
						population[popKey]["value"] = someJSON[popKey]["value"];
						population[popKey]["resourceCap"] = someJSON[popKey]["resourceCap"];
						population[popKey]["killTime"] = someJSON[popKey]["killTime"];
				}
		}
}

function loadSave(saveString){

		var savArr = saveString.split('\n');

		var buffArr;
		
		for(var i = 0; i < savArr.length; i++){
				if(savArr[i] == ""){
						continue;
				}

				buffArr = savArr[i].split('=');

				if(buffArr.length == 2){

						switch(buffArr[0]) {
						case "TIME":	
								setDateFromString(buffArr[1]);
								break;
								
						case "FLAGS":
								setFlagsFromString(buffArr[1]);
								break;
								
						case "RESOURCES":
								setResourcesFromString(buffArr[1]);
								break;
								
						case "BUILDINGS":
								setBuildingsFromString(buffArr[1]);
								break;

						case "POPULATION":
								setPopulationFromString(buffArr[1]);
								break;
						}
				}
		}
}


function loadFile(e) {

		//Clean everything up first
		
		
		var input = e.target;

		var reader = new FileReader();

		reader.onload = function(){

				//Read the file
				resetAll();
				var contents = reader.result;


				//Load from contents
				// loadSave(contents);
				NewLoadSave(contents);


				
		};
		//actually load file
		reader.readAsText(input.files[0]);
		
}
		
function setDateFromString(dateString){
		var buffDay  = dateString.split("|")[0];
		var buffYear = dateString.split("|")[1];
		
		day  = Number(buffDay);
		year = Number(buffYear);
}


function setFlagsFromString(flagString){

		var flagArr = flagString.split(";");

		for( var i = 0; i > flagArr.length; i++){

				var buff = flagArr[i].split(":");

				if(buff[0] in flags){
						flags[buff[0]] = (buff[1] == "true");
				}


		}
		
}


function setResourcesFromString(resString){

		var resKey;
		var resVal;
		var resCap;
		
		var rateRegEx = /\{.*\}/;

		if( resString.charAt(resString.length - 1) == ";"){
				resString = resString.slice(0,-1);
		}

		var resArr = resString.split(";");

		
		for(var i = 0; i < resArr.length; i++){
				
				var rateData = rateRegEx.exec(resArr[i]);

				var resBuff =	resArr[i].replace(rateData, "");
							if( resBuff.charAt(resBuff.length - 1) == "|"){
						resBuff = resBuff.slice(0, -1);
				}
			
				var resBuffSplit = resBuff.split(":");
				
				if(resBuffSplit.length == 2){
						resKey = resBuffSplit[0];
						resVal = Number(resBuffSplit[1].split("|")[0]);
						resCap = ( resBuffSplit[1].split("|")[1] == "Infinity" ? Number.POSITIVE_INFINITY : Number(resBuffSplit[1].split("|")[1]) );


						var rateArr = getRateArrFromString(rateData[0]);

						if( resKey in resources){
								resources[resKey]["discovered"] = "TRUE";
								resources[resKey]["value"] = resVal;
								resources[resKey]["resourceCap"] = resCap;

								if( Array.isArray(rateArr) &&  rateArr.length != 0){

										for(var k = 0; k < rateArr.length; k++){

												addToResourceRate(resKey, rateArr[k][0], Number(rateArr[k][1]));

										}
								}
								
						}
				}
		}
}


function setBuildingsFromString(buildString){
		if( buildString.charAt(buildString.length - 1) == ";"){
				buildString = buildString.slice(0,-1);
		}
		
		var buildArr = buildString.split(";");


		for (var i = 0; i < buildArr.length; i++){
				var	buildBuff = buildArr[i].split(":");
				if(buildBuff.length == 2){
						if( buildBuff[1].charAt(buildBuff[1].length - 1) == "|"){
								buildBuff[1] = buildBuff[1].slice(0,-1);
						}

						if(buildBuff[0] in buildings){
								var nextInd;
								
								var buildSplit = buildBuff[1].split("|");
								
								buildings[buildBuff[0]]["discovered"] = "TRUE";
								buildings[buildBuff[0]]["value"] = Number(buildSplit[0]);
								if("amount_active" in buildings[buildBuff[0]]){
										buildings[buildBuff[0]]["amount_active"] = Number(buildSplit[1]);
										
										nextInd = 2;
								}
								else{

										nextInd = 1;
								}

								if(buildSplit[nextInd] == "0"){
										buildings[buildBuff[0]]["disabled"] = "TRUE";
								}
								else{
										buildings[buildBuff[0]]["disabled"] = "FALSE";

								}
						}
				}
		}
}

function setPopulationFromString(popString){

		if( popString.charAt(popString.length - 1) == ";"){
				popString = popString.slice(0,-1);
		}
		
		var popArr = popString.split(";");

		for( var i = 0; i < popArr.length; i++){

				var buffArr = popArr[i].split(":");
				console.log(buffArr);
				if(buffArr.length == 2){
						if( buffArr[0] in population){
								population[buffArr[0]]["discovered"] = "TRUE";
								population[buffArr[0]]["value"] = Number(buffArr[1].split("|")[0]);
								population[buffArr[0]]["resourceCap"] = Number(buffArr[1].split("|")[1]);
								population[buffArr[0]]["killTime"] = Number(buffArr[1].split("|")[2]);
						}
				}
		}

		console.log(population["human"]["value"]);
}

function displayContents(contents) {
		var element = document.getElementById('file-content');
		element.innerHTML = contents;
}



function getTimeSaveString(){
		var timeString = "";

		timeString += day + "|" + year;
		return timeString;
}

function getFlagsSaveString(){
		var flagSave = "";
		for( var flagKey in flags){
				flagSave += flagKey + ":" + flags[flagKey] + ";";
		}
		return flagSave;
}

function getResourceSaveString(){
		var resourceString = "";

		for( var resourceKey in resources){
				if(resources[resourceKey]["discovered"] == "FALSE"){
						continue;						// skip undiscovered resources.
				}
				resourceString += resourceKey;
				resourceString += ":";

				resourceString += resources[resourceKey]["value"] + "|" + resources[resourceKey]["resourceCap"] + "|";

				resourceString +="{";
				for(var rateKey in resources[resourceKey]["rate"]){
						resourceString += rateKey + ":" + resources[resourceKey]["rate"][rateKey] + "|";

				}
				resourceString +="}";


				resourceString += ";";
				

		}

		return resourceString;


}

function getBuildingSaveString(){
		var buildingString = "";

		for( var buildingKey in buildings){
				if(buildings[buildingKey]["discovered"] == "FALSE"){
						continue;						// skip undiscovered buildings.
				}
				console.log(buildingKey);
				
				buildingString += buildingKey;
				buildingString += ":";

				buildingString += buildings[buildingKey]["value"] +  "|";
				if("amount_active" in  buildings[buildingKey]){
						buildingString += buildings[buildingKey]["amount_active"] +  "|";
				}
				if(buildings[buildingKey]["disabled"] == "TRUE"){
						buildingString += "0|";
				}
				else{
						buildingString += "1|";
				}


				buildingString += ";";
				

		}


		return buildingString;


}

function getPopulationSaveString(){
		var popString = "";


		for( var popKey in population){

				popString += popKey + ":";

				popString += population[popKey]["value"] + "|";
				popString += population[popKey]["resourceCap"] + "|";
				popString +=  population[popKey]["killTime"] + ";";
				

		}

		return popString;
}

function updateResourceFromSave(key, value, cap, rateArr){

		//set value
		//resources[key]["value"] = value;

		//set cap
		//resources[key]["resourceCap"] = cap;
		console.log(value + " " + cap);
		console.table(rateArr);
		for(var i = 0; i < rateArr.length; i++){

				//	addToResourceRate( key, rateArr[0], rateArr[1]);
		}

}

function getRateArrFromString(rateString){
		var	rateArr = [];

		rateString = rateString.replace("{", "");
		rateString = rateString.replace("}", "");

		var buffArr = rateString.split("|");
		buffArr.pop();

		for(var i = 0; i < buffArr.length; i++){
				var key_and_rate = buffArr[i].split(":");
				if(Number(key_and_rate[1]) == NaN){
						console.log("ERROR: Loading from save, " + key_and_rate[0] + " rate not a number.");
						continue;
				}
				var buff = [key_and_rate[0], Number(key_and_rate[1])];
				rateArr.push(buff);
		}

		
		return rateArr;

}


function parseResourceSaveString(resourceString){
		var resourceArr = resourceString.split(";");
		resourceArr.pop();

		var buffArr;


		var rateRegEx = /\{.*\}/;
		var keyRegEx = /.*(?=:)/;

		for(var i = 0; i < resourceArr.length; i++){

				//seperate rate data from string
				var rateData = rateRegEx.exec(resourceArr[i]);
				resourceArr[i] = resourceArr[i].replace(rateData[0], "");
				var rateArr = getRateArrFromString(rateData[0]);

				
				//seperate key from string
				var keyData = keyRegEx.exec(resourceArr[i]);
				resourceArr[i] = resourceArr[i].replace(keyData[0], "");
				resourceArr[i] = resourceArr[i].replace(":", "");

				//seperate value and cap
				var buff  = resourceArr[i].split("|");
				var value = buff[0];
				var cap   = buff[1];


				updateResourceFromSave(keyData[0], value, cap, rateArr);
				
		}
		
		
		return resourceString;
}


function getSaveString(){
		
		
		parseResourceSaveString(getResourceSaveString());
		
}
