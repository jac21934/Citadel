function testCookie(){

		setCookie("testCookie", "testMessage");

}

function setCookie(name, value){
		var d =  new Date();
		d.setTime(d.getTime() + MS_IN_TEN_YEARS); //10 years in the future
		var exDate = "expires=" + d.toUTCString();
		var message = name + "=" + value + ";" + exDate + ";path=/";

		document.cookie = message;
		console.log(document.cookie);
}


function getCookies(){

		var cookies = document.cookie;
		console.log(cookies);

}

var cookie_set = false;

function manageCookies(){

		if(!cookie_set){

				testCookie();

		}

}

