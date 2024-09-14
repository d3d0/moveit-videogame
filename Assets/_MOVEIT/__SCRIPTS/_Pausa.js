#pragma strict

var guiSkin: GUISkin;						// skin dei pulsanti
var nativeVerticalResolution = 1200.0;		// risoluzione
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
static var isLooser : boolean = false;		// variabile globale
static var isWinner : boolean = false;		// variabile globale
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
}

function Update() {
    	print("SCENA: " + scenaAttuale + " / MOD. INIZIALE: " 
    	+ moduliStart + " / MOD DA CARICARE: " + moduliManager.FsmVariables.GlobalVariables.GetFsmString("moduliDaCaricareGlobale").Value);

    	if(Input.GetKeyDown("escape") && !isPaused && !isLooser && !isWinner && !isFinished) {
      	print("Paused");
      	Time.timeScale = 0.0;
      	isPaused = true;
      	
    }
    else if(Input.GetKeyDown("escape") && isPaused && !isLooser && !isWinner && !isFinished) {
      	print("Unpaused");
      	Time.timeScale = 1.0;
      	isPaused = false;
      	guiMessage.guiText.text = "";
      	GameObject.Find("Camera").GetComponent(DepthOfFieldScatter).aperture = 7;
      
    }
    else if(isLooser) {
      	print("Sconfitta");
      	Time.timeScale = 0.0;   
         
    }
    else if(isWinner) {
      	print("Vittoria");
      	Time.timeScale = 0.005;
            
    }
    else if(isFinished) {
		print("Fine!");
      	Time.timeScale = 0.0;
            
    }
   
}

