class Brique extends ObjetGraphique{
    constructor(x, y, width, height, couleur, dead){
        super(x, y, 0, 0, couleur);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dead = dead;
    }
    draw(context){
        if(!this.dead){
            context.save();
            // context.translate(this.x, this.y);
            context.fillStyle = this.couleur;
            context.fillRect(this.x, this.y, this.width, this.height);
            context.restore();
        }
        
    }
}
