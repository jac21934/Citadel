$( function() {
		$('*').click(function() {

				$(this).tooltip({
						
						position: {
								my: "center top",
								at: "center bottom"
						},
						classes : {
								"ui-tooltip" : "button_tooltip"
						},
						content : function(){
								return  this.getAttribute("title");
						},
						hide: false,	
						
				});
		});
		
		$( document ).tooltip({
				position: {
						my: "center top",
						at: "center bottom"
				},
				classes : {
						"ui-tooltip" : "button_tooltip"
				},
				content : function(){
						return  this.getAttribute("title");
				},
				hide: false,
				
		});
} );
