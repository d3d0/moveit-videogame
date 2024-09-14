// Require a character controller to be attached to the same game object
@script RequireComponent(CharacterController)

//Velocità
var speed = 10.0;
var jumpSpeed = 15.0;
var gravity = 20.0;
private var moveDirection = Vector3.zero;
private var grounded : boolean = false;
//Rotazione
var rotazione = 3.0;

function Update () {

	var controller : CharacterController = GetComponent(CharacterController); 
	//Rotazione
	transform.Rotate(0,Input.GetAxis("Horizontal") * rotazione, 0); 
	//Movimento Avanti/Indietro
	var forward = transform.TransformDirection(Vector3.forward);
	var curSpeed = speed * Input.GetAxis("Vertical");
	controller.SimpleMove(forward * curSpeed); 

}