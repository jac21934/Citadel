

function addToResource(key, amount){
		resources[key]["value"] = Math.max(0, Math.min((resources[key]["value"] + amount), resources[key]["resourceCap"]));
}



function manageResources(timeSteps){
		timeStepsToSeconds = timeSteps/1000;
		
		
		for( var key in resources){
				if( resources[key]["discovered"] == "TRUE"){
						var toAdd = 0;

						calcRateValue(key);

						toAdd = resources[key]["rateValue"];
						toAdd *= timeStepsToSeconds;
						
						addToResource(key, toAdd);
						
				}
		}
		

}

function calcRateValue(key){
		var toAdd = 0;
		for( newKey in resources[key]["rate"]){
				if(newKey in buildings){
						if(buildings[newKey]["disabled"] == "TRUE"
							){
								continue;
						}
				}
														toAdd += resources[key]["rate"][newKey];
		}
				
				resources[key]["rateValue"] = toAdd;

}


function addToResourceRate(resourceKey, buildingKey, rate){

		resObj = resources[resourceKey];
		if( !(buildingKey in resObj["rate"]) ){
				resObj["rate"][buildingKey] = rate;
		}
		else{
				resObj["rate"][buildingKey] += rate;
		}
		calcRateValue(resourceKey);
}


function setResourceRate(resourceKey, buildingKey, rate){

		resObj = resources[resourceKey];
		resObj["rate"][buildingKey] = rate;
		calcRateValue(resourceKey);
}

function calcAndSetResourceRate(resourceKey, buildingKey){
		var rateToSet = 0;
		var amountActive = buildings[buildingKey]["value"];
		if("consumes" in buildings[buildingKey]){
				amountActive = buildings[buildingKey]["amount_active"];
				if (resourceKey in buildings[buildingKey]["consumes"]){
						rateToSet = -1* buildings[buildingKey]["consumes"][resourceKey]["value"];
				}

		}

		if( resourceKey in buildings[buildingKey]["rateIncrease"]){
				rateToSet =  buildings[buildingKey]["rateIncrease"][resourceKey]["value"];
		}
		
		rateToSet *= amountActive;
		setResourceRate(resourceKey, buildingKey, rateToSet);
}




function displayResources(){
		var text = "";

		for( var key in resources){
				if( resources[key]["discovered"] == "TRUE"){

						var value =  resources[key]["value"];
						value = Math.round(value * 10) / 10;
						var rate = resources[key]["rateValue"] ;
						text += "<tr>";
						text += "<td>" + key.replace(/^\w/, c => c.toUpperCase()) + "</td>";
						text += "<td>" + value  + "</td>";
						text += "<td>/" +  resources[key]["resourceCap"] + "</td>";
						text += "<td>" + "(" + rate + "/" + resources[key]["rateUnits"] + ")"  + "</td>";
						text += "</tr>";
				}
		}

		document.getElementById("resourceTable").innerHTML = text;

}



function resourceButton(key){
		if(resources[key]["value"] < resources[key]["resourceCap"]){
				//				resources[key]["value"] = Math.min( (resources[key]["value"] + 1), resources[key]["resourceCap"]);
				addToResource(key ,100);
		}
		displayResources();
}




