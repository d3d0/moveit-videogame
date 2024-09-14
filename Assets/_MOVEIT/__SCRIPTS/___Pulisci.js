/*
function Pulisci() {
	if (pulisci) {
		// collisione
		guiHurryUp.guiText.text = "COLPITO !!";
		
		
		
		//print("FSM: " + personaggio.Fsm.ActiveStateName);
		
		if ((roundedSeconds-tempoColpito) > 3) {
			// pulisco il testo
			guiHurryUp.guiText.text = " ";
			// attivazione
			personaggio.FsmVariables.GetFsmString("statoPersonaggio").Value = "Attiva";
			
			if (personaggio.Fsm.ActiveStateName == "Disattivato") {
				// blocco la funzione
				pulisci = true;		
			}
			else if (personaggio.Fsm.ActiveStateName == "Attivato") {
				pulisci = false;
			}
		}
		
		else {
			// disattivazione
			personaggio.FsmVariables.GetFsmString("statoPersonaggio").Value = "Disattiva";
		}
	}
}

function Pulisci() {
	if (pulisci) {
		guiHurryUp.guiText.text = "COLPITO !!";
		
		if ((roundedSeconds-tempoColpito) > 3) {
			guiHurryUp.guiText.text = " ";
			personaggio.Fsm.Event("AttivaPlayer");
			
			if (personaggio.Fsm.ActiveStateName == "Attivato") {
				
				if (colpito<1) {
					colpito++;
				}
				pulisci = false;				
			}
			else {
				pulisci = true;
			}
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
