#pragma strict

var guiSkin: GUISkin;						// skin dei pulsanti
private var guiMessage : GameObject;		// gui
private var guiHurryUp : GameObject;		// gui
private var guiCount : GameObject;			// gui
private var guiScore : GameObject;  		// gui
private var guiBonus : GameObject;  		// gui

// GESTIONE DEI MODULI
private var guiManager : PlayMakerFSM;		// fsm guimanager
private var moduliManager : PlayMakerFSM;	// fsm guimanager
private var nemiciManager : PlayMakerFSM;	// fsm guimanager
var moduliStart : String;					// moduli di partenza
private var globalVariables;				// variabili globali
static var scenaAttuale : int;				// scena attuale corrispondente all'array
static var elencoScene : Array = ["Campagna","Periferia","Città"];

// GESTIONE PAUSE
static var isPaused : boolean = false;		// variabile globale
static var isFinished : boolean = false;	// variabile globale

// PUNTEGGI
var seconds : int;
var check : int;
var valoreBonus: int;
var plus : int;
var bonus : int;
var totale : int;

// Awake is used to initialize any variables or game state before the game starts. 
// Awake is called only once during the lifetime of the script instance. 
// Awake is called after all objects are initialized so you can safely speak to other objects or query them.
// Awake is always called before any Start functions.
function Awake () {
	// la prima scena è la campagna
	scenaAttuale = 0;
	
	// la FSM mi ritorna la variabile globale da caricare con i moduli scelti
	moduliManager = GameObject.Find("__ModuliManager").GetComponent.<PlayMakerFSM>();
	moduliStart = moduliManager.FsmVariables.GlobalVariables.GetFsmString("moduliDaCaricareGlobale").Value;
	
	// la FSM mi ritorna le vite disponibili
	guiManager = GameObject.Find("__GUIManager").GetComponent.<PlayMakerFSM>();
}

function Start() {
	
}

function Update() {
	//print("SCENA ATTUALE: " + scenaAttuale + " MODULI DA CARICARE: " + moduliStart);

	if(Input.GetKeyDown("escape") && !isPaused && !isFinished) {
      print("Paused");
      Time.timeScale = 0.0;
      isPaused = true;
      
      //this.GetComponent(_CountDown).enabled = false;
      //GameObject.Find("CountDownScript").Destroy(GetComponent(_CountDown));
    }
    else if(Input.GetKeyDown("escape") && isPaused && !isFinished) {
      print("Unpaused");
      Time.timeScale = 1.0;
      isPaused = false;
      GameObject.Find("Camera").GetComponent(DepthOfFieldScatter).aperture = 7;
      
      //this.GetComponent(_CountDown).enabled = false;
      //GameObject.Find("CountDownScript").AddComponent(_CountDown);
      
   }
   else if(isFinished) {
      print("Fine!");
      Time.timeScale = 0.0;      
   }
   
}

