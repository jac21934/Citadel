function downloadSaveFile() {
		var element = document.createElement('a');
		var text =  "RESOURCES=" + getResourceSaveString() + "\n";
		var save_name = "Citadel_" + getMonth() + "_"  + getDay() + "_" +  getYear() + ".save";
		text += "BUILDINGS=" + getBuildingSaveString() + "\n";

		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', save_name);

		element.style.display = 'none';
		document.body.appendChild(element);

		

		element.click();
		
		document.body.removeChild(element);
}


function loadSave(string){

		

}

function readSingleFile(e) {
		var input = e.target;

		var reader = new FileReader();

		reader.onload = function(){
				
				var contents = reader.result;
				displayContents(contents);
		};
		reader.readAsText(input.files[0]);
		
}


function displayContents(contents) {
		var element = document.getElementById('file-content');
		element.innerHTML = contents;
}




