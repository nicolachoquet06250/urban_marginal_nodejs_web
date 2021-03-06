let sounds = {
	ambiance: new Audio('/sons/ambiance.wav'),
	death: new Audio('/sons/death.wav'),
	fight: new Audio('/sons/fight.wav'),
	go: new Audio('/sons/go.wav'),
	hurt: new Audio('/sons/hurt.wav'),
	precedent: new Audio('/sons/precedent.wav'),
	next: new Audio('/sons/suivant.wav'),
	welcome: new Audio('/sons/welcome.wav')
};

class Globals {
	static get SEPARATOR() {
		return "//";
	}

	static get CHEMIN() {
		return "media" + Globals.SEPARATOR;
	}

	static get CHEMINFONDS() {
		return Globals.CHEMIN + "fonds" + Globals.SEPARATOR;
	}

	static get FONDCHOIX() {
		return Globals.CHEMINFONDS + "fondchoix.jpg"
	}

	static get GAUCHE() {
		return 0;
	}

	// pour la direction
	static get DROITE() {
		return 1;
	}

	static get CHEMINPERSOS() {
		return Globals.CHEMIN + "personnages" + Globals.SEPARATOR;
	}

	static get PERSO() {
		return Globals.CHEMINPERSOS + "perso";
	}

	static get EXTIMAGE() {
		return ".gif";
	}

	static get MARCHE() {
		return "marche";
	}

	// les différents états
	static get BLESSE() {
		return "touche";
	}

	static get MORT() {
		return "mort";
	}

	static get NBPERSOS() { // nombre de personnages
		return 3;
	}

	static get H_PERSO() { // taille de l'image du personnage
		return 44;
	}

	static get L_PERSO() {
		return 39;
	}

	static get SEPARE() { // caractère de séparation (volontairement rare)
		return "~";
	}

	static get PSEUDO() {
		return 0;
	}

	static get NB_ROWS() {
		return 9;
	}

	static get NB_MURS() {
		return 5;
	}

	static get NB_COLS() {
		return 12;
	}

	static get AMBIANCE() {
		return 'ambiance';
	}

	static get DEATH() {
		return 'death';
	}

	static get FIGHT() {
		return 'fight';
	}

	static get GO() {
		return 'go';
	}

	static get HURT() {
		return 'hurt';
	}

	static get PRECEDENT() {
		return 'precedent';
	}

	static get NEXT() {
		return 'next';
	}

	static get WELCOME() {
		return 'welcome';
	}

	static SOUND(key) {
		return sounds[key];
	}
}