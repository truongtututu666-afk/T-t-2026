import React, { useRef, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FireworksStudio: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // --- Physics Constants ---
    const FRICTION = 0.95; // Air resistance
    const GRAVITY = 0.04;
    const PARTICLE_COUNT = 80;
    const TRAIL_LENGTH = 0.15; // Lower is longer trails (opacity of clear rect)

    // --- State ---
    let fireworks: Firework[] = [];
    let particles: Particle[] = [];
    let autoLaunchTimer = 0;

    // --- Utility ---
    const random = (min: number, max: number) => Math.random() * (max - min) + min;
    
    // --- Classes ---

    class Firework {
        x: number;
        y: number;
        sx: number;
        sy: number;
        tx: number;
        ty: number;
        distanceToTarget: number;
        distanceTraveled: number;
        coordinates: [number, number][];
        angle: number;
        speed: number;
        acceleration: number;
        brightness: number;
        targetRadius: number;
        hue: number;

        constructor(sx: number, sy: number, tx: number, ty: number) {
            this.x = sx;
            this.y = sy;
            this.sx = sx;
            this.sy = sy;
            this.tx = tx;
            this.ty = ty;
            this.distanceToTarget = Math.sqrt(Math.pow(tx - sx, 2) + Math.pow(ty - sy, 2));
            this.distanceTraveled = 0;
            // Track past coordinates for trail effect
            this.coordinates = [];
            this.coordinateCount = 3;
            while(this.coordinateCount--) {
                this.coordinates.push([this.x, this.y]);
            }
            this.angle = Math.atan2(ty - sy, tx - sx);
            this.speed = 2;
            this.acceleration = 1.05;
            this.brightness = random(50, 70);
            this.targetRadius = 1;
            this.hue = random(0, 360);
        }

        update(index: number) {
            this.coordinates.pop();
            this.coordinates.unshift([this.x, this.y]);

            if(this.targetRadius < 8) this.targetRadius += 0.3;
            else this.targetRadius = 1;

            this.speed *= this.acceleration;
            const vx = Math.cos(this.angle) * this.speed;
            const vy = Math.sin(this.angle) * this.speed;
            this.distanceTraveled = Math.sqrt(Math.pow(this.sx - this.x, 2) + Math.pow(this.sy - this.y, 2));

            if(this.distanceTraveled >= this.distanceToTarget) {
                createParticles(this.tx, this.ty, this.hue);
                fireworks.splice(index, 1);
            } else {
                this.x += vx;
                this.y += vy;
            }
        }

        draw() {
            if (!ctx) return;
            ctx.beginPath();
            ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
            ctx.lineTo(this.x, this.y);
            ctx.strokeStyle = `hsl(${this.hue}, 100%, ${this.brightness}%)`;
            ctx.stroke();
        }
        
        // For TS
        coordinateCount: number;
    }

    class Particle {
        x: number;
        y: number;
        coordinates: [number, number][];
        angle: number;
        speed: number;
        friction: number;
        gravity: number;
        hue: number;
        brightness: number;
        alpha: number;
        decay: number;

        constructor(x: number, y: number, hue: number) {
            this.x = x;
            this.y = y;
            this.coordinates = [];
            this.coordinateCount = 5;
            while(this.coordinateCount--) {
                this.coordinates.push([this.x, this.y]);
            }
            this.angle = random(0, Math.PI * 2);
            this.speed = random(1, 10);
            this.friction = FRICTION;
            this.gravity = GRAVITY;
            this.hue = random(hue - 20, hue + 20);
            this.brightness = random(50, 80);
            this.alpha = 1;
            this.decay = random(0.015, 0.03);
        }

        update(index: number) {
            this.coordinates.pop();
            this.coordinates.unshift([this.x, this.y]);
            this.speed *= this.friction;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed + this.gravity;
            this.alpha -= this.decay;

            if(this.alpha <= this.decay) {
                particles.splice(index, 1);
            }
        }

        draw() {
            if (!ctx) return;
            ctx.beginPath();
            ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
            ctx.lineTo(this.x, this.y);
            ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
            ctx.stroke();
        }

        coordinateCount: number;
    }

    const createParticles = (x: number, y: number, hue: number) => {
        let count = PARTICLE_COUNT;
        while(count--) {
            particles.push(new Particle(x, y, hue));
        }
    }

    // --- Main Loop ---
    const loop = () => {
        requestAnimationFrame(loop);

        // Creates trail effect by drawing semi-transparent black over previous frame
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = `rgba(0, 0, 0, ${TRAIL_LENGTH})`; 
        ctx.fillRect(0, 0, width, height);

        // Additive blending makes overlapping lights brighter
        ctx.globalCompositeOperation = 'lighter';

        // Auto launch logic
        autoLaunchTimer++;
        if(autoLaunchTimer > 40) { // Every ~40 frames
            if(random(0, 1) > 0.3) {
                fireworks.push(new Firework(
                    width / 2 + random(-200, 200), 
                    height, 
                    random(0, width), 
                    random(0, height / 2)
                ));
            }
            autoLaunchTimer = 0;
        }

        let i = fireworks.length;
        while(i--) {
            fireworks[i].draw();
            fireworks[i].update(i);
        }

        let k = particles.length;
        while(k--) {
            particles[k].draw();
            particles[k].update(k);
        }
    }

    const handleClick = (e: MouseEvent) => {
        // Launch from bottom center to mouse position
        fireworks.push(new Firework(width / 2, height, e.clientX, e.clientY));
    };
    
    const handleResize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    canvas.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);
    loop();

    return () => {
        canvas.removeEventListener('click', handleClick);
        window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative h-full bg-black overflow-hidden">
         {/* UI Overlay */}
         <div className="absolute top-0 w-full p-6 flex items-center justify-between z-50 pointer-events-none mt-12 md:mt-0">
            <button onClick={() => navigate(-1)} className="p-2 bg-white/10 rounded-full text-white pointer-events-auto hover:bg-white/20 backdrop-blur-md">
                <ChevronLeft size={24} />
            </button>
            <div className="text-center">
                <h2 className="text-white font-bold font-serif text-xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">Pháo Hoa Nghệ Thuật</h2>
                <p className="text-xs text-gray-400">Chạm màn hình để bắn pháo hoa</p>
            </div>
            <div className="w-10"></div>
        </div>
        
        {/* Landmarks Silhouette */}
        <div 
            className="absolute bottom-0 w-full h-48 bg-contain bg-repeat-x opacity-80 pointer-events-none z-10" 
            style={{ 
                backgroundImage: "url('https://cdn-icons-png.flaticon.com/512/96/96356.png')", 
                filter: "brightness(0)",
                backgroundPosition: "bottom"
            }}
        ></div>
        
        {/* Glow Layer */}
        <div className="absolute inset-0 bg-gradient-to-t from-tet-red/10 via-transparent to-transparent pointer-events-none"></div>

        <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair active:cursor-crosshair"></canvas>
    </div>
  );
};

export default FireworksStudio;