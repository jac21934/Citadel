function managePopulation(timeStep){
		// needs to go through each population,
		// check needs, kill if not enough food
		// recruit if possible

		rate = timeStep / 1000;

		var humanChance =  0.1;

		humanChance *= rate;
		
		if( fireOn) {

				if( population["human"]["value"] < population["human"]["resourceCap"]){
						var rollDice = Math.random();
						
						if(rollDice <= humanChance){
								increasePop("human", 1);
								
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
