var buildingButtons = [];



function buildingButton(key){
		buildings[key]["value"] += 1;
		if( "consumes" in buildings[key]){
				if(buildings[key]["disabled"] == "FALSE"
					 && (buildings[key]["amount_active"] + 1) == buildings[key]["value"]
					)	{
						buildings[key]["amount_active"] += 1;
						setFurnaceBar(key);
				}
				
				if(buildings[key]["value"] == 1){
						//						document.getElementById( key + "BarID").style.width = "100%";
						setFurnaceBar(key);
				}

		}
		console.log("Added " + key);
		
 		for( var newKey in buildings[key]["cost"]){
				resources[newKey]["value"] -= buildings[key]["cost"][newKey];
				buildings[key]["cost"][newKey] = buildings[key].process();
		}
		if(buildings[key]["disabled"] != "TRUE"){
				if( "rateIncrease" in buildings[key]){
						for( var newKey in buildings[key]["rateIncrease"]){
								addToResourceRate(newKey, key, buildings[key]["rateIncrease"][newKey]["value"]);
						}
				}

				if( "consumes" in buildings[key]){
						for( var newKey in buildings[key]["consumes"]){
								addToResourceRate(newKey, key, -1 * buildings[key]["consumes"][newKey]["value"]);
								
						}
				}
		}

		//Handle resource cap increases
		if( "resourceCapIncrease" in buildings[key]){
				for( var newKey in buildings[key]["resourceCapIncrease"]){
						resources[newKey]["resourceCap"] += buildings[key]["resourceCapIncrease"][newKey];
						
				}
		}


		//Handle population cap increases
		if( "popCapIncrease" in buildings[key]){
				for( var newKey in buildings[key]["popCapIncrease"]){
						
						population[newKey]["resourceCap"] += buildings[key]["popCapIncrease"][newKey];
						
				}
		}
		

		document.getElementById(key).innerHTML = getNameText(key);

		var keyID = key + "ID";

		document.getElementById(keyID).title = getDescriptionText("buildings", key);
		
		displayResources();
		
}


