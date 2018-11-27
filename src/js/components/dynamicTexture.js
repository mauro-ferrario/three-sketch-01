export default class{
  constructor(width, height, newTrailColor){
    this.setTrailColor(newTrailColor);
    this.createCanvas(width, height);
  }

  createCanvas(width, height){
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.context = this.canvas.getContext("2d");
  }

  update(x,y){
    this.context.fillStyle = "rgba(255,255,255,0.1)";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawCircle(this.canvas.width * (x + 0.5), this.canvas.height * (y + 0.5));
  }

  setTrailColor(newTrailColor){
    this.trailColor = newTrailColor;
  }

  drawCircle(x = 0, y = 0, radius = 10){
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, 2 * Math.PI, false);
    this.context.fillStyle = this.trailColor;
    this.context.fill();
  }
}