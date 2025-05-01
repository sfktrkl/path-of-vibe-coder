class ParticleSystem {
  constructor() {
    // Create container for the particle background
    this.container = document.createElement("div");
    this.container.style.position = "absolute";
    this.container.style.top = "0";
    this.container.style.left = "0";
    this.container.style.width = "100%";
    this.container.style.height = "100%";
    this.container.style.pointerEvents = "none";
    this.container.style.zIndex = "0";
    this.container.style.background = "transparent";
    this.container.style.overflow = "hidden";

    // Create canvas
    this.canvas = document.createElement("canvas");
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.mixBlendMode = "screen";
    this.canvas.style.opacity = "0.9";

    this.container.appendChild(this.canvas);
    this.context = this.canvas.getContext("2d");
    this.particles = [];
    this.animationFrame = null;
    this.isAnimating = false;

    this.settings = {
      density: 20,
      particleSize: 3,
      gravity: 0.1,
      maxLife: 200,
      baseWidth: 1920,
      baseHeight: 1080,
      spawnRate: 0.3,
    };

    // Initialize scale with a default value
    this.scale = 1;
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    const container = document.querySelector(".particle-background");
    if (container) {
      // Set canvas size to match container
      this.canvas.width = container.clientWidth;
      this.canvas.height = container.clientHeight;

      // Calculate scale factor based on base dimensions
      const scaleX = this.canvas.width / this.settings.baseWidth;
      const scaleY = this.canvas.height / this.settings.baseHeight;
      this.scale = Math.min(scaleX, scaleY);
    }
  }

  createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: 0,
      vx: (Math.random() * 2) / 3 - (Math.random() * 3) / 3,
      vy: 0,
      life: 0,
      alpha: 1,
      red: 0,
      green: 255,
      blue: 157,
    };
  }

  updateParticle(particle) {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += this.settings.gravity;
    particle.life++;
    particle.red += 2;
    particle.alpha -= 0.005;

    return (
      particle.life >= this.settings.maxLife || particle.y > this.canvas.height
    );
  }

  drawParticle(particle) {
    this.context.beginPath();
    this.context.fillStyle = `rgba(${particle.red}, ${particle.green}, ${particle.blue}, ${particle.alpha})`;
    this.context.arc(
      particle.x,
      particle.y,
      this.settings.particleSize * this.scale,
      0,
      Math.PI * 2,
      true
    );
    this.context.closePath();
    this.context.fill();
  }

  animate() {
    if (!this.isAnimating) return;

    // Clear canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Create new particles with reduced frequency
    if (Math.random() > this.settings.spawnRate) {
      this.particles.push(this.createParticle());
    }

    // Update and draw particles
    this.particles = this.particles.filter((particle) => {
      const shouldRemove = this.updateParticle(particle);
      if (!shouldRemove) {
        this.drawParticle(particle);
      }
      return !shouldRemove;
    });

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  start() {
    if (this.isAnimating) return;

    const container = document.querySelector(".particle-background");
    if (container) {
      container.appendChild(this.container);
      this.resize();
      this.isAnimating = true;
      this.animate();
    }
  }

  stop() {
    this.isAnimating = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    if (this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.particles = [];
  }
}

export default ParticleSystem;
