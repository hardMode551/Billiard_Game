import React, { useRef, useEffect, useState } from 'react';
import Ball from './Ball';

import '../styles/BilliardCanvas.css';

const BilliardCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [selectedBall, setSelectedBall] = useState<Ball | null>(null);
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [isBallMoving, setIsBallMoving] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newBalls = Array.from({ length: 7 }, () => {
      const x = Math.random() * (canvas.width - 100) + 50;
      const y = Math.random() * (canvas.height - 100) + 50;
      const radius = Math.random() * 50 + 15;
      const color = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
      return new Ball(x, y, radius, color);
    });

    setBalls(newBalls);

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      newBalls.forEach((ball) => {
        ball.update(newBalls, canvas.width, canvas.height);
        ball.draw(ctx);
      });
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleMouseDown: React.MouseEventHandler<HTMLCanvasElement> = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const clickedBall = balls.find(ball => ball.isClicked(mouseX, mouseY));
    if (clickedBall) {
      setSelectedBall(clickedBall);
      setMousePosition({ x: mouseX, y: mouseY });
      setIsColorMenuOpen(true); // Открываем меню выбора цвета при клике на шар
    } else {
      setIsColorMenuOpen(false); // Закрываем меню выбора цвета при клике вне шара
    }
  };

  const handleMouseMove: React.MouseEventHandler<HTMLCanvasElement> = (event) => {
    if (!selectedBall) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
  
    const forceX = (mouseX - selectedBall.x) * 0.1;
    const forceY = (mouseY - selectedBall.y) * 0.1;
  
    // Применяем коэффициент трения к скорости
    selectedBall.applyForce(forceX * selectedBall.friction, forceY * selectedBall.friction);
  
    setMousePosition({ x: mouseX, y: mouseY });
    setIsBallMoving(true); // Устанавливаем состояние "шар движется" в true
  };

  const handleMouseUp: React.MouseEventHandler<HTMLCanvasElement> = () => {
    setSelectedBall(null);
    setMousePosition(null);
    setIsBallMoving(false); // Сбрасываем состояние "шар движется" в false при отпускании мыши
  };

  const handleColorChange = (color: string) => {
    if (selectedBall) {
      selectedBall.color = color;
    }
  };

  return (
    <div className="billiard-canvas">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      {isColorMenuOpen && selectedBall && mousePosition && !isBallMoving && (
        <div className="ball-menu" style={{ top: mousePosition.y, left: mousePosition.x }}>
          <h2>Меню выбора цвета</h2>
          <p>Поменять цвет:</p>
          <input
            type="color"
            value={selectedBall.color}
            onChange={(e) => handleColorChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default BilliardCanvas;
