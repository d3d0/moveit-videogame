/* move.js */
/* Script for game objects that respond to key controls. */

var moveSpeed : float = 90.0; /* Block speed */
var turnSpeed : float = 90.0; /* Degrees per second. */
var rotazioneCamera : float = 50.0;
/* Note: MUST use “.0” or “float”!! */

var speed : float = 50.0;



function Update( ) {
	print(rigidbody.position.x);
	
    /* Move Forward or Backward... */
    /* [default keys: w/s/fwd/bak = “Vertical” (z axis)] */
    /*
    var zt : float =  moveSpeed * Input.GetAxis("Vertical") * Time.deltaTime; 
    transform.Translate(0, 0, zt);
    */
    
    /* Turn Left or Right... */
    /* beware: MUST do float math! */
    /* [default keys: a/d/left/right = “Horizontal” (x axis)] */
    /*
    var turnAngle : float = turnSpeed * Input.GetAxis("Horizontal") * Time.deltaTime;
    transform.Translate(0, turnAngle, 0);
    
    transform.Translate(0,0,Time.deltaTime*0.1); // move forward
	transform.Rotate(0,Time.deltaTime*0.1,0); // turn a little
	*/
	
	//is the user pressing left or right (or "a &amp; "d") on the keyboard?
	horMovement = Input.GetAxis("Horizontal");
	
	//is the user pressing up or down (or "w" &amp; "s") on the keyboard?
	//vertMovement = Input.GetAxis("Vertical");
 
	
	
	if (horMovement && rigidbody.position.x <= 20 && rigidbody.position.x >= -20 ) {
		transform.Translate(transform.right * horMovement * Time.deltaTime * turnSpeed);
		//transform.Rotate(0,horMovement*Time.deltaTime*turnSpeed,0);
		
		// Ruoto la camera attorno il Punto di Ancoraggio
		// transform.Find("PuntoAncoraggio").rigidbody.AddForce(0, 10, 0);
		transform.Find("PuntoAncoraggio").Rotate(0,-horMovement*Time.deltaTime*rotazioneCamera,0);
	}
	else {
		resetBarrel();
		//transform.Find("PuntoAncoraggio").localEulerAngles.y = 0;
	}
 	
 	if (rigidbody.position.x >= 20) {
		transform.Translate(-0.1, 0,0);
	}
	else if (rigidbody.position.x <= -20) {
		transform.Translate(0.1, 0,0);
	}
		
	/*if (vertMovement) {
		transform.Translate(transform.up * vertMovement * Time.deltaTime * speed);
	}*/
	
	
	forwardMovement = Input.GetAxis("Vertical");
	if (forwardMovement) {
		_RotazioneModuli.gira = true;
		// lo forziamo ad avanzare
		//rigidbody.AddForce(transform.forward*500);
		//transform.Translate(transform.forward * forwardMovement * Time.deltaTime * speed);
		//rigidbody.AddForce(Vector3.forward * 10 * Time.deltaTime,ForceMode.Acceleration);
	}
	
	// casts a ray against all colliders in the scene in the forward direction
	var fwd = transform.TransformDirection (Vector3.forward);
	var rgt = transform.TransformDirection (Vector3.right);
	var lft = transform.TransformDirection (-Vector3.right);
    if (Physics.Raycast (transform.position, fwd, 5) ||
        Physics.Raycast (transform.position, rgt, 2) ||
        Physics.Raycast (transform.position, lft, 2)) {
        print ("There is something in front of the object!");
        _RotazioneModuli.gira = false;
    }
    
	

} 

function OnCollisionEnter(collision : Collision)
{
	// se il nome dell'oggetto collisso non è Terrain allora elimina lo sparo
    if (collision.gameObject.name != "Terrain")
    {
    	// distruggo me stesso
    	//Destroy(gameObject);
    	
    	// ingrandisco l'oggetto colliso
    	//collision.gameObject.transform.localScale += Vector3(10,1,1);
    	
    	//collision.gameObject.rigidbody.AddForce(Vector3.right * 100 ,ForceMode.Acceleration);
    	//collision.gameObject.rigidbody.AddForce(transform.forward*5000);
    	
    	
        // distruggo l'oggetto che collido
        //Destroy(collision.gameObject);
        
        //_RotazioneModuli.gira = false;
    
    }
    else if (collision.gameObject.name == "Cubo") {
    	collision.gameObject.rigidbody.mass += 10;
    }
}

function resetBarrel(){
    print("resetting barrel");
    var epsilon : float = 0.001f;
    var currentAngle : float = transform.Find("PuntoAncoraggio").localEulerAngles.y;

    if (currentAngle < 360 - epsilon && currentAngle > epsilon) {
       print("barrel isnt at 0");
       var angleDelta : float = Time.deltaTime * 40;
       // positive if forward; negative if backward (rotation wise)
       var rotMultiplier : int = (currentAngle > 180) ? 1 : -1;
       var resultAngle : float =
           Mathf.Clamp(currentAngle + rotMultiplier * angleDelta, 0, 360);

       var rotation : Vector3 = transform.localEulerAngles;
       rotation.y = resultAngle;
       transform.Find("PuntoAncoraggio").localEulerAngles = rotation;
    }
    else {
       print("barrel at 0"); 
    }
}
