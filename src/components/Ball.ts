class Ball {
  x: number;
  y: number;
  radius: number;
  color: string;
  dx: number;
  dy: number;
  readonly friction: number = 0.98;

  constructor(x: number, y: number, radius: number, color: string) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.dx = 0; 
    this.dy = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  readonly maxSpeed: number = 20;

  update(balls: Ball[], canvasWidth: number, canvasHeight: number) {
    this.dx *= this.friction;
    this.dy *= this.friction;
    this.x += this.dx;
    this.y += this.dy;

    // Проверяем скорость по x
    if (this.dx > this.maxSpeed) {
      this.dx = this.maxSpeed;
    } else if (this.dx < -this.maxSpeed) {
      this.dx = -this.maxSpeed;
    }

    // Проверяем скорость по y
    if (this.dy > this.maxSpeed) {
      this.dy = this.maxSpeed;
    } else if (this.dy < -this.maxSpeed) {
      this.dy = -this.maxSpeed;
    }

    if (this.x + this.radius >= canvasWidth || this.x - this.radius <= 0) {
      this.dx = -this.dx * this.friction;
    }
    if (this.y + this.radius >= canvasHeight || this.y - this.radius <= 0) {
      this.dy = -this.dy * this.friction;
    }

    for (const ball of balls) {
      if (ball === this) continue;
      const dx = this.x - ball.x;
      const dy = this.y - ball.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < this.radius + ball.radius) {
        const angle = Math.atan2(dy, dx);
        const sine = Math.sin(angle);
        const cosine = Math.cos(angle);
        const vx1 = this.dx * cosine + this.dy * sine;
        const vy1 = this.dy * cosine - this.dx * sine;
        const vx2 = ball.dx * cosine + ball.dy * sine;
        const vy2 = ball.dy * cosine - ball.dx * sine;
        const vx1Final = ((this.radius - ball.radius) * vx1 + (ball.radius + ball.radius) * vx2) / (this.radius + ball.radius);
        const vx2Final = ((this.radius + this.radius) * vx1 + (ball.radius - this.radius) * vx2) / (this.radius + ball.radius);
        this.dx = vx1Final * cosine - vy1 * sine;
        this.dy = vy1 * cosine + vx1Final * sine;
        ball.dx = vx2Final * cosine - vy2 * sine;
        ball.dy = vy2 * cosine + vx2Final * sine;
        const overlap = this.radius + ball.radius - distance;
        const pushX = (dx / distance) * overlap * 0.5;
        const pushY = (dy / distance) * overlap * 0.5;
        this.x += pushX;
        this.y += pushY;
        ball.x -= pushX;
        ball.y -= pushY;
      }
    }
  }

  applyForce(forceX: number, forceY: number) {
    this.dx += forceX;
    this.dy += forceY;
  }

  isClicked(mouseX: number, mouseY: number) {
    const distance = Math.sqrt((mouseX - this.x) ** 2 + (mouseY - this.y) ** 2);
    return distance <= this.radius;
  }
}

export default Ball;