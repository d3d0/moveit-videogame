#pragma strict

static var gira : boolean = true;

var rotazione : float = 1;

function Start () {

}

function Update () {
	// Move the object 15 meters per second!
	rotazione = Time.deltaTime * 5;
	
	if (gira) {
		
	    //transform.Translate (0, 0, rotazione);
	    transform.Rotate(-rotazione,0,0);
	}
	else {
		
	    //transform.Translate (0, 0, rotazione);
	    transform.Rotate(0,0,0);
	}
}

