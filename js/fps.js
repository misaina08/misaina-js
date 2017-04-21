// vars for counting frames/s, used by the measureFPS function
let frameCount = 0;
let lastTime;
let fps;

let fpsContainer;

function initFPS() {
  // Pour le nombre d'images / s
  fpsContainer = document.querySelector('#fpsContainer');
}

let measureFPS = function(newTime){
   // test for the very first invocation
   if(lastTime === undefined) {
     lastTime = newTime;
     return;
   }
   // calculate the delta between last & current frame
   var diffTime = newTime - lastTime;
   if (diffTime >= 1000) {
     fps = frameCount;
     frameCount = 0;
     lastTime = newTime;
   }
   // and display it in an element we appended to the
   // document in the start() function
   fpsContainer.innerHTML = 'FPS: ' + fps;
   frameCount++;
};
