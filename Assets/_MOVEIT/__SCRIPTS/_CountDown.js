#pragma strict

private var startTime : float;			// inizializzazione tempo
private var restSeconds : int;			// secondi rimanenti
private var displaySeconds : int;		// secondi DISPLAY
private var displayMinutes : int;		// minuti DISPLAY
private var fineLivello : boolean;		// controllo se ho finito il livello

static var roundedRestSeconds : int;	// variabile globale per secondi rimasti

// ------------------------------------------------------

private var guiCount : GameObject;  	// gui countdown
private var guiHurryUp : GameObject;  	// gui hurry up
private var guiMessage : GameObject;  	// gui message
var countDownSeconds : int = 61; 		// tempo iniziale
var guiManager : PlayMakerFSM;			// fsm guimanager
var globalVariables;					// variabili globali

// ------------------------------------------------------

// DIFFICOLTA':
static var difficoltaCheckPoint : int;	// checkpoint da passare
static var numeroCheckPoint : int;		// checkpoint passati

// ------------------------------------------------------

var progress : float = 0;				// avanzamento barra progresso
var pos : Vector2 = new Vector2();		// posizione barra progresso
var size : Vector2 = new Vector2();		// dimensione  barra progresso
var progressBarEmpty : Texture2D;		// texture rossa
var progressBarFull : Texture2D;		// texture verde
private var larghezzaSchermo : float;	// Screen.width
private var altezzaSchermo : float;		// Screen. heigth

// ------------------------------------------------------

function Awake () {
	
	//globalVariables = guiManager.FsmVariables.GlobalVariables;
	//numeroCheckPoint = guiManager.FsmVariables.GetFsmInt("tempoSecondi").Value;
	
	// frame al secondo per l'appplicazione
	Application.targetFrameRate = 60;
	
	// il tempo viene calcolato quando lo script viene avviato
    startTime = Time.time;
    
    // questa variabile controlla se hai finito il livello
    fineLivello = false;
    
    // -----------------------------
    // ATTENZIONE -> DIFFICOLTA' !!
    // -----------------------------
    //difficoltaCheckPoint = 10;
    // -----------------------------
    
    // carico le texture dalla cartella Resources per la barra
    progressBarEmpty = Resources.Load("progress_bar_red");
	progressBarFull = Resources.Load("progress_bar_green");
    
}

function Proporzioni (proporzione: float, asse: String) {
	var calcolo : float;
	if (asse == "x") {
		larghezzaSchermo = Screen.width;
		calcolo = larghezzaSchermo * proporzione;
		//print ("calcolo -> " + calcolo);
	}
	else if (asse == "y") {
		altezzaSchermo = Screen.height;
		calcolo = altezzaSchermo * proporzione;
	}
	return calcolo;
}

function Update () {
	
	// ATTENZIONE: posizioni
	pos.x = Proporzioni(0.03, "x");
	pos.x += 0;
	pos.y = Proporzioni(0.03, "y");
	pos.y += 0;
	
	// ATTENZIONE: dimensioni
	size.x = Proporzioni(0.93, "x");
	//size.y = Proporzioni(0.015, "y");
	size.y = 2;
	
	// ATTENZIONE: avanzamento
	guiManager = GameObject.Find("__GUIManager").GetComponent.<PlayMakerFSM>();
	numeroCheckPoint = guiManager.FsmVariables.GlobalVariables.GetFsmInt("CheckPointPassed").Value;
	
	// ATTENZIONE: mappa
	// calcolo avanzamento progress bar
	progress = numeroCheckPoint * (size.x/difficoltaCheckPoint);
	
}

