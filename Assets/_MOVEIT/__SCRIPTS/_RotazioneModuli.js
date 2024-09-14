#pragma strict

static var gira : boolean = true;

var rotazione : float = 1;

function Update () {
	//print(Time.deltaTime);
	
	//Move the object 5 meters per second!
	rotazione = Time.deltaTime * 5;
	
    transform.Rotate(0,0,rotazione);
	
}

