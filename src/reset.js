//default values to be reset to
var resets = {
		"discovered" : "FALSE",
		"value" : 0,
		"amount_active": 0,
		"disabled": "FALSE",
		"shown" : "FALSE",
		"rate" : null,
		"resourceCap" : 1,
		"rateValue" : 0,
}




function resetFlags(){

		for(var flag in flags){
				flags[flag] = false;
		}

		//reset screen to Base and Resource tabs
		flags["ResourceClicked"] = true;
		flags["BaseClicked"] = true;
		
}




function resetHTML(){

		//hide tabs
		document.getElementById("BuildingsButton").style.display = "none";
		document.getElementById("JobsButton").style.display = "none";
		document.getElementById("ScienceButton").style.display = "none";
		document.getElementById("PopulationButton").style.display = "none";

		//rehide center resources
		document.getElementById("ResourcesButton").style.width = "100%";
		document.getElementById("PopulationButton").style.width = "0%";
		
		//hide various buttons
		document.getElementById("woodWrapper").style.display = "none";
		document.getElementById("exploreWrapper").style.display = "none";
		document.getElementById("stoneWrapper").style.display = "none";
		document.getElementById("skyWrapper").style.display = "none";
		document.getElementById("Fire").style.display = "none";

		//reset look around button
		document.getElementById("LookAround").style.display = "inline-block";
		
		//reset text
		document.getElementById("BaseButton").innerHTML = "A Small Clearing";

}


function resetBuildingButtons(){

		buildingButtons = [];
		
		document.getElementById("Buildings").innerHTML = "";

}



function resetAll(){

		//set date
		day = 0;
		year = 0;
		
		//clean log
		wipeLog();
		//clean events
		wipeEvents();
		//clean messages
		wipeMessage();

		
		//reset buttons/text
		resetHTML();


		//reset all flags
		resetFlags();

		//reset buildings:
		resetBuildingButtons();
		
		//reset all values
		for( var catKey in category){
				for( var objKey in category[catKey]){
						
						for( var resetKey in resets){

								//handle default resource caps
								if( resetKey == "resourceCap"){
										keyCheckAndSet( category[catKey][objKey], resetKey, category[catKey][objKey]["defaultResourceCap"]);
								}
								//handle clearing rate objects, have to do individually beacuse javascript sucks
								else if(resetKey == "rate"){
										for( var rateKey in category[catKey][objKey]["rate"] ){

												category[catKey][objKey]["rate"][rateKey] = 0;
										}
								}
								//reseting everything else
								else{
										keyCheckAndSet( category[catKey][objKey], resetKey, resets[resetKey]);
								}
						}
				}
		}
}

