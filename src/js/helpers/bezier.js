export default function cubicBezier ( x,  a,  b,  c,  d, finalX, finalY){

  let y0a = 0.00; // initial y
  let x0a = 0.00; // initial x 
  let y1a = b;    // 1st influence y   
  let x1a = a;    // 1st influence x 
  let y2a = d;    // 2nd influence y
  let x2a = c;    // 2nd influence x
  let y3a = finalX; //1.00; // final y 
  let x3a = finalY; //1.00; // final x 

  let A =   x3a - 3*x2a + 3*x1a - x0a;
  let B = 3*x2a - 6*x1a + 3*x0a;
  let C = 3*x1a - 3*x0a;   
  let D =   x0a;

  let E =   y3a - 3*y2a + 3*y1a - y0a;    
  let F = 3*y2a - 6*y1a + 3*y0a;             
  let G = 3*y1a - 3*y0a;             
  let H =   y0a;

  // Solve for t given x (using Newton-Raphelson), then solve for y given t.
  // Assume for the first guess that t = x.
  let currentt = x;
  let nRefinementIterations = 5;
  for (let i=0; i < nRefinementIterations; i++){
    let currentx = xFromT (currentt, A,B,C,D); 
    let currentslope = slopeFromT (currentt, A,B,C);
    currentt -= (currentx - x)*(currentslope);
    currentt = constrain(currentt, 0,1);
  } 

  let y = yFromT (currentt,  E,F,G,H);
  return y;
}

// Helper functions:
 function slopeFromT ( t,  A,  B,  C){
  return 1.0/(3.0*A*t*t + 2.0*B*t + C); 
}

function xFromT ( t,  A,  B,  C,  D){
  return A*(t*t*t) + B*(t*t) + C*t + D;
}

function yFromT ( t,  E,  F,  G,  H){
  return E*(t*t*t) + F*(t*t) + G*t + H;
}

function constrain(v, min, max){
  return (Math.min(max, Math.max(min, v)));
}