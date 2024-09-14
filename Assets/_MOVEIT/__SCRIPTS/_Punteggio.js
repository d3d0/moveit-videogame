#pragma strict
private var fine : boolean = false;

static var arrayPunteggiScenari : int[] = [0,0,0];
static var punteggioFinale : int;

function Start () {

	//arrayPunteggiScenari = [0,0,0];

}

function Update () {
	
	/*
	print("PUNTEGGIO: " + arrayPunteggiScenari[0] + " " +
	arrayPunteggiScenari[1] + " " + arrayPunteggiScenari[2] +
	" PUNTEGGIO FINALE: " + punteggioFinale);
	*/
	
}

function PunteggioFinale () {
	if (!fine) {
		fine = true;
		for(var i:int=0; i<arrayPunteggiScenari.length; i++) {
    		punteggioFinale += arrayPunteggiScenari[i];
    	}
    }
    return punteggioFinale;
}