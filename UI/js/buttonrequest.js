var userResources;
var httpRequest;
var s1 = document.getElementById("storage");
var m1 = document.getElementById("memory");
var d1 = document.getElementById("device");
var n1 = document.getElementById("network");

function sendToServer(){
	console.log("in store data func");
	userResources = {

		Storage : s1.options[s1.selectedIndex].value,

		RAM : m1.options[m1.selectedIndex].value,

		Device : d1.options[d1.selectedIndex].value,

		Network : n1.options[n1.selectedIndex].value,

		UserId : '1',

		location : '-24.2059569,-40.3127728' 

	};
	console.log("userresources: "+JSON.stringify(userResources));
	console.log("in store data func end ");
	handleButtonRequest();
	console.log("in store data func checkng vl"+userResources);
}

function handleButtonRequest(e){
	//e.preventDefault();
	console.log("in handl req func");

	try
	{
		httpRequest = new XMLHttpRequest();
		httpRequest.onreadystatechange = handleResponse;
		httpRequest.open("POST", "http://localhost:8081/MyreqHandler.js",true);
		httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		httpRequest.send(JSON.stringify({request:userResources}));
		console.log("in handle req try func");
	}
	catch(err)
	{
		console.log("Error is"+err);
	}
}
function handleResponse(e){
	console.log("in handle response func");

	if(httpRequest.readyState == 4 && httpRequest.status == 200)
	{
		console.log(httpRequest.responseText);
		var myDiv = document.getElementById("myDiv");
		myDiv.innerHTML = "<h2>"+httpRequest.responseText+"<h2>";
		
	}
}