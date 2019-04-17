
var lastStorageTime = -1*MS_IN_TWO_MINUTES;

function loadFromStorage(){

		//time
		setTimeFromJSON(JSON.parse(localStorage.getItem("timeCitadel")));
		//flags
		setFlagsFromJSON(JSON.parse(localStorage.getItem("flagsCitadel")));
		//events
		setEventsFromJSON(JSON.parse(localStorage.getItem("eventsCitadel")));
		reloadEvents();
		//resources
		setResourcesFromJSON(JSON.parse(localStorage.getItem("resourcesCitadel")));
		//buildings
		setBuildingsFromJSON(JSON.parse(localStorage.getItem("buildingsCitadel")));
		//population
		setPopulationFromJSON(JSON.parse(localStorage.getItem("populationCitadel")));
}


function checkStorage(){
		var storage = false;

		if(	localStorage.getItem("timeCitadel") != null
				&& localStorage.getItem("flagsCitadel") != null
				&& localStorage.getItem("eventsCitadel") != null
				&& localStorage.getItem("resourcesCitadel") != null
				&& localStorage.getItem("buildingsCitadel") != null
				&& localStorage.getItem("populationCitadel") != null
			){
				storage = true;
		}
		return storage;
}

function saveStorage(){
		localStorage.setItem("timeCitadel", JSON.stringify(time));
		localStorage.setItem("flagsCitadel", JSON.stringify(saveFlagsJSON()));
		localStorage.setItem("eventsCitadel", JSON.stringify(saveEventsJSON()));
		localStorage.setItem("resourcesCitadel", JSON.stringify(saveResourcesJSON()));
		localStorage.setItem("buildingsCitadel", JSON.stringify(saveBuildingsJSON()));
		localStorage.setItem("populationCitadel", JSON.stringify(savePopulationJSON()));
}

function manageStorage(timeStamp){

		if(timeStamp > lastStorageTime + MS_IN_TWO_MINUTES){
				//storage stuff
				localStorage.setItem("timeCitadel", JSON.stringify(time));
				localStorage.setItem("flagsCitadel", JSON.stringify(saveFlagsJSON()));
				localStorage.setItem("eventsCitadel", JSON.stringify(saveEventsJSON()));
				localStorage.setItem("resourcesCitadel", JSON.stringify(saveResourcesJSON()));
				localStorage.setItem("buildingsCitadel", JSON.stringify(saveBuildingsJSON()));
				localStorage.setItem("populationCitadel", JSON.stringify(savePopulationJSON()));
				lastStorageTime = timeStamp;
		}

		
}


function clearStorage(){
		localStorage.removeItem("timeCitadel");
		localStorage.removeItem("flagsCitadel");
		localStorage.removeItem("eventsCitadel");
		localStorage.removeItem("resourcesCitadel");
		localStorage.removeItem("buildingsCitadel");
		localStorage.removeItem("populationCitadel");
}