function getNameText(key){

		var nameText = key.replace(/^\w/, c => c.toUpperCase());
		
		var number = buildings[key]["value"];
		
		nameText += ' (';
		
		if("consumes" in buildings[key]){
				var numActive = buildings[key]["amount_active"];
				nameText += numActive + "/";
		}
		
		nameText += number + ')';

		
		
		return nameText;

}


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
						text += "&emsp; +";
						text += category[categoryKey][key]["rateIncrease"][newKey]["value"];
						text += "/" + category[categoryKey][key]["rateIncrease"][newKey]["units"]; 
						text += "<br>";
				}
		}

		if("consumes" in category[categoryKey][key]){
				for( newKey in category[categoryKey][key]["consumes"]){
						text += newKey.replace(/^\w/, c => c.toUpperCase());
						text += "&emsp; -";
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



function getNormalBuildingText(key){

		var text = "";
		
		var descriptionText = getDescriptionText("buildings", key);
		var keyID = key + "ID";
		
		text += "<div id=\'" + keyID + "\'  tabindex='0'  style='margin:5px;vertical-align: top;highlight:none;width:fit-content;display:inline-block;'  title=";
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

		return text;


}


function getConsumingBuildingText(key){

		var text = "";
		
		var descriptionText = getDescriptionText("buildings", key);
		var keyID = key + "ID";
		var barID = key + "BarID";
		
		text += "<div id=\'" + keyID + "\'  tabindex='0'  style='height=80px;margin:5px;verticle-align:top;highlight:none;width:fit-content;display:inline-block;'  title=";
		text += '\"' + descriptionText + '\" >';
		
		text += '<button id="';
		text += key;
		text+= '" type="button" class="button building disallowed"';
		text += ' onclick="buildingButton(\'' + key + '\')"';
		
		text += " style='pointer-events: none; height:60px;position:relative;margin:0;'";
		text += " disabled";
		text +=">";
		text += key.replace(/^\w/, c => c.toUpperCase());
		text += '</button>';

		text += '<div style=\"height:20px;color:white;border-style:solid;bottom:0;left:0;right:0; background-color: #555555\">';
		text += '	<button class=\"left_button\" onclick=\"furnaceButton(\'' +  key  +'\', -1)\" >-</button>';
		text += '	<button class=\"right_button\" onclick=\"furnaceButton(\'' + key + '\', 1)\">+</button>';
		text += '	<div id=\"testFurnaceBar\" class=\"furnaceBar \"  style=\"overflow:hidden;text-align:center;position:relative\">';
		text += '	  <div id=\"' + barID + '\" class=\"furnaceProgress\">  </div>';
		text += '	  <div style=\"position:absolute;display:inline-block\">Hello </div>';
		text += ' </div>';
		text += '</div>';

		
		text += "</div>";

		return text;




}


function manageBuildingButtons(){
 		var text = "";


		for (var key in buildings){
				if(buildings[key]["discovered"] == "TRUE"
					 && !buildingButtons.includes(key)
					){
						if(!flags["displayBuildings"]){
								document.getElementById("BuildingsButton").style = "block";
								flags["displayBuildings"] = true;

						}
						buildingButtons.push(key);
						if( "consumes" in buildings[key]){
								text += getConsumingBuildingText(key);
						}
						else{
								text += getNormalBuildingText(key);
						}
						
				}
				
		}

		if(text != ""){
				var x = document.getElementsByClassName("ui-tooltip");
				if(typeof(x[0]) != "undefined"){
						x[0].parentNode.removeChild(x[0]);
				}
				
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



function disableBuildingReason(key, reason){
		console.log(reason);
		disableBuilding(key);
		if( reason == "consumptionLimited"){
				buildings[key]["consumptionLimited"] = "TRUE";

				disableFurnace(key);
		}
		if( reason == "resourceCapLimited"){
				buildings[key]["resourceCapLimited"] = "TRUE";
		}
}


function disableBuilding(key){

		if( buildings[key]["disabled"] == "TRUE"){
				return;
		}
		for(var resourceKey in buildings[key]["rateIncrease"]){
		//		if( key in resources[resourceKey]["rate"]){
				setResourceRate(resourceKey, key, 0.0);
		//		}
		}
		if( "consumes" in buildings[key]){
				for(var resourceKey in buildings[key]["consumes"]){
		//				if( key in resources[resourceKey]["rate"]){
						setResourceRate(resourceKey, key, 0.0);
		//				}
				}
		}
		buildings[key]["disabled"] = "TRUE";


}


function enableBuilding(key){

		if( buildings[key]["disabled"] == "FALSE"){
				return;
		}
		else{
				
				for(var resourceKey in buildings[key]["rateIncrease"]){
						console.log("adding rate for " + resourceKey); 
						calcAndSetResourceRate(resourceKey, key);						
						console.log("rate for " + resourceKey + " added"); 
				}
				for(var resourceKey in buildings[key]["consumes"]){
						console.log("adding consumption of " + resourceKey); 
						calcAndSetResourceRate(resourceKey, key);
						console.log("consumption of " + resourceKey + " added"); 
				}

				if("consumes" in buildings[key]){
						enableFurnace(key);
						buildings[key]["consumptionlimited"] = "FALSE";
						buildings[key]["resourceCaplimited"] = "FALSE";
						
						buildings[key]["disabled"] = "FALSE";
				}
		}
		
}


function getBuildingResourceRate(buildingKey, resourceKey){
		var amount = buildings[buildingKey]["value"];

		if("consumes" in buildings[buildingKey]){
				amount = buildings[buildingKey]["amount_active"];
				if(resourceKey in buildings[buildingKey]["consumes"]){
						console.log(buildings[buildingKey]["consumes"][resourceKey]["value"]);
						return buildings[buildingKey]["consumes"][resourceKey]["value"] * amount;
				}
		}

		if(resourceKey in buildings[buildingKey]["rateIncrease"]){
				return buildings[buildingKey]["rateIncrease"][resourceKey]["value"] * amount;
		}



		return 0;
					 
}

function manageBuildingConsumption(rate){
		timeStep = rate/1000;

		for( var buildingKey in buildings){
				if( !("consumes" in buildings[buildingKey] )           	// only care about buildings that take resources
						|| buildings[buildingKey]["value"] <= 0				      // and exist
						|| buildings[buildingKey]["discovered"] == "FALSE"  // and have been discovered
					){
						continue;
				}

				var disabled = "FALSE";
				var reason = "";

				for( var resourceKey in buildings[buildingKey]["rateIncrease"]){

						if( resources[resourceKey]["value"] == resources[resourceKey]["resourceCap"]){
										reason = "resourceCapLimited";
						}

				}

				
				for( var resourceKey in buildings[buildingKey]["consumes"]){
						var nextTimeStepDecrease = getBuildingResourceRate(buildingKey, resourceKey);

						if(buildings[buildingKey]["disabled"] == "TRUE"){
								if(resources[resourceKey]["value"] - nextTimeStepDecrease < 0){
										reason = "consumptionLimited";
										disabled = "TRUE";
										break;
								}
						}
						
						
						nextTimeStepDecrease*= timeStep; //calculate building's contribution in next timestep

						if( resources[resourceKey]["value"] - nextTimeStepDecrease < 0){
								reason = "consumptionLimited";
								disabled = "TRUE";
								break;
						}
				}
				
				if(disabled == "TRUE"
					 && buildings[buildingKey]["disabled"] == "FALSE"
					){
						console.log("disabling" + " " + buildingKey);
						disableBuildingReason(buildingKey, reason);
				}
				
				else if(disabled == "FALSE"
								&& buildings[buildingKey]["disabled"] == "TRUE"								
							 ){
						console.log("enabling" + " " + buildingKey);
						enableBuilding(buildingKey);
						
				}
				
		}

}

