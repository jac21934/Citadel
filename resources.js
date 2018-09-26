

function addToResource(key, amount){
		resources[key]["value"] = Math.max(0, Math.min((resources[key]["value"] + amount), resources[key]["resourceCap"]));
}



function manageResources(timeSteps){
		timeStepsToSeconds = timeSteps/1000;
		
		
		for( var key in resources){
				if( resources[key]["discovered"] == "TRUE"){
						var toAdd = 0;
						for( newKey in resources[key]["rate"]){
								toAdd += resources[key]["rate"][newKey];
								
						}
						resources[key]["rateValue"] = toAdd;
						
						toAdd *= timeStepsToSeconds;
						
						addToResource(key, toAdd);
						
				}
		}
		

}



function addToResourceRate(resourceKey, buildingKey, rate){

		resObj = resources[resourceKey];
		if( !(buildingKey in resObj["rate"]) ){
				resObj["rate"][buildingKey] = rate;
		}
		else{
				resObj["rate"][buildingKey] += rate;
		}
}


function setResourceRate(resourceKey, buildingKey, rate){

		resObj = resources[resourceKey];
		resObj["rate"][buildingKey] = rate;
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




