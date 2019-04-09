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




function testCookie(){

		setCookie("testCookie", "testMessage");

}

function setCookie(name, value){
		var d =  new Date();
		d.setTime(d.getTime() + MS_IN_TEN_YEARS); //10 years in the future
		var exDate = "expires=" + d.toUTCString();
		var message = name + "=" + value + ";" + exDate + ";path=/";

		console.log(message);


		document.cookie = message;
		console.log(document.cookie);
}


function getCookies(){

		var cookies = document.cookie;
		console.log(cookies);

}