function OnGUI ()
{
	var wButton : int = 160;  	// larghezza pulsanti
	var hButton : int = 30;  	// altezza pulsanti
	var offset : int = 40;		// offset
	
	guiHurryUp = GameObject.Find("GUI_Sbrigati");
	
	// individuo l'oggetto per il messaggio
	guiMessage = GameObject.Find("GUI_Message");
	//guiMessage.guiText.text = "";
    
    // Set up gui skin
    GUI.skin = guiSkin;

    // Our GUI is laid out for a 1920 x 1200 pixel display (16:10 aspect). The next line makes sure it rescales nicely to other resolutions.
    //GUI.matrix = Matrix4x4.TRS (Vector3(0, 0, 0), Quaternion.identity, Vector3 (Screen.height / nativeVerticalResolution, Screen.height / nativeVerticalResolution, 1)); 
	
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
			 ResetScena();
			 
			 Application.LoadLevel("tempo");
			 Time.timeScale = 1.0;
			 isPaused = false;
			 GameObject.Find("Camera").GetComponent(DepthOfFieldScatter).aperture = 7;
		}
		if(GUI.Button (Rect((Screen.width-wButton)/2,(Screen.height-30)/2+20,wButton,30), "Torna al Menu Principale", "button")) {
			 print("Menu");
			 // RESET SCENA / MODULI
			 ResetScena();
			 
			 Time.timeScale = 1.0;
			 isPaused = false;
			 Application.LoadLevel("start");
      	}
      	if(GUI.Button (Rect((Screen.width-wButton)/2,(Screen.height-30)/2+60,wButton,30), "Esci dal Gioco")) {
        	 print("Quit!");
        	 Application.Quit();
        }
	}
	
	if(isLooser) {
    
    	GameObject.Find("Camera").GetComponent(DepthOfFieldScatter).aperture = 100;
    
      	if(GUI.Button (Rect((Screen.width-wButton)/2,(Screen.height-30)/2-40,wButton,30), "Reinizia il Livello", "button")) {
			 print("Restart");
			 // RESET SCENA / MODULI
			 ResetScena();
			 
			 isLooser = false;
			 Time.timeScale = 1.0;
			 GameObject.Find("Camera").GetComponent(DepthOfFieldScatter).aperture = 7;
			 Application.LoadLevel("tempo");
		}
		if(GUI.Button (Rect((Screen.width-wButton)/2,(Screen.height-30)/2,wButton,30), "Torna al Menu Principale", "button")) {
			 print("Menu");
			 // RESET SCENA / MODULI
			 ResetScena();
			 
			 isLooser = false;
			 Time.timeScale = 1.0;
			 Application.LoadLevel("start");
      	}
      	if(GUI.Button (Rect((Screen.width-wButton)/2,(Screen.height-30)/2+40,wButton,30), "Esci dal Gioco")) {
        	 print("Quit!");
        	 Application.Quit();
        }
	}
	
	if(isWinner) {
		guiHurryUp.guiText.text = "";
		
		CalcolaPunteggiParziali();
    	
    	GameObject.Find("Camera").GetComponent(DepthOfFieldScatter).aperture = 100;
    	GUI.BeginGroup(Rect(Screen.width / 2 - 125, Screen.height / 2 - 85, 250, 170));
    	GUI.Box(Rect(0, 0, 250, 170), "Punteggio Livello");
    	GUI.Label (Rect(20, 30, 200, 30), "Tempo Impiegato: " + (61 - seconds) ); // tempo IMPIEGATO
    	GUI.Label (Rect(20, 50, 200, 30), "Checkpoint: " + check + " in " + elencoScene[scenaAttuale-1]);
    	GUI.Label (Rect(20, 70, 200, 30), "Bonus Colpiti: " + valoreBonus);
    	
    	// SALVO PUNTEGGIO:
    	_Punteggio.arrayPunteggiScenari[scenaAttuale-1] = totale;
    	
    	// PUNTEGGIO FINALE:
    	GUI.Label (Rect(20, 90, wButton, 30), "Punteggio: " + totale);
    	
    	// DISTRUGGO COUNTDOWN: usare onEnabled
    	GameObject.Find("CountDownScript").Destroy(GetComponent(_CountDown));
    	GameObject.Find("CountDownScript").Destroy(GetComponent(_Difficolta));
    	
    	// DA FARE:
    	// 1) salvare il punteggio in PlayerPrefs
    	// 2) ripartenza del CountDown - OK
    	// 3) caricare Partenza con un mini conteggio
    	// 4) caricare MODULI NUOVI - OK
    	// 5) reinizializzare checkPointPassed - OK
    	// 6) togliere blur - OK
    	// 7) cambiare scritta con: "Ora sei in ..." - OK
			 
      	if(GUI.Button (Rect(20,130,200,30), "Continua con " + elencoScene[scenaAttuale])) {
        	print("Continua!");
        	isWinner = false;
        	Time.timeScale = 1.0;
        	
        	// 1) PLAYERPREFS ------------------------------------------
        	
        	// 2) COUNTDOWN ------------------------------------------
        	
        	GameObject.Find("CountDownScript").AddComponent(_Difficolta);
        	GameObject.Find("CountDownScript").AddComponent(_CountDown);
        	guiScore = GameObject.Find("GUI_Score");
        	guiScore.GetComponent(GUIText).text = "percorso";
        	guiScore = GameObject.Find("GUI_Score");
        	guiScore.GetComponent(GUIText).text = "percorso";
        	guiBonus = GameObject.Find("GUI_Bonus");
        	guiBonus.GetComponent(GUIText).text = "bonus";
        	
        	// 3) MINI CONTEGGIO / PROSEGUI -----------------------------
        	
        	// 4) MODULI NUOVI ------------------------------------------
        	//moduliManager = GameObject.Find("__ModuliManager").GetComponent.<PlayMakerFSM>();
			//moduliManager.FsmVariables.GetFsmString("moduliDaCaricare").Value = elencoScene[scenaAttuale].ToString();
			//nemiciManager = GameObject.Find("__NemiciManager").GetComponent.<PlayMakerFSM>();
			//nemiciManager.FsmVariables.GetFsmString("nemiciDaCaricare").Value = elencoScene[scenaAttuale].ToString();
			moduliManager.FsmVariables.GlobalVariables.GetFsmString("moduliDaCaricareGlobale").Value = elencoScene[scenaAttuale].ToString();
        				
			// 5) REINIZIALIZZO CHECKPOINT E BONUS COLPITI ------------------
			guiManager = GameObject.Find("__GUIManager").GetComponent.<PlayMakerFSM>();
			guiManager.FsmVariables.GlobalVariables.GetFsmInt("CheckPointPassed").Value = 0;
			guiManager.FsmVariables.GetFsmInt("bonusColpiti").Value = 0;
			
			// 6) TOGLIERE BLUR ---------------------------------------------
			GameObject.Find("Camera").GetComponent(DepthOfFieldScatter).aperture = 7;
			
			// 7) CAMBIARE SCRITTA ------------------------------------------
			guiMessage.guiText.transform.position.y = 0.5;
	        guiMessage.guiText.material.color = Color.green;
	        guiMessage.guiText.fontSize = 40;
	        guiMessage.guiText.text = "Ora sei in\n" + elencoScene[scenaAttuale];
        }
        GUI.EndGroup ();
	}
	
	if(isFinished) {
		//Time.timeScale = 0.0;
		
		guiHurryUp.guiText.text = "";
		
		CalcolaPunteggiParziali();
    	
    	// SALVO PUNTEGGIO
    	_Punteggio.arrayPunteggiScenari[scenaAttuale-1] = totale;
    	
    	GameObject.Find("Camera").GetComponent(DepthOfFieldScatter).aperture = 100;
    	
    	GUI.BeginGroup(Rect(Screen.width / 2 - 125, Screen.height / 2 - 100, 250, 200));
    	GUI.Box(Rect(0, 0, 250, 200), "Punteggio Finale");
    	GUI.Label (Rect(20, 30, 200, 30), elencoScene[0] + ": " + _Punteggio.arrayPunteggiScenari[0] );
    	GUI.Label (Rect(20, 50, 200, 30), elencoScene[1] + ": " + _Punteggio.arrayPunteggiScenari[1] );
    	GUI.Label (Rect(20, 70, 200, 30), elencoScene[2] + ": " + _Punteggio.arrayPunteggiScenari[2] );
    	GUI.Label (Rect(20, 90,wButton,30), "Punteggio: " + GetComponent(_Punteggio).PunteggioFinale());
    	
    	//print("SCENA ATTUALE: " + scenaAttuale +" "+totale);
    				 
        if(GUI.Button (Rect(25,120,200,30), "Gioca di nuovo!!", "button")) {
        	print("Restart!");
        	isFinished = false;
        	Time.timeScale = 1.0;
			GameObject.Find("Camera").GetComponent(DepthOfFieldScatter).aperture = 7;
			
			// RESET SCENA / MODULI
			ResetScena();
        	
			Application.LoadLevel("tempo");
		}
		if(GUI.Button (Rect(25,160,200,30), "Torna al Menu Principale", "button")) {
			print("Menu");
			isFinished = false;
			Time.timeScale = 1.0;
			
			// RESET SCENA / MODULI
			 ResetScena();
			 
			Application.LoadLevel("start");
      	}
        GUI.EndGroup ();
	}


}

function CalcolaPunteggiParziali() {
	// CALCOLO PUNTEGGIO:
    // numeroSecondiRimasti * numeroCheckPoint + plus Percentuale + bonus
    // dove plus sono i secondi rimasti calcolati in percentuale
	seconds = _CountDown.roundedRestSeconds+1;
    check = _CountDown.numeroCheckPoint;
    guiManager = GameObject.Find("__GUIManager").GetComponent.<PlayMakerFSM>();
	valoreBonus = guiManager.FsmVariables.GetFsmInt("bonusColpiti").Value;
	plus = (seconds*100/60);
    bonus = valoreBonus*10;
    totale = (seconds*check) + plus + bonus;
}

function ResetScena() {
	scenaAttuale = 0;
	moduliManager.FsmVariables.GlobalVariables.GetFsmString("moduliDaCaricareGlobale").Value = moduliStart;
}

@script AddComponentMenu ("GUI/Pause GUI")