function managePopulation(timeStep){
		// needs to go through each population,
		// check needs, kill if not enough food
		// recruit if possible

		rate = timeStep * CONVERT_FROM_MS_TO_S;

		var humanChance =  HUMAN_FIRE_CHANCE;

		humanChance *= rate;
		
		if( flags["fireOn"]) {

				if( population["human"]["value"] < population["human"]["resourceCap"]){
						var rollDice = Math.random();
						
						if(rollDice <= humanChance){
								increasePop("human", 1);
								
						}
				}
		}


		for(var key in population){

				if( population[key]["discovered"] == "TRUE"
						&& population[key]["resourceCap"] > 0
					){
						// Update needs appropriately
						if(population[key]["value"] > 0){
								checkPopNeeds(key, timeStep);
						}

						
						//Update value/cap if needed
						var popValID = key + "ValueID";
						var popCapID = key + "CapID";
						var valBuff = document.getElementById(popValID);
						var capBuff = document.getElementById(popCapID);

						var capTest = "/" + population[key]["resourceCap"];

						if(population[key]["value"] != valBuff){
								document.getElementById(popValID).innerHTML = population[key]["value"];
						}

						if(capTest != valBuff){
								document.getElementById(popCapID).innerHTML = capTest;
						}
						
				}
		}




		
}




function checkPopNeeds(popKey, step){

		var time = oldTimeStamp + step;
		var killMe = false;
		for(var needKey in population[popKey]["needs"] ){				
				
		}

		if(killMe
			 && ( time >  population[popKey]["killTime"] + KILL_WAIT_TIME) ){
				increasePop(popKey, -1);
		}
}


function increasePop(popKey, amount){

		var did_i_increase = false;

		if( !(popKey in population) ){

				return did_i_increase;
		}

		if(population[popKey]["value"] >= population[popKey]["resourceCap"]){
				return did_i_increase;
		}
		
		else{
				var oldPop = population[popKey]["value"];
				var increaseVal = population[popKey]["value"] + amount;
				population[popKey]["value"] = clamp(increaseVal, 0, population[popKey]["resourceCap"]);
				var increaseAmount = population[popKey]["value"] - oldPop;

				for( var resourceKey in population[popKey]["needs"]){
						var rate = -1 * increaseAmount * population[popKey]["needs"][resourceKey];
						
						addToResourceRate(resourceKey, popKey, rate);
				}
				
				did_i_increase = true;
				
		}

		return did_i_increase;
				
}



function displayPopulation(){
		var text = "";
		if(!flags["displayPop"]){
				var numPop = 0;
				for( var key in population){
						if(population[key]["discovered"] == "TRUE"){
								numPop += population[key]["resourceCap"];
						}
				}
				if(numPop > 0){
						flags["displayPop"] = true;
						document.getElementById("ResourcesButton").style.width = "50%";
						document.getElementById("PopulationButton").style.display = "block";
						document.getElementById("PopulationButton").style.width = "50%";

						
				}
		}

		
		for( var key in population){
				if( population[key]["discovered"] == "TRUE"
						&& population[key]["resourceCap"] > 0
						&& !pops.includes(key)
					){
						pops.push(key);
						var value =  population[key]["value"];
						value = Math.floor(value);

						var popValID = key + "ValueID"; 
						var popCapID = key + "CapID";

						
						text += "<tr title=\'" + population[key]["description"] + "\'>";
						text += "<td>" + key.replace(/^\w/, c => c.toUpperCase()) + "</td>";
						text += "<td id=\'" + popValID + "\'>" + value  + "</td>";
						text += "<td id=\'" + popCapID + "\'>/" +  population[key]["resourceCap"] + "</td>";
						text += "</tr>";
				}
		}


		
		if(text != ""){
				
				document.getElementById("populationTable").innerHTML =  document.getElementById("populationTable").innerHTML + text;
		}

}
