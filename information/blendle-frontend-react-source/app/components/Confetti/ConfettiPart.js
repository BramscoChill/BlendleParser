class ConfettiPart {
  constructor(view) {
    this.COLORS = [[235, 119, 136], [253, 208, 117], [215, 150, 171]];
    this.PI_2 = 2 * Math.PI;

    this.view = view;
    this.style = this.COLORS[~~this.range(0, 3)];
    this.rgb = `rgba(${this.style[0]}, ${this.style[1]}, ${this.style[2]}`;
    this.r = ~~this.range(2, 5);
    this.r2 = 2 * this.r;
    this.replace();
  }

  range(min, max) {
    return Math.random() * (max - min) + min;
  }

  replace() {
    this.opacity = 0;
    this.dop = 0.01 * this.range(1, 4);
    this.x = this.range(0, this.view.canvasW - this.r2);
    this.y = this.range(-40, this.view.canvasH);
    this.xmax = this.view.canvasW - this.r;
    this.ymax = this.view.canvasH - this.r;
    this.vx = this.range(0, 1);
    this.vy = 0.4 * this.r;
  }

  draw(context) {
    this.x += this.vx;
    this.y += this.vy;
    this.opacity += this.dop;

    if (this.opacity > 1) {
      this.opacity = 1;
      this.dop *= -1;
    }

    if (this.opacity < 0 || this.y > this.ymax) {
      this.replace();
    }

    if (!(this.x < 0 && this.x < this.xmax)) {
      this.x = (this.x + this.xmax) % this.xmax;
    }

    context.beginPath();
    context.arc(this.x, this.y, this.r, 0, this.PI_2, false);
    context.fillStyle = `${this.rgb}, ${this.opacity})`;
    context.fill();
  }
}

export default ConfettiPart;



// WEBPACK FOOTER //
// ./src/js/app/components/Confetti/ConfettiPart.js