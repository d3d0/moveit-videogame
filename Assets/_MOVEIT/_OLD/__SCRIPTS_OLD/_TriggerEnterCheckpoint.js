#pragma strict

var nome : String;

function Start () {

	//transform.parent.name = "destroy";
	nome = transform.gameObject.name;
	print("NOME: " + nome);
	
}

function OnTriggerEnter (other : Collider) {
	
	print("NOME: " + nome);
	
	// ATTENZIONE: distruggo il parent del
	// mio Checkpoint ovvero --> MODULO
    Destroy(transform.parent.gameObject ,3);
    
    
}

