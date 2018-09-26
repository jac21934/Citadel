var buildingButtons = [];

function buildingButton(key){
		buildings[key]["value"] += 1;
		if( "consumes" in buildings[key]
				&& buildings[key]["disabled"] == "FALSE")
		{
				buildings[key]["amount_active"] += 1;

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
				numActive = buildings[key]["amount_active"];
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
						text += "&emsp;";
						text += category[categoryKey][key]["rateIncrease"][newKey]["value"];
						text += "/" + category[categoryKey][key]["rateIncrease"][newKey]["units"]; 
						text += "<br>";
				}
		}

		if("consumes" in category[categoryKey][key]){
				for( newKey in category[categoryKey][key]["consumes"]){
						text += newKey.replace(/^\w/, c => c.toUpperCase());
						text += "&emsp;-";
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
		
		text += "<div id=\'" + keyID + "\'  tabindex='0'  style='    vertical-align: top;highlight:none;width:fit-content;display:inline-block;'  title=";
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

						text += getNormalBuildingText(key);

						
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

