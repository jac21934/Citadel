function downloadSaveFile() {
		var element = document.createElement('a');

		var save_name = "Citadel_" + getMonth() + "_"  + getDay() + "_" +  getYear() + ".save";
		var text = "";


		text = "TIME=" + getTimeSaveString() + "\n";
		text += "RESOURCES=" + getResourceSaveString() + "\n";
		text += "BUILDINGS=" + getBuildingSaveString() + "\n";

		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', save_name);

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();
		
		document.body.removeChild(element);
}


function loadSave(string){

		

		
}




function loadFile(e) {

		resetAll();
		var input = e.target;

		var reader = new FileReader();

		reader.onload = function(){
				
				var contents = reader.result;

				// setStatsFromString(contents);
				
		};
		reader.readAsText(input.files[0]);
		
}


function setStatsFromString(statString){
		var statArr = statString.split('\n');

		var buffArr;
		
		for(i = 0; i < statArr.length; i++){
				if(statArr[i] == ""){
						continue;
				}

				buffArr = statArr[i].split('=');

				if(buffArr.length == 2){

						switch(buffArr[0]) {
						case "TIME":

								var buffDay = buffArr[1].split("|")[0];
								var buffYear = buffArr[1].split("|")[1];

								day = Number(buffDay);
								year = Number(buffYear);
								break;

						case "RESOURCES":
								
								
						}
						// if(buffArr[0] == "TIME"){

						// 		var buffDay = buffArr[1].split("|")[0];
						// 		var buffYear = buffArr[1].split("|")[1];

						// 		day = Number(buffDay);
						// 		year = Number(buffYear);
						// }
						
						// else if(buffArr[0] == "RESOURCES"){

						// }
						

				}
				
		}


				
}






function displayContents(contents) {
		var element = document.getElementById('file-content');
		element.innerHTML = contents;
}



function getTimeSaveString(){
		var timeString = "";

		timeString += getDay() + "|" + getYear();
		return timeString;
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
