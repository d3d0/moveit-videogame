#pragma strict

/* 	
	ALGORITMO DI RANDOMIZZAZIONE NEMICI:
	Questo script si occupa di piazzare gli oggetti nemici
	sui piani a disposizione del modulo caricato.
	Gli oggetti nemici vengono presi a random da un'array
	di GameObject e poi vengono posizionati sui piani
	disponibili allineando l'asse z alla normale al piano.
	Gli oggetti possono essere istanziati sui piani ma non 
	devono essere maggiori dei piani disponibili.
	Quindi numero di oggetti è compreso tra:
	numeroMinimoOggetti e numero di piani ESISTENTI.
    Creare una variabile random che va da 
	numeroMinimoOggetti a n°piani e dovremo poi
	inizializzare spawnPoint al n°max di piani ovvero
	gli i GameObject con tag = "Piano".
	
*/

// DIFFICOLTA':
static var numeroMinOggetti: int = 1;		// numero min oggetti
static var numeroMaxOggetti: int = 3;		// numero max oggetti
static var numberToInstantiate : int; 		// numero max oggetti
var numeroNemici : int;

var myObject : GameObject; 					// oggetti da istanziare: NEMICI!
var spawnPoint : GameObject[]; 				// creazione array con dimensione
var randomizzazione :int;					// variabile casuale per i piani
var pianiRimanenti: int;					// piani non usati
var nemiciManager : PlayMakerFSM;			// fsm nemiciManager

private var minimumTime : float = 0.005;	// tempo minimo per instanziare i nemici
private var maximumTime : float = 0.005;	// tempo max per instanziare i nemici

var modulo : Transform;						// modulo padre dei piani

private var waitTime : float;				// tempo calcolato per istanziare
private var objectCount : int;				// numero oggetti istanziati

function Awake() {
	
	 // la FSM __NemiciManager mi restituisce l'oggetto nemico da inserire
 	 nemiciManager = GameObject.Find("__NemiciManager").GetComponent.<PlayMakerFSM>();
	 myObject = nemiciManager.FsmVariables.GetFsmGameObject("nemico").Value;
	 
}

function Start () {
	
	// inizializza il lasso di tempo tra min e max
    waitTime = Random.Range (minimumTime, maximumTime);
    
    // inizializzo objectCount a 0
    objectCount = 0;
    
    // ritorna una lista di gameobject taggati con "piano"
    spawnPoint = GameObject.FindGameObjectsWithTag("Piano");
    
    // inizializzo il numero di oggetti
	// numberToInstantiate = Random.Range (numeroMinOggetti, numeroMaxOggetti);
    
    // piani rimanenti (esempio 12-5=7 piani rimanenti)
    pianiRimanenti = spawnPoint.Length - numberToInstantiate;
    
    // oggetto padre -> è l'oggetto che contiene dello script
    modulo = this.gameObject.transform;

}