function OnGUI () {
	//print("startTime Countdown: "+startTime+" GUITIME -> " + guiTime);
	
	// disegno le texture sullo schermo
	// GUI.BeginGroup(new Rect (pos.x, pos.y, size.x * Mathf.Clamp01(progress), size.y));
	GUI.DrawTexture(Rect(pos.x, pos.y, size.x, size.y), progressBarEmpty);
	GUI.BeginGroup(new Rect (pos.x, pos.y, progress, size.y));
	GUI.DrawTexture(new Rect(0, 0, size.x, size.y), progressBarFull);
	GUI.EndGroup();
	
	// recupero gli oggetti
	guiCount = GameObject.Find("GUI_CountDown");
	guiHurryUp = GameObject.Find("GUI_Sbrigati");
	guiMessage = GameObject.Find("GUI_Message");
	
	// formato del testo visualizzato per il count down
	var text = String.Format ("{0:00}:{1:00}", displayMinutes, displaySeconds);
	
	// IMPORTANTE:
	// il tempo è calcolato del momento in cui lo script viene chiamato
    // invece che dal momento in cui il gioco è stato avviato
    var guiTime = Time.time - startTime;

    restSeconds = countDownSeconds - (guiTime);
    
    // -------------------------------------------------
    // ATTENZIONE -> PULISCO LO SCHERMO
    // -------------------------------------------------
    if (restSeconds == 60) {
    
        guiCount.guiText.material.color = Color.white;
        
    }
    if (restSeconds == 58) {
    
        guiMessage.guiText.text = "";
    }
    // -------------------------------------------------
    // ATTENZIONE -> 20 secondi
    // -------------------------------------------------
    if (restSeconds == 20) {
        
        // assegno la stringa al guiText
        guiHurryUp.guiText.text = "SBRIGATI !!";
        
        // coloro di rosso il countdown e hurry up
        guiHurryUp.guiText.material.color = Color.red;
        guiCount.guiText.material.color = Color.red;
    }
    if (restSeconds == 18) {
    
        guiHurryUp.guiText.text = " ";
    }
    // -------------------------------------------------
    // CARICO MODULO TRANSIZIONE
    // -------------------------------------------------
    if (numeroCheckPoint == difficoltaCheckPoint-1 && !fineLivello) {
    
    	// pre carico prima il modulo di transizione in modo che
    	// una volta finito il livello venga caricato durante la pausa
    	
    }
    // -------------------------------------------------
    // VITTORIA
    // -------------------------------------------------
    if (numeroCheckPoint == difficoltaCheckPoint && !fineLivello) {
    	
    	fineLivello = true;
    	var script = this.GetComponent(_CountDown);
    	
    	// -------------------------------------------------
    	// FINE LIVELLO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    	// -------------------------------------------------
    	if (_Pausa.scenaAttuale<(_Pausa.elencoScene.length-1)) {
	        guiMessage.guiText.transform.position.y = 0.9;
	        guiMessage.guiText.material.color = Color.green;
	        guiMessage.guiText.fontSize = 30;
	        guiMessage.guiText.text = "BRAVO !! PROSEGUI ..";
	               
	        // attivazione di una piccola pausa con la 
	        // variabile isWinner = true e cambio dei moduli
	        
	        _Pausa.isWinner = true;
	        _Pausa.scenaAttuale += 1;
	        
	  		script.enabled = false;
	  		
	  		/* oppure
	  		script = GetComponent(thescript); 
  			script.enabled = false;
  			*/
		}
		// -------------------------------------------------
    	// FINE GIOCO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    	// -------------------------------------------------
		else {
	        guiMessage.guiText.transform.position.y = 0.9;
	        guiMessage.guiText.material.color = Color.green;
	        guiMessage.guiText.fontSize = 30;
	        guiMessage.guiText.text = "HAI VINTO !!";
	               
	        // attivazione della pausa con la 
	        // variabile isFinished = true
	        
	        _Pausa.isFinished = true;
	        _Pausa.scenaAttuale += 1;
	  		script.enabled = false;
		}
        
    }
    
    // -------------------------------------------------
    // SCONFITTA
    // -------------------------------------------------
    if (restSeconds == 0) {
        
        if (numeroCheckPoint < difficoltaCheckPoint) {
	        guiManager = GameObject.Find("__GUIManager").GetComponent.<PlayMakerFSM>();
			numeroCheckPoint = guiManager.FsmVariables.GlobalVariables.GetFsmInt("CheckPointPassed").Value;
			
	        // print ("NUMERO CHECKPOINT -> " + numeroCheckPoint);
	        
	        // torna al livello precedente
	        // Application.LoadLevel("start");
	        
	        guiHurryUp.guiText.transform.position.y = 0.8;
	        guiHurryUp.guiText.material.color = Color.red;
	        guiHurryUp.guiText.fontSize = 30;
	        guiHurryUp.guiText.text = "HAI PERSO !!";
	        _Pausa.isLooser = true;
	        this.enabled = false;
        }
        
    }
    // visualizza minuti e secondi nel display
    roundedRestSeconds = Mathf.CeilToInt(restSeconds);
    displaySeconds = roundedRestSeconds % 60;
    displayMinutes = roundedRestSeconds / 60;

    //GUI.Label (Rect (400, 25, 100, 30), text);
    guiCount.GetComponent(GUIText).text = text;
    
	
}