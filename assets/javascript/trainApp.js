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


// Deliver a new snapshot BOTH on PAGE LOAD and ON EACH TIME THE
// VALUE IS CHANGED IN THE DB. 
db.ref().on("value", function(snapshot) {
	console.log(snapshot);
	var sv = snapshot.val();
	updateTable(sv);
});


function updateTable(sv) {
	// console.log(sv);
	var trains = sv.TrainsDB;
	var trainKeys = Object.keys(sv.TrainsDB);
	// console.log("The keys to the train objects are: " + trainKeys);
	// console.log(trains[trainKeys[0]].destination);
	$("#schedule > tbody").empty();

	for (var i = 0; i < trainKeys.length; i++) {
		var crntTime = moment(crntTime);
		// console.log("the current time is: " + moment(crntTime).format("hh:mm"));
		var freq = trains[trainKeys[i]].frequency;
		// console.log("frequency for " + trains[trainKeys[i]].train + "is " + freq);
		var timeOfFirstTrain = trains[trainKeys[i]].initialTime;
		// console.log(timeOfFirstTrain);
		var timeOfFirstConverted = moment(timeOfFirstTrain, "hh:mm").subtract(1, "years");
		// console.log("firstTimeConverted is: " + timeOfFirstConverted);
		var offsetFromFirstTime = moment().diff(moment(timeOfFirstConverted), "minutes");
		// console.log("Difference between current-time and time-of-first-train is: " + offsetFromFirstTime);
		var minutesSincePreviousTrain = offsetFromFirstTime % freq;
		// console.log("It's been " + minutesSincePreviousTrain + " minutes since the previous train.");
		var minutesUntilNextTrain = freq - minutesSincePreviousTrain;
		// console.log("The next train will arrive in " + minutesUntilNextTrain + " minutes.");
		var timeOfNextTrain = moment().add(minutesUntilNextTrain, "minutes");
		// console.log("The next train is due at " + moment(timeOfNextTrain).format("hh:mm"));

		$("#schedule > tbody").append("<tr><td>" + trains[trainKeys[i]].train + "</td><td>" + trains[trainKeys[i]].destination + "</td><td>" + trains[trainKeys[i]].frequency + "</td><td>" + moment(timeOfNextTrain).format("hh:mm") + "</td><td>" + minutesUntilNextTrain + "</td></tr>");
	}
};


function getSnapshot() {
	var url = 'https://traintimes-f2c60.firebaseio.com/.json';

	$.getJSON(url).success(function(data) {

	}).error(function(message) {
		console.error('error' + message);
	}).complete(function(data) {
		console.log('completed!');
		console.log(data.responseJSON);
		var sv = data.responseJSON;
		updateTable(sv);
	});
}


setInterval(getSnapshot, 1000*61);


$(document).on('click', '#add-train-btn', function(event) {
	event.preventDefault();

	var train = $('#train-name-input').val().trim();
	var dest = $('#destination-input').val().trim();
	var startTime = $('#initial-time-input').val().trim();
	var freq = $('#frequency-input').val().trim();

	if ((train == "") || (dest == "") || (startTime == "") || (!moment(startTime, 'HH:mm', true).isValid()) || (freq == "") || (isNaN(freq))) {
		alert("To add a train, please complete all fields properly, then re-submit the form.")
	} else {
		var newTrain = {
			train: train,
			destination: dest,
			initialTime: startTime,
			frequency: freq
		}
		db.ref('TrainsDB/').push(newTrain);
		$('#train-name-input, #destination-input, #initial-time-input, #frequency-input').val("").blur();
	}	
});


$(document).on('click', '#refreshTable', function() {
	$('#refreshTable').blur();
	getSnapshot();
});