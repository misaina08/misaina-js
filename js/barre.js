
// la barre est un objet singleton
let barre = {
    // propriétés
    x : 0,
    y : 500, 
    width : 400, 
    height : 10,
    vxMiniBarre : 0,
    widthMiniBarre : 80,
    xMiniBarre : 120,

    // méthodes 
    moveTo : function(x){
        this.xMiniBarre = x - this.widthMiniBarre/2;
    },
    draw : function(context){
        context.save();
    
        context.fillStyle = '#0e213a';
        context.fillRect(this.x, this.y, this.width, this.height);
        context.fillStyle = '#f9f9f9';
        context.fillRect(this.xMiniBarre, this.y, this.widthMiniBarre, this.height);
        context.restore();
    }
}