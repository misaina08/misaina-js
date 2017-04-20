class ObjetGraphique{
    // constructeur qui prend en paramètre : 
    // les coordonnées(x, y), 
    // les vitesse(vx, vy),
    // la couleur de l'objet
    constructor(x, y, vx, vy, couleur){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.couleur = couleur;
    }

    // mouvement de l'objet par rapport à la vitesse
    move(){
        this.x += this.vx;
        this.y += this.vy;
    }

    // dessin de l'objet
    draw(){

    }

}