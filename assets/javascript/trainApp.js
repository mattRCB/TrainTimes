

// Initialize Firebase
var config = {
apiKey: "AIzaSyBYiUdslrdCbKIKMCl1yMU-dTbjEMw3JT0",
authDomain: "traintimes-f2c60.firebaseapp.com",
databaseURL: "https://traintimes-f2c60.firebaseio.com",
storageBucket: "traintimes-f2c60.appspot.com",
messagingSenderId: "130813680016"
};

firebase.initializeApp(config);

var db = firebase.database();




$(document).on('click', '#add-train-btn', function(event) {
	event.preventDefault();
	var train = $('#train-name-input').val().trim();
	var dest = $('#destination-input').val().trim();
	var startTime = $('#initial-time-input').val().trim();
	var freq = $('#frequency-input').val().trim();
	$('#train-name-input, #destination-input, #initial-time-input, #frequency-input').val("").blur();
	var newTrain = {
		train: train,
		destination: dest,
		initialTime: startTime,
		frequency: freq
	}
	db.ref('TrainsDB/').push(newTrain);
});


// Deliver a new snapshot BOTH on PAGE LOAD and ON EACH TIME THE
// VALUE IS CHANGED IN THE DB. 
db.ref().on("value", function(snapshot) {

	var sv = snapshot.val();
	var trains = sv.TrainsDB;
	var trainKeys = Object.keys(sv.TrainsDB);

	// console.log("The keys to the train objects are: " + trainKeys);

	// var key1 = trainKeys[0];
	// console.log("the first key is: " + key1);

	// console.log(trains[trainKeys[0]]);
	// console.log(trains[trainKeys[0]].destination);

	for (var i = 0; i < trainKeys.length; i++) {
		console.log(trains[trainKeys[i]].train + " is headed to " + trains[trainKeys[i]].destination);
	}


	// trainDB.map( function(record) {
	// 	console.log(record);
	// })
});




