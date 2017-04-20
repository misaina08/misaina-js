// Collisions entre balle et brique
function circRectsOverlap(x0, y0, w0, h0, cx, cy, r) {
   let testX=cx;
   let testY=cy;
   if (testX < x0) testX=x0;
   if (testX > (x0+w0)) testX=(x0+w0);
   if (testY < y0) testY=y0;
   if (testY > (y0+h0)) testY=(y0+h0);
   return (((cx-testX)*(cx-testX)+(cy-testY)*(cy-testY))< r*r);
}
