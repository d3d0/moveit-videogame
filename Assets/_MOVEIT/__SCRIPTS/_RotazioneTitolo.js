#pragma strict

static var gira : boolean = true;

var rotazione : float = 1;

function Update () {
	//print(Time.deltaTime);
	
	//Move the object 15 meters per second!
	rotazione = Time.deltaTime * 15;
	
    transform.Rotate(0,rotazione,0);
	
}

