
var buildings = {

		"farm": {
				"description": "A rolling field of wheat.",
				"discovered" : "FALSE",
				"value"     : 0,
				"resource": "food",
				"disabled": "FALSE",
				"rateIncrease" : {
						"food" : {
								"amount" : 0.25,
								"units"  : 's'
						},								
				},
				"cost" : {
						"wood" : 50,
				},
				process : function(){
						var farmNumber = buildings["farm"]["value"];
						return 50; //Math.floor(50 *Math.pow(1.5, farmNumber));
				},
				
				"unlockReqs" :{
						"resources" : {
								"wood": 25
						},
						"buildings" : {

						},
						"population" : {

						}
				}
		},

		"shed": {
				"description": "A place to store wood.",
				"discovered" : "FALSE",
				"value"     : 0,
				"resource": "wood",
				"disabled": "FALSE",
				"resourceCapIncrease" : {
						"wood" : 50
				},
				"cost" : {
						"wood" : 50,
				},
				
				process : function(){
						var shedNumber = buildings["shed"]["value"];
						
						return Math.floor(50 *Math.pow(1.5, shedNumber));
				},

				"unlockReqs" :{
						"resources" : {
								"wood": 15
						},
						"buildings" : {

						},
						"population" : {

						}
				}
		},
		"cabin": {
				"description": "A place to sleep and stay out of the rain.",
				"discovered" : "FALSE",
				"value"     : 0,
				"resource": "human",
				"disabled": "FALSE",
				"popCapIncrease" : {
						"human" : 1
				},
				"cost" : {
						"wood" : 100,
				},
				
				process : function(){
						var cabinNumber = buildings["cabin"]["value"];
						
						return Math.floor(100 *Math.pow(1.5, cabinNumber));
				},

				"unlockReqs" :{
						"resources" : {
								"wood": 50
						},
						"buildings" : {

						},
						"population" : {

						}
				}
		},

		"brewery": {
				"description": "With enough patience, anything can be fermented.",
				"discovered" : "FALSE",
				"value"     : 0,
				"disabled": "FALSE",
				"rateIncrease" : {
						"beer" : {
								"amount" : 0.25,
								"units"  : 's'
						},
				},

				"consumes" : {
						"food" : {
								"value" : 1.0,
								"units"  : 's'
						},
						
				},				
				"cost" : {
						"wood" : 5,
				},
				
				process : function(){
						var brewNumber = buildings["brewery"]["value"];
						
						return Math.floor(500 * Math.pow(1.5, brewNumber));
				},

				"unlockReqs" :{
						"resources" : {
								"wood" : 50,
						},
						"buildings" : {
								"farm" : 1
						},
						"population" : {
						}
				}
		},


		
		"mine": {
				"description": "The mountains around here are rich with resources, if you can reach them.",
				"discovered" : "FALSE",
				"value"     : 0,
				"disabled": "FALSE",
				"resourceCapIncrease" : {
				},
				"cost" : {
						"wood" : 500,
				},
				
				process : function(){
						var mineNumber = buildings["mine"]["value"];
						
						return Math.floor(500 * Math.pow(1.5, mineNumber));
				},

				"unlockReqs" :{
						"resources" : {
				
						},
						"buildings" : {

						},
						"population" : {
								"dwarf" : 1
						}
				}
		},
		
};

