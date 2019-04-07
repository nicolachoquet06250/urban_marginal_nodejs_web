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
}