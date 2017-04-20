class Balle extends ObjetGraphique{
    constructor(x, y, rayon, vx, vy, couleur, nbRebondBarre, point, dead){
        // appel du constructeur de la classe mère
        super(x, y, vx, vy, couleur);
        this.rayon = rayon;
        this.nbRebondBarre = nbRebondBarre;
        this.point = point;
        this.dead = dead;

    }
    
    draw(context){
        if(!this.dead){
            context.save();
            context.translate(this.x, this.y);

            context.beginPath();
            context.fillStyle = this.couleur;
            context.arc(0, 0, this.rayon, 0, 2*Math.PI);
            context.fill();
            context.restore();
            // super.draw(context);
        }
        
    }
}