function Update () {
	
	numeroNemici = numberToInstantiate;
	
    if (Time.time > waitTime && objectCount < numberToInstantiate) {
    	
        waitTime = Time.time + Random.Range (minimumTime, maximumTime);
        
        var obj : GameObject;
        
        // la FSM __NemiciManager mi restituisce i nemici da caricare a random
        nemiciManager = GameObject.Find("__NemiciManager").GetComponent.<PlayMakerFSM>();
		nemiciManager.Fsm.Event("ricarica");
		myObject = nemiciManager.FsmVariables.GetFsmGameObject("nemico").Value;
	
        // scelgo uno dei piani a random
        randomizzazione = Random.Range (0, spawnPoint.Length);
        
        // print ("PIANO SCELTO: " + spawnPoint[randomizzazione].name);
        
        if (spawnPoint[randomizzazione].tag == "Piano") {
        
        	//print ("ATTENZIONE > POSIZIONAMENTO OGGETTO");
        
        	obj = Instantiate(myObject,
         	spawnPoint[randomizzazione].transform.position, 
         	spawnPoint[randomizzazione].transform.rotation) as GameObject;
         	
         	// collego l'oggetto al parent MODULI_WRAPPER per  
        	// ereditare la rotazione costante sull'asse x
        	obj.transform.parent = modulo;
        	
        	// IMPORTANTE: per avere un corretto Raycasting
        	obj.transform.Translate(0, 0.5, 0);
        
	        // posizione e rotazione rispetto al suo parent
	        // obj.transform.localPosition = Vector3(0, 0, 0);
	        // obj.transform.localRotation = Quaternion.Euler(0, 0, 0);
	        	        
	        var hit : RaycastHit;
	        
		
			// RAYCSTING --------------------------------------------
		    // cast a ray down in the world from our current position
		    
		    // ATTENZIONE: il raggio deve essere Vector3.forward e non
		    // Vector3.up altrimenti se sparo un raggio in base e sono
		    // nell'emisfero sottostante della circonferenza non colpisce
		    // nessun punto della superficie
		    
		    if(Physics.Raycast(obj.transform.position, -Vector3.up, hit)) {
		    
		    	//print ("ATTENZIONE > RAYCASTING");
		    	
		    	// WORLD SPACE
		        // sets the rotation so the z-axis aligns to the normal of the surface beneath us
		        // this aligns the z to the surface's outward direction not the surface's z-axis
		        obj.transform.rotation = Quaternion.FromToRotation(Vector3.forward, hit.normal);
		        
		        // SELF SPACE
		        // ruoto di 90 gradi sull'asse z localmente 
		        // per girare il nemico di fronte alla camera
		        obj.transform.Rotate(0, 0, 90);
		        //obj.transform.position = Vector3(0, 0, 0);
		        
		        // spostamento oggetti
		        var spostamento : int = Random.Range (-7, 7);
		        obj.transform.Translate(0, spostamento, -0.7);
		        
		        // se è un bonus
		        if (obj.tag == "Bonus") {
		        	obj.transform.Translate(0, 0, 5);
		        }
		        
		        // se è un animale
		        if (obj.layer == 8) {
		        	var rotazione : int = Random.Range (-120, 120);
		        	obj.transform.Rotate(0, 0, rotazione);
		        }
		        	
		        // cambio il tag allo spawnpoint già usato
	        	// in modo che non possa più riutilizzarlo
	        	spawnPoint[randomizzazione].tag = "Untagged";
	        	
	        	// elimino il render a tutti i piani
    			spawnPoint[randomizzazione].renderer.enabled = false;
	        	
	        	objectCount ++;
		        
		        // STAMPA A SCHERMO
		        // print ("Raycasting -> UP");
		        
		    }
		    else {
		    	Destroy(obj.transform.transform.gameObject);
		    }
	    
        }
        
        // IMPORTANTE: aggiorno l'array di piani in modo da avere
        // a disposizione un array di soli piani con tag "Piano"
        spawnPoint = GameObject.FindGameObjectsWithTag("Piano");
        
        // STAMPA A SCHERMO
        // print ("Spawn point lenght: "+spawnPoint.Length);
        // print ("Object Count: "+objectCount);

    }
    
    // IMPORTANTE: se la lunghezza dell'array con piani taggati "Piano"
    // è uguale al numero di piani rimanenti (ovvero senza nemici)  
    // allora devo cambiare il tag relativo in "Untagged"
    if (spawnPoint.Length == pianiRimanenti) {
    	for(var i:int=0;i<spawnPoint.Length;i++) {
	    	if (spawnPoint[i].tag == "Piano") {
	    		// elimino il tag ai piani rimanenti che non ho usato
	    		spawnPoint[i].tag = "Untagged";
	    		// rendo invisibili anche i piani rimanenti
	    		spawnPoint[i].renderer.enabled = false;
	    		
	    		// STAMPA A SCHERMO
	    		// print ("Untagged");
	    	}
    	}
    }
    
    // IMPORTANTE: disattivo lo script una volta finito di posizionare i piani
    if (GameObject.FindGameObjectsWithTag("Piano").Length == 0) {
    	
    	var script = this.GetComponent(_RandomObject);
    	script.enabled = false;
    	//script.Destroy(GetComponent(_RandomObject));
	}
}

@script AddComponentMenu ("MOVEIT/Random Object")
