#pragma strict

private var startTime : float;			// inizializzazione tempo
static var roundedSeconds : int;		// variabile globale per secondi
static var scoreSeconds : int;
var tempoColpito : int = 0;
var pulisci : boolean = false;
var prima : boolean = false;
var seconda : boolean = false;

var customGuiStyle : GUIStyle;
static var numeroVite : int = 3;
var guiManager : PlayMakerFSM;
var personaggio : PlayMakerFSM;

private var guiCount : GameObject;  	// gui countdown
private var guiHurryUp : GameObject;  	// gui hurry up


    
function Awake () {
	// inizializzo isFinished
	_PausaVite.isFinished = false;
	
	// inizializzo vite a 3
	numeroVite = 3;
	
	// il tempo viene calcolato quando lo script viene avviato
    startTime = Time.time;
    
    // recupero gli oggetti
	guiCount = GameObject.Find("GUI_CountDown");
	guiHurryUp = GameObject.Find("GUI_Sbrigati");
	
	// FSM
    guiManager = GameObject.Find("__GUIManager").GetComponent.<PlayMakerFSM>();
	personaggio = GameObject.Find("PersonaggioVite").GetComponent.<PlayMakerFSM>();
	numeroVite = guiManager.FsmVariables.GetFsmInt("viteAttuali").Value;
	
}

function Update () {
	
	// aggiorno il numero di vite
	numeroVite = guiManager.FsmVariables.GetFsmInt("viteAttuali").Value;

}

function OnGUI () {
    Pulisci();
	/* 
	Right, the first zero is the order of the variable to show. 
	The 00 means the minimum number of digits to use for displaying that value.
	Two zeros tell the parser to display the single-digit values (1, 2, 3...) with a leading 0: 01,02,03. 
	Using 000 would lead to 001, 002, 003.
	*/
	
	// formato del testo visualizzato per il count down
	var text = String.Format ("{0:0000}", scoreSeconds);
	
	// IMPORTANTE:
	// il tempo è calcolato del momento in cui lo script viene chiamato
    // invece che dal momento in cui il gioco è stato avviato
    var guiTime = Time.time - startTime;

    // visualizza minuti e secondi nel display
    roundedSeconds = Mathf.CeilToInt(guiTime);
   	scoreSeconds = guiTime * 10;
   	//print("GUITIME: " + scoreSeconds);

    //GUI.Label (Rect (400, 25, 100, 30), text);
    guiCount.GetComponent(GUIText).text = text;

	
	switch(numeroVite){
		case 3:
			GUI.Label (Rect(Screen.width - 140, 20, 40, 52), "", customGuiStyle);
			GUI.Label (Rect(Screen.width - 100, 20, 40, 52), "", customGuiStyle);
			GUI.Label (Rect(Screen.width - 60, 20, 40, 52), "", customGuiStyle);
			break;
			
		case 2:
			PrimaCollisione();
			GUI.Label (Rect(Screen.width - 100, 20, 40, 52), "", customGuiStyle);
			GUI.Label (Rect(Screen.width - 60, 20, 40, 52), "", customGuiStyle);
			break;
			
		case 1:
			SecondaCollisione();
			GUI.Label (Rect(Screen.width - 60, 20, 40, 52), "", customGuiStyle);
			break;
			
		case 0:			
			guiHurryUp.guiText.transform.position.y = 0.9;
	        guiHurryUp.guiText.fontSize = 30;
	        guiHurryUp.guiText.text = "FINE GIOCO !! RITENTA !!";
	        
			_PausaVite.isFinished = true;
			var script = this.GetComponent(_Vite);
			script.enabled = false;
			break;
	}
}

function PrimaCollisione() {
	if(!prima){
		tempoColpito = roundedSeconds;
		prima = true;
		pulisci = true;
	}
}

function SecondaCollisione() {
	if(!seconda){
		tempoColpito = roundedSeconds;
		seconda = true;
		pulisci = true;
		
		
	}
}

function Pulisci() {
	if (pulisci) {
		guiHurryUp.guiText.text = "COLPITO !!";
		
		if ((roundedSeconds-tempoColpito) >= 3) {
			guiHurryUp.guiText.text = " ";
			personaggio.Fsm.Event("AttivaPlayer");
			pulisci = false;
		}
	}
}

/*
function Pulisci() {
	if (pulisci) {
		guiHurryUp.guiText.text = "COLPITO !!";
		
		if ((roundedSeconds-tempoColpito) >= 3) {
			guiHurryUp.guiText.text = " ";
			personaggio.FsmVariables.GetFsmString("statoPersonaggio").Value = "Attiva";
			pulisci = false;
		}
		
		else if ((roundedSeconds-tempoColpito) < 3) {
			personaggio.FsmVariables.GetFsmString("statoPersonaggio").Value = "Disattiva";
			pulisci = true;
		}
	}
}
*/