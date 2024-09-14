#pragma strict

private var h : float = 0;

private var v : float = 0;

 

var RotateSpeed = 2;

 

function Start() {

    Physics.gravity = Vector3(10,10,0);

}

 

function Update () {

 

Physics.gravity = Vector3(10,10,0);

 
	v = Input.GetAxis("Horizontal") * Time.deltaTime * RotateSpeed;
	
	h = Input.GetAxis("Vertical") * Time.deltaTime * RotateSpeed;
	
	transform.Rotate(h,(v * -1),0,0);

 

}