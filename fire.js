
var fireOn = false;
var fireUnlocked = false;

function fireButton(){

		
		var name = "";
		var description = "";

		document.getElementById("FireButton").className = document.getElementById("FireButton").className.replace(" fireOn", "");
		
		if(!flags["fireOn"]){
				if(!fireUnlocked){
						fireUnlocked = true;
						miscellaneous["fire"]["value"] = 1;
				}
				
				name = "A small campfire";
				description = "<div style='text-align:center'>A good fire. Should attract travelers.</div> <hr> Wood&emsp;-1/s";
				
				document.getElementById("FireButton").className += " fireOn";
				setResourceRate("wood", "fire",-1);
				flags["fireOn"] = true;
				document.getElementById("FireButton").innerHTML = name;
				document.getElementById("Fire").title = description;

		}
		else{
				resetFire();
		}

}

function resetFire(){
		document.getElementById("FireButton").className = document.getElementById("FireButton").className.replace(" fireOn", "");

		var name = "Build a fire";
		var	description = "<div style='text-align:center'> Build a small fire.</div>";
		flags["fireOn"] = false;
		document.getElementById("FireButton").innerHTML = name;
		document.getElementById("Fire").title = description;

				setResourceRate("wood", "fire", 0);

		
}

function manageFire(){
		fire = document.getElementById("FireButton");
		
		if(fire.disabled == true){
				if(resources["wood"]["value"] > 0){
						fire.className = fire.className.replace(" disallowed", "");
						fire.disabled = false;
						fire.style.pointerEvents = "auto";
				}
		}
		
		if(resources["wood"]["value"] <= 0){
				if(fire.disabled == false){
						if(flags["fireOn"]){
								resetFire();
						}
						
						fire.className += " disallowed";
						fire.disabled = true;
						fire.style.pointerEvents = "none";
				}
		}
		
		
}
