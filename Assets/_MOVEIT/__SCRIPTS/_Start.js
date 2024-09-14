#pragma strict

private var startTime : float;			// tempo partenza livello
private var restSeconds : int;			// secondi reali rimasti
private var roundedRestSeconds : int;	// arrotondamento
private var displaySeconds : int;		// secondi nel display
private var guiMessage : GameObject;  	// gui hurry up
private var guiTime : float;
private var attiva : boolean;
private var disattiva : boolean;
var tipoGioco : String;

// -----------------------------------------------------------

var countDownSeconds : int; 			// tempo iniziale
var guiManager : PlayMakerFSM;			// fsm guimanager
var globalVariables;					// variabili globali
var numeroCheckPoint : int;				// checkpoint passati
var difficoltaCheckPoint : int;			// checkpoint da passare

// -----------------------------------------------------------

function Awake () {
	disattiva = false;
	attiva = false;

	// scalatura tempo
	Time.timeScale = 0.0000001;
	
	// ATTENZIONE: startTime è = 0
    startTime = Time.timeSinceLevelLoad;
 	
 	// ATTENZIONE: inizializzo il tipo di gioco
    tipoGioco = Application.loadedLevelName;

}


function OnGUI () {
	Disattiva();
	
	//print("TIPOGIOCO: " + tipoGioco);
	
	var partenza : boolean = false;
    var text : String = displaySeconds.ToString();
    
	guiMessage = GameObject.Find("GUI_Partenza");
    guiMessage.guiText.material.color = Color.red;
    guiMessage.guiText.fontSize = 65;
    
    //print("GUITIME: "+guiTime);
    //print("restSeconds: "+restSeconds);
    //print("startTime Start: "+startTime+" GUITIME -> " + guiTime);
    
    // FASE 1: --------------
    // partenza conteggio
    if (!partenza) {
    	
    	// soluzione senza timeSinceLevelLoaded
    	// var guiTime = (Time.time) - startTime)*10000000;
    	
    	guiTime = (Time.timeSinceLevelLoad*10000000) - startTime;
    	restSeconds = 4 - (guiTime);
    	guiMessage.GetComponent(GUIText).text = text;
    	
    }
    // FASE 2: --------------
    // subito dopo lo zero inizio il conteggio
    if (restSeconds > 0) {
    	
    	guiTime = (Time.timeSinceLevelLoad*10000000) - startTime;
    	restSeconds = 4 - (guiTime);
    	guiMessage.GetComponent(GUIText).text = text;
    	partenza = true;
    	
    }
    // FASE 3: --------------
    // partenza gioco
    if (restSeconds <= 0) {
        
        guiManager = GameObject.Find("__GUIManager").GetComponent.<PlayMakerFSM>();
		numeroCheckPoint = guiManager.FsmVariables.GlobalVariables.GetFsmInt("CheckPointPassed").Value;
        
        guiMessage.guiText.fontSize = 45;
        guiMessage.guiText.text = "PARTENZA !!";
        
        // ATTENZIONE:
        // scalatura normale del tempo
        Time.timeScale = 1;
        
        guiTime = Time.timeSinceLevelLoad;
    	restSeconds = countDownSeconds - (guiTime);
        
    }
    // FASE 4: --------------
    // attivazione della pausa
    if (restSeconds <= -1) {
    	guiMessage.guiText.text = "";
    	
    	guiTime = Time.timeSinceLevelLoad;
    	restSeconds = countDownSeconds - (guiTime);
    	
    	this.enabled = false;
    	
    	// ATTIVAZIONE PAUSA
    	Attiva();
    	
    }
    
    //display the timer
    roundedRestSeconds = Mathf.CeilToInt(restSeconds);
    displaySeconds = roundedRestSeconds % 60;

}

function Disattiva() {
	if (!disattiva) {
		this.GetComponent(_Pausa).enabled = false;
		this.GetComponent(_PausaVite).enabled = false;
		disattiva = true;
	}
}

function Attiva() {
	if (!attiva) {
		if (tipoGioco == "tempo") {
			this.GetComponent(_Pausa).enabled = true;
		}
		else if (tipoGioco == "vite") {
			this.GetComponent(_PausaVite).enabled = true;
		}
	}
}