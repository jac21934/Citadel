

function addToResource(key, amount){
		resources[key]["value"] =  clamp((resources[key]["value"] + amount), 0, resources[key]["resourceCap"]);

}





function manageResources(timeSteps){
		timeStepsToSeconds = timeSteps * CONVERT_FROM_MS_TO_S;
		
		
		for( var key in resources){
				if( resources[key]["discovered"] == "TRUE"){
						var toAdd = 0;

						calcRateValue(key);

						toAdd = resources[key]["rateValue"];
						toAdd *= timeStepsToSeconds;

						if(toAdd != 0.0){
								addToResource(key, toAdd);
						}
						
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
				// console.log(key);
				toAdd += resources[key]["rate"][newKey];
		}
		resources[key]["rateValue"] = toAdd;

}


function addToResourceRate(resourceKey, newKey, rate){

		resObj = resources[resourceKey];
		if( !(newKey in resObj["rate"]) ){
				resObj["rate"][newKey] = rate;
		}
		else{
				resObj["rate"][newKey] += rate;
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
		var special_text = "";
		for( var key in resources){
				if( resources[key]["discovered"] == "TRUE"){
						var new_text = "";
						var value =  resources[key]["value"];
						value = Math.round(value * 100) / 100;
						var rate = resources[key]["rateValue"] ;
						if("special_resource" in resources[key]){
								
								if(resources[key]["special_resource"] == "TRUE")
								{
										special_text += "<tr>";
										special_text += "<td>" + key.replace(/^\w/, c => c.toUpperCase()) + "</td>";
										special_text += "<td>" + value  + "</td>";
										special_text += "<td>" +  "</td>";
										special_text += "<td>" + "(" + rate + "/" + resources[key]["rateUnits"] + ")"  + "</td>";
										special_text += "</tr>";
										continue;
								}
						}


						
						text += "<tr>";
						text += "<td>" + key.replace(/^\w/, c => c.toUpperCase()) + "</td>";
						text += "<td>" + value  + "</td>";
						text += "<td>/" +  resources[key]["resourceCap"] + "</td>";
						text += "<td>" + "(" + rate + "/" + resources[key]["rateUnits"] + ")"  + "</td>";
						text += "</tr>";

						

						
				}
		}

		document.getElementById("resourceTable").innerHTML = text;
		document.getElementById("specialResourceTable").innerHTML = special_text;


		
}



function resourceButton(key, amount){
		if(resources[key]["value"] < resources[key]["resourceCap"]){
				addToResource(key ,amount);
		}
		displayResources();
}







