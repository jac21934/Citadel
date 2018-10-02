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




function increasePop(popKey, amount){

		var did_i_increase = false;

		if( !(popKey in population) ){

				return did_i_increase;
		}

		if(population[popKey]["value"] >= population[popKey]["resourceCap"]){
				return did_i_increase;
		}
		else{
				var increaseVal = population[popKey]["value"] + amount;
				population[popKey]["value"] = clamp(increaseVal, 0, population[popKey]["resourceCap"]);
				did_i_increase = true;
		}

		return did_i_increase;
				
}



function displayPopulation(){
		var text = "";
		if(!displayPop){
				var numPop = 0;
				for( var key in population){
						if(population[key]["discovered"] == "TRUE"){
								numPop += population[key]["resourceCap"];
						}
				}
				if(numPop > 0){
						displayPop = true;
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
