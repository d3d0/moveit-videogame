#pragma strict

var planet:GameObject;
var gravity = 2;

function Start () {

}

function Update () {

}

function FixedUpdate () {
	rigidbody.velocity.x = ((-transform.position.x + planet.transform.position.x)*gravity);
	rigidbody.velocity.y = ((-transform.position.y + planet.transform.position.y)*gravity);
	rigidbody.velocity.z = ((-transform.position.z + planet.transform.position.z)*gravity);
	//transform.LookAt(planet.transform.position);

}