function OnGUI ()
{
	// print("NUMERO VITE: " + _Vite.numeroVite + " / " + guiManager.FsmVariables.GetFsmInt("viteAttuali").Value + " / " + isFinished);
	var wButton : int = 160;  	// larghezza pulsanti
	var hButton : int = 30;  	// altezza pulsanti
	var offset : int = 40;		// offset
	
	guiHurryUp = GameObject.Find("GUI_Sbrigati");
	
	// individuo l'oggetto per il messaggio
	guiMessage = GameObject.Find("GUI_Message");
	guiMessage.guiText.text = "";
    
    // Set up gui skin
    GUI.skin = guiSkin;
    
    // --------------------------------------------------
	// PAUSA
	// --------------------------------------------------
	
    if(isPaused) {
	
		GameObject.Find("Camera").GetComponent(DepthOfFieldScatter).aperture = 100;
		
		guiMessage.guiText.transform.position.y = 0.85;
        guiMessage.guiText.material.color = Color.white;
        guiMessage.guiText.fontSize = 35;
        guiMessage.guiText.text = "Pausa";
      
      
      	if(GUI.Button (Rect((Screen.width-wButton)/2,(Screen.height-30)/2-60,wButton,30), "Continua a giocare", "button")) {
			 print("Continue");
		 	 Time.timeScale = 1.0;
		 	 isPaused = false;
		 	 GameObject.Find("Camera").GetComponent(DepthOfFieldScatter).aperture = 7;
      	}
      	if(GUI.Button (Rect((Screen.width-wButton)/2,(Screen.height-30)/2-20,wButton,30), "Reinizia il Livello", "button")) {
			 print("Restart");
			 
			 // RESET SCENA / MODULI
			 //ResetScena(); 
			 Time.timeScale = 1.0;
			 isPaused = false;
			 GameObject.Find("Camera").GetComponent(DepthOfFieldScatter).aperture = 7;
			 Application.LoadLevel("vite");
		}
		if(GUI.Button (Rect((Screen.width-wButton)/2,(Screen.height-30)/2+20,wButton,30), "Torna al Menu Principale", "button")) {
			 print("Menu");
			 
			 // RESET SCENA / MODULI
			 // ResetScena();
			 Time.timeScale = 1.0;
			 isPaused = false;
			 Application.LoadLevel("start");
      	}
      	if(GUI.Button (Rect((Screen.width-wButton)/2,(Screen.height-30)/2+60,wButton,30), "Esci dal Gioco")) {
        	 print("Quit!");
        	 Application.Quit();
        }
	}
	
	// --------------------------------------------------
	// FINE GIOCO
	// --------------------------------------------------
	
	if(isFinished) {
		
		CalcolaPunteggiFinali();
    	
    	GameObject.Find("Camera").GetComponent(DepthOfFieldScatter).aperture = 100;
    	GUI.BeginGroup(Rect(Screen.width / 2 - 125, Screen.height / 2 - 90, 250, 180));
    	GUI.Box(Rect(0, 0, 250, 180), "Punteggio " + moduliStart);
    	GUI.Label (Rect(20, 30, 200, 30), "Tempo Impiegato: " + (seconds) );
    	GUI.Label (Rect(20, 50, 200, 30), "Bonus Colpiti: " + valoreBonus);
    	
    	// SALVO PUNTEGGIO:
    	//_Punteggio.arrayPunteggiScenari[scenaAttuale-1] = totale;
    	
    	// PUNTEGGIO FINALE:
    	GUI.Label (Rect(20, 70, wButton, 30), "Punteggio: " + totale);
    	
    	// DISTRUGGO VITE
    	GameObject.Find("CountDownScript").Destroy(GetComponent(_Vite));
    	
    	//print("SCENA ATTUALE: " + scenaAttuale +" "+totale);
    				 
        if(GUI.Button (Rect(25,100,200,30), "Gioca di nuovo!!", "button")) {
			print("Restart");
			// RESET SCENA / MODULI
			//ResetScena();
			
			GameObject.Find("CountDownScript").AddComponent(_Vite);
			isFinished = false;
			Time.timeScale = 1.0;
			GameObject.Find("Camera").GetComponent(DepthOfFieldScatter).aperture = 7;
			Application.LoadLevel("vite");
			
			
			
		}
		if(GUI.Button (Rect(25,140,200,30), "Torna al Menu Principale", "button")) {
			print("Menu");
			// RESET SCENA / MODULI
			//ResetScena();
			
			isFinished = false;
			Time.timeScale = 1.0;
			Application.LoadLevel("start");
      	}
        GUI.EndGroup ();
	}


}

function CalcolaPunteggiFinali() {
	// CALCOLO PUNTEGGIO:
    // numeroSecondiRimasti * numeroCheckPoint + plus Percentuale + bonus
    // dove plus sono i secondi rimasti calcolati in percentuale
	seconds = _Vite.scoreSeconds;
    guiManager = GameObject.Find("__GUIManager").GetComponent.<PlayMakerFSM>();
	valoreBonus = guiManager.FsmVariables.GetFsmInt("bonusColpiti").Value;
	plus = (seconds*100/60);
    bonus = valoreBonus*10;
    totale = (seconds) + plus + bonus;
}

function ResetScena() {
	
	guiManager.FsmVariables.GetFsmInt("viteAttuali").Value = 3;
}

@script AddComponentMenu ("GUI/Pause GUI")