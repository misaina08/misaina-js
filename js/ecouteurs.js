
function creerEcouteurs(){
    jeu.canvas.addEventListener('mousemove', deplacerSouris);
    window.addEventListener('keydown', touchePressee);
    window.addEventListener('keyup', toucheRelachee);
}
function deplacerSouris(event){
    let position = getMousePosition(jeu.canvas, event);
    barre.moveTo(position.x);
}
// renvoie les coordonnées du curseur 
function getMousePosition(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
function touchePressee(event){
    
    if(event.keyCode === 32){
        jeu.inputStates.space = true;
        
    }
}
function toucheRelachee(event){
    if(event.keyCode === 32){
        jeu.inputStates.space = false;
    }
}