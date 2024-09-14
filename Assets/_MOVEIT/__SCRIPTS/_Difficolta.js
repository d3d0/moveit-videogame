#pragma strict

// variabili difficoltà
private var incrementoCheck : int = 5;
private var incremementoNemici : int = 1;
private var inizializzazioneCheck : int[] = [10,15,20];
private var inizializzazioneNemici : int[] = [3,4,5]; // MAX NEMICI = 8
// gioco a vite
private var startTime : float;
private var intervallo : int = 30;
private var roundedSeconds : int;
var difficoltaVite : int;
// generale
var nemiciManager : PlayMakerFSM;
var tipoGioco : String;

function Awake() {
	
	// il tempo viene calcolato quando lo script viene avviato
    startTime = Time.time;
    
	// SE VOGLIO IMPOSTARE TIPO GIOCO DALLA FSM:
	//nemiciManager = GameObject.Find("__NemiciManager").GetComponent.<PlayMakerFSM>();
 	//tipoGioco = nemiciManager.FsmVariables.GlobalVariables.GetFsmString("tipoGioco").Value;
 	
 	// nome livello
	tipoGioco = Application.loadedLevelName;
	
	if (tipoGioco == "tempo"){
		// GIOCO A TEMPO:
		_CountDown.difficoltaCheckPoint = inizializzazioneCheck[0]+(incrementoCheck*_Pausa.scenaAttuale);
		_RandomObject.numberToInstantiate = inizializzazioneNemici[0]+(incremementoNemici*_Pausa.scenaAttuale);
	}
	else if (tipoGioco == "vite"){
		// GIOCO A VITE:
		_RandomObject.numberToInstantiate = inizializzazioneNemici[0]+(incremementoNemici*_Pausa.scenaAttuale);
	}
	
}

function Update() {

	var guiTime = Time.time - startTime;
	roundedSeconds = Mathf.CeilToInt(guiTime);
	//print("SECONDI: " + roundedSeconds);
	if (tipoGioco == "vite") {
		if (roundedSeconds%intervallo == 0 && difficoltaVite<8) {
			//print("INTERVALLO");
			difficoltaVite = roundedSeconds/intervallo;
			_RandomObject.numberToInstantiate = inizializzazioneNemici[0]+(incremementoNemici*difficoltaVite);
		}
	}
}