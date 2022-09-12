class Button {
  constructor(text, x, y, w, h, rounding, color, stroke) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.rounding = rounding;
    this.color = color;
    this.stroke = stroke;
  }

  draw() {
    push()
    stroke(this.stroke);
    fill(this.color);
    rect(this.x, this.y, this.w, this.h, this.rounding);

    fill(this.stroke);
    textAlign(CENTER, CENTER);
    textSize(13);
    text(this.text, this.x + this.w/2, this.y + this.h/2);
    pop();
  }

  checkHover() {
    return (
      this.x <= mouseX && mouseX <= this.x + this.w
      && this.y <= mouseY && mouseY <= this.y + this.h
    )
  }

  
}