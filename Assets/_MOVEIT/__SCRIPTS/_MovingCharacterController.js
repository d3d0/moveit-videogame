#pragma strict

/* 	
	ALGORITMO INTERAZIONE COL PERSONAGGIO:
	Questo script si occupa gestire il movimento
	del nostro personaggio sulla scena.
	Il movimento è composto da un spostamento 
	sull'asse x per quanto riguarda le traslazioni
	verso sinistra e verso destra e da uno spostamento
	sull'asse y per quanto riguarda il salto.	
*/

var speed : float = 70.0;				// velocità di movimento
var jumpSpeed : float = 30.0;			// velocità di salto
var gravity : float = 35.0;				// forza di gravità
var traslazione : float = 0;			// forza applicata se collide
var assey : int = 10;					// forza applicata se collide
var moveDirection = Vector3.zero;		// inizializzo il movimento	
var grounded : boolean = false;			// atterraggio
var salto : boolean = true;				// attiva / disattiva salto

function Update () {
	
	// in caso di collisione con un collider
	// forziamo il personaggio sull'asse z
	transform.position.z = -42.5;
	
}

function FixedUpdate() {
	
	// ATTENZIONE: movimento sull'asse x quando sono in volo
	// print("MOVIMENTO ASSE X: " + moveDirection.x);
    moveDirection.x = Input.GetAxis("Horizontal") * speed;
	
    if (grounded) {
    	// print("GROUNDED: " + grounded);
    	
    	// stiamo toccando terra, quindi ricalcoliamo movedirection
    	moveDirection = new Vector3(Input.GetAxis("Horizontal"), 0, 0);
    	
    	// trasforma le direzione dalle coordinate locali a quelle di mondo
        moveDirection = transform.TransformDirection(moveDirection);
        moveDirection.x *= speed;
        
        // traslazione sull'asse x nel caso di collisione
		moveDirection.x -= traslazione;
		
        if (Input.GetButton ("Jump") && salto) {
            moveDirection.y = jumpSpeed;
        }
        
    }
    
	var controller : CharacterController = GetComponent(CharacterController);
	
    // applico un'ulteriore forza nel caso di collisione
    moveDirection.y -= assey;
    
    // applico la gravità
    moveDirection.y -= gravity * Time.deltaTime;    

    // muovo il mio controller
    var flags = controller.Move(moveDirection * Time.deltaTime);
    grounded = (flags & CollisionFlags.CollidedBelow) != 0;
}

// ATTENZIONE: per far funzionare lo script controllo che
// si stia usando il componente CharacterController sull'oggetto
@script RequireComponent(CharacterController)