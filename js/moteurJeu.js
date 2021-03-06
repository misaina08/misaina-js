window.onload = init;
let jeu;

function init(){
    let canvas = document.querySelector('#canvas');
    jeu = new MoteurJeu(canvas);
    creerEcouteurs();
    jeu.initEtatInitialDuJeu();
    jeu.start();
}

function MoteurJeu(){
    // éléments html
    let canvas = document.querySelector('#canvas');
    let context = canvas.getContext('2d');
    let widthCanvas = canvas.width, heightCanvas = canvas.height;

    // jeu
    let score = 0;
    let scorePrise = 0;
    let meilleurScore = 0;
    let nbCombo = 0;
    let etatsDuJeu = {
        accueil : 0,
        jeuEnCours : 1,
        finDuJeu : 2, 
        aide : 3
    };
    let etatDuJeuEnCours = etatsDuJeu.accueil;
    
    // sons :
    let plopSound = document.getElementById('plop'); 
    let scoreSound = document.getElementById('sc'); 
    let gameOverSound = document.getElementById('go'); 

    // animation basée sur le temps
    let incX, incY;
    let speedX = 300; 
    let speedY = 300; 
    let now, delta;
    let then = new Date().getTime();

    // sur le niveau du jeu
    let DUREE_NIVEAU = 8000;
    let niveau = {
        niveau : 1,
        vitesse : 1,
        duree : DUREE_NIVEAU
    }; 
    let dureeNiveauEnCours = niveau.duree;
    let tempsCreationBalle = 1000;
    // points des différentes balles : blanche, rose, rouge
    let pointsBalles = [20, 10, 5];
    
    // touches
    let inputStates = {};

    // éléments graphiques :
    let balles = [];
    let briques = [];
    let typeBalles = {
        uneBalle : 0,
        groupBalle : 1,
        bonus : 2
    };
    let signeEnCoursGroupeBall = 1;
    let typeBallesEnCours = typeBalles.uneBalle;

    // liste des couleurs qui succèdent pour les balles
    let tabCouleurBalle = ['#0078d7', '#eb8b19', '#eb3219']; 
    
    let bBlue = new Balle(widthCanvas/2, 200, 30, 0, 0, tabCouleurBalle[0],0,0,false);
    let bJaune = new Balle(130, 200, 30, 1, 0, tabCouleurBalle[1],0,0,false);
    let bRouge = new Balle(220, 200, 30, -1, 0, tabCouleurBalle[2],0,0,false);
    function initEtatInitialDuJeu(){
        balles.splice(0, balles.length);
        briques.splice(0, briques.length);
        // inputStates = {};
        niveau = {
            niveau : 1,
            vitesse : 4,
            duree : DUREE_NIVEAU
        }; 
        dureeNiveauEnCours = niveau.duree;
        tempsCreationBalle = 1000;
        etatDuJeuEnCours = etatsDuJeu.finDuJeu;
        score = 0;
        typeBallesEnCours = typeBalles.uneBalle;

        if (typeof(Storage) !== "undefined") {
            if(localStorage.meilleurScore){
                meilleurScore = localStorage.meilleurScore;
            }
            else{
                localStorage.setItem("meilleurScore", 0);
                meilleurScore = 0;
            }
        } else {
            meilleurScore = score;
        }
        
        initFPS();
    }

    // affichage d'accueil du jeu
    function home(){
        etatDuJeuEnCours = etatsDuJeu.accueil;
        
        context.fillStyle = '#0078d7';
        context.font="20px Comic Sans MS";
        context.textAlign="center"; 
        context.fillText('Appuyez sur "Espace" pour jouer', widthCanvas/2, 400);
        context.fillText('Aide "A"', widthCanvas/2, 450);
        context.fillText('Meilleur score : '+meilleurScore, widthCanvas/2, 350);
        
        bBlue.draw(context);
        bJaune.draw(context);
        bRouge.draw(context);
        barre.draw(context);
        bBlue.move();
        bJaune.move();
        bRouge.move(); 
        testeCollisionBalleAvecMurs(bBlue, widthCanvas, heightCanvas);
        testeCollisionBalleAvecMurs(bJaune, widthCanvas, heightCanvas);
        testeCollisionBalleAvecMurs(bRouge, widthCanvas, heightCanvas);
    }

    // affichage du jeu
    function start(){
        creerBriques(7, 8);
        etatDuJeuEnCours = etatsDuJeu.accueil;
        requestAnimationFrame(mainloop);
    }

    // affichage du fin de jeu
    function gameOver(){
        context.clearRect(0, 0, widthCanvas, heightCanvas);
        play(gameOverSound);
        // modifier meilleur score si supérieur
        if(scorePrise > localStorage.meilleurScore){
            localStorage.meilleurScore = scorePrise;     
            
        }
        etatDuJeuEnCours = etatsDuJeu.finDuJeu;
        context.font="20px Comic Sans MS";
        context.textAlign="center"; 
        context.fillText('Game over !!!', widthCanvas/2, 250);
        context.fillText('Votre score : '+scorePrise, widthCanvas/2, 300);
        context.fillText('Reccord : '+localStorage.meilleurScore, widthCanvas/2, 350);   
        context.fillText('Appuyez sur "Espace" pour réessayer', widthCanvas/2, 400); 
        context.fillText('Aide "A"', widthCanvas/2, 450);
        // if(newRec) localStorage.meilleurScore = scorePrise; 
        initEtatInitialDuJeu();
        creerBriques(7, 8);
        
        dessinerBriques();
    }
    // affichage de l'aide
    function aide(){
        context.clearRect(0, 0, widthCanvas, heightCanvas);
        
        context.font="14px Comic Sans MS";
        context.textAlign="start";     
        let deb = 50;
        context.fillText('Le but du jeu est d\'empêcher une balle', 10, deb, widthCanvas-10); 
        context.fillText('d\'aller à l\'extremité haute', 10, deb+30, widthCanvas-10); 
        context.fillText('Vous obtenez des points lorsque qu\'une balle arrive', 10, deb+60 , widthCanvas-10); 
        context.fillText('en bas en fonction du type de la balle :', 10, deb+90 , widthCanvas-10); 
        context.fillText('  - Balle bleue : 20 points.', 10, deb+120, widthCanvas-10); 
        context.fillText('  - Balle jaune : 10 points.', 10, deb+150, widthCanvas-10); 
        context.fillText('  - Balle rouge : 5 points.', 10, deb+180, widthCanvas-10); 
        context.fillText('Obtenez plus de points en faisant des combos.', 10, deb+210, widthCanvas-10); 
        context.fillText('Si vous touchez une brique, vous serez puni', 10, deb+240, widthCanvas-10); 
        context.fillText('et votre score diminuera du point da la balle', 10, deb+270, widthCanvas-10); 
        context.fillText('Bonne chance :)', 10, deb+310, widthCanvas-10); 
        context.fillText('Appuyez "R" pour revenir', 10, deb+350, widthCanvas-10); 
    }
    // incrémentation du niveau
    function incrementerNiveau(){
        niveau.niveau += 1;
        niveau.vitesse += 0.5;
        niveau.duree += DUREE_NIVEAU*niveau.niveau;
        if(typeBallesEnCours === typeBalles.groupBalle) niveau.duree = 7800;
        
    }
    
    // pour gérer les ballons : une seule balle ou plusieurs balles
    let nbSequenceGroup = 0;
    function gererTypeDeBalle(){
        if(tempsCreationBalle < 0){
            switch (typeBallesEnCours){
                case typeBalles.uneBalle:
                    creerBalle();
                    tempsCreationBalle = 1000;
                    nbSequenceGroup = 0;
                    break;
                case typeBalles.groupBalle:
                    
                    nbSequenceGroup += 1;
                    if(nbSequenceGroup<4){
                        creerGroupeBalle(signeEnCoursGroupeBall);
                        tempsCreationBalle = 2000;
                        signeEnCoursGroupeBall *= -1;
                    }
                    break;
            }
        }
    }
    // le programme principale qui fait tourner le jeu
    function mainloop(time){
        // Measure time
        measureFPS(time);
        now = new Date().getTime();
        // How long between the current frame and the previous one?
        delta = now - then;
        //console.log(delta);
        // Compute the displacement in x (in pixels) in function of the time elapsed and
        // in function of the wanted speed
        incX = calcDistanceToMove(delta, speedX);
        incY = calcDistanceToMove(delta, speedY);

        context.clearRect(0, 0, widthCanvas, heightCanvas);

        if(etatDuJeuEnCours == etatsDuJeu.jeuEnCours){
            // affichage de score
            context.textAlign="start";
            context.font="20px Comic Sans MS";
            context.fillText("SCORE : "+score, 5, 25);
            // affichage level
            context.fillText("LEVEL "+niveau.niveau, 250, 25);
        }
        

        // affichage du combo
        if(nbCombo > 0){
            context.font="20px Comic Sans MS";
            context.fillText("Combo x"+nbCombo, 5, 400);
        }
        
        if(inputStates.space){
            etatDuJeuEnCours = etatsDuJeu.jeuEnCours;
        }
        if(inputStates.a) etatDuJeuEnCours = etatsDuJeu.aide;
        if(inputStates.r) etatDuJeuEnCours = etatsDuJeu.accueil;

        switch (etatDuJeuEnCours) {
            case etatsDuJeu.jeuEnCours:
                // contexte du jeu
                barre.draw(context);
                dessinerBriques();
                niveau.duree -= delta
                tempsCreationBalle -=delta;

                if(tempsCreationBalle < 0){
                    gererTypeDeBalle();
                }
                if(niveau.duree < 0){
                    switch (typeBallesEnCours){
                        case typeBalles.uneBalle: 
                            typeBallesEnCours = typeBalles.groupBalle;
                            break;
                        case typeBalles.groupBalle: 
                            typeBallesEnCours = typeBalles.uneBalle;                            
                            break;
                    }
                    incrementerNiveau();
                }
                dessinerEtDeplacerBalles();
                scorePrise = score;
                break;
            case etatsDuJeu.finDuJeu:
                gameOver();
                break;
            case etatsDuJeu.accueil:
                home();
                break;
            case etatsDuJeu.aide:
                aide();
                break;
        }
        // Store time
        then = now;
        
        requestAnimationFrame(mainloop);
    }
     // We want the rectangle to move at a speed given in pixels/second
    // (there are 60 frames in a second)
    // If we are really running at 60 frames/s, the delay between
    // frames should be 1/60
    // = 16.66 ms, so the number of pixels to move = (speed * del)/1000.
    // If the delay is twice as
    // long, the formula works: let's move the rectangle for twice as long!
    let calcDistanceToMove = function(delta, speed) {
        return (speed * delta) / 1000;
    }

    // tout ce qui concerne les objets graphiques
    // liste des couleurs des briques par ligne 
    let couleursBrique = ['#ac1313', '#ac1379','#7913ac', '#1313ac', '#1379ac', '#13ac79', '#13ac13', '#0a990a', '#097709'];

    let rayonBalle = 7;

    function creerBalle(){
        let balle = new Balle();
        balle.x = randomBetween(10, widthCanvas-10);
        let debut = 180;
        balle.y = randomBetween(debut, debut+50);
        balle.nbRebondBarre = 0;
        balle.couleur = tabCouleurBalle[balle.nbRebondBarre];
        balle.vx = randomBetween(-niveau.vitesse, niveau.vitesse);
        balle.vy = niveau.vitesse;
        balle.rayon = rayonBalle;
        balle.point = pointsBalles[balle.nbRebondBarre];
        balle.dead = false;

        balles.push(balle);
    }
    function creerGroupeBalle(cote){
        let defaultX = 20; 
        if(cote == -1) defaultX = canvas.width - 20;
        else defaultX = 20;
        let defaultY = 300; 
        for(let i = 0; i<20; i++){
            let balle = new Balle();
            balle.x = defaultX;
            balle.y = defaultY - ((i+2)*i/4);
            balle.nbRebondBarre = 0;
            balle.couleur = tabCouleurBalle[balle.nbRebondBarre];
            balle.vx = cote * i * 0.08;
            balle.vy = niveau.vitesse/3;
            balle.point = pointsBalles[balle.nbRebondBarre];
            balle.rayon = rayonBalle;
            balle.dead = false;
            balles.push(balle);    
        }
    }
    function creerBriques(nbLigne, nbColonne){
        // let nbBriques = nbLigne * nbColonne;
        let espacement = 5;
        let wb = (canvas.width/nbColonne) - espacement*1.3;
        let hb = 15;
        let currentX = 0;
        for(let i = 0; i < nbLigne; i++){ 
            for(let j = 0; j < nbColonne; j++){
                let x = (j+0.2) * (wb + espacement);
                let y = (i+2) * (hb + espacement);
                let brique = new Brique(x, y, wb, hb, couleursBrique[i], false);
                briques.push(brique);
            }
        }
        
    }
    function dessinerEtDeplacerBalles(){
        for(let indice = 0; indice<balles.length; indice++){
            if(!balles[indice].dead){
                balles[indice].draw(context);
                balles[indice].move();
                
                let collisionAuxMurs = testeCollisionBalleAvecMurs(balles[indice], widthCanvas, heightCanvas);

                // collision avec le mur en bas
                if(collisionAuxMurs == 1){
                    score += balles[indice].point;
                    // balles.splice([indice], 1);
                    balles[indice].dead = true; 
                    nbCombo += 1;
                    score += nbCombo*pointsBalles[1];
                    play(scoreSound);
                    
                    
                }
                // collision avec le mur en haut => game over
                else if(collisionAuxMurs == 2){
                    etatDuJeuEnCours = etatsDuJeu.finDuJeu;
                    break;
                }
                for(let i = 0; i < briques.length; i++){
                    testeCollisionBalleAvecBriques(balles[indice], briques[i], i, indice);
                }
                testeCollisionBalleAvecBarre(balles[indice], indice); 
            }
        }
    }


    function dessinerBriques(){

        for(let i = 0; i < briques.length; i++){
            
            briques[i].draw(context);
        }

    }
 
    function testeCollisionBalleAvecBriques(balle, brique, indexBrique, indexBalle){
        // s'il y a une collision entre la balle et la brique
        if(circRectsOverlap(brique.x, brique.y, brique.width, brique.height, balle.x, balle.y, balle.rayon) && !brique.dead && !balle.dead){
            play(plopSound);
            // on modifie la trajectoire de la balle et la vitesse de la balle
            let newSpeedXBalle =  (balle.x - brique.x);
            let newSpeedYBalle =  (balle.y - brique.y);
            balle.vx = balle.vx * (newSpeedXBalle/newSpeedXBalle);
            balle.vy = balle.vy * (- newSpeedYBalle/newSpeedYBalle);
            if(balle.nbRebondBarre == 2){
                // balles.splice(indexBalle, 1);
                balles[indexBalle].dead = true;
            }
            // briques.splice(indexBrique, 1);
            briques[indexBrique].dead = true;
            // à chaque fois que la balle entre en collision avec une brique, le score diminue en fonction du nb de rebond de la balle et son point
            score -= balles[indexBalle].point * balles[indexBalle].nbRebondBarre;

            
        }

    }
    
    
    function testeCollisionBalleAvecMurs(balle, width, height) {
        if(((balle.x + balle.rayon) > width) || ((balle.x - balle.rayon) < 0)) {
            // on a touché un bord vertical
            // on inverse la vitesse en x
            balle.vx = -balle.vx;
            return 0;
        }
        // test avec le mur horizontal en bas
        if((balle.y + balle.rayon) > height) {
            // on a touché un bord horizontal en bas
            // on enlève la balle dans le tableau
            balle.vy = -balle.vy;
            return 1; 
        }

        // test avec le mur en haut seulement
        // si la balle touche le mur en haut => c'est game over
        if(((balle.y + balle.rayon) < 0)) {
            balle.vy = -balle.vy;
            return 2;
        }
        
    }


    function testeCollisionBalleAvecBarre(balle){
        if(balle.y+balle.rayon >= barre.y && balle.y+balle.rayon <= barre.y + barre.height){
            if(!((barre.xMiniBarre<(balle.rayon+balle.x))&&((barre.xMiniBarre+barre.widthMiniBarre)>(balle.x+balle.rayon)))
            && !balle.dead) {
                balle.vy = -balle.vy;
                balle.nbRebondBarre +=1;
                if(balle.nbRebondBarre > 2) balle.nbRebondBarre= 2 ;
                balle.point = pointsBalles[balle.nbRebondBarre];
                balle.couleur = tabCouleurBalle[balle.nbRebondBarre];
                nbCombo = 0;
            }
        }
    }

    return{
        start : start,
        inputStates : inputStates,
        initEtatInitialDuJeu : initEtatInitialDuJeu,
        canvas : canvas
    }
}
