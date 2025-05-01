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
    this.particles = {};
    this.particleIndex = 0;

    this.settings = {
      density: 50,
      particleSize: 3,
      gravity: 0.1,
      maxLife: 200,
      baseWidth: 1920,
      baseHeight: 1080,
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
      this.scale = Math.min(scaleX, scaleY); // Use the smaller scale to maintain proportions
    }
  }

  createParticle() {
    const particle = {
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

    this.particleIndex++;
    this.particles[this.particleIndex] = particle;
    particle.id = this.particleIndex;
  }

  updateParticle(particle) {
    if (!particle) return false;

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
    if (!particle) return;

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
    // Clear canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Create new particles
    for (let i = 0; i < this.settings.density; i++) {
      if (Math.random() > 0.97) {
        this.createParticle();
      }
    }

    // Update and draw particles
    for (const id in this.particles) {
      const shouldRemove = this.updateParticle(this.particles[id]);
      if (shouldRemove) {
        delete this.particles[id];
      } else {
        this.drawParticle(this.particles[id]);
      }
    }

    requestAnimationFrame(() => this.animate());
  }

  start() {
    const container = document.querySelector(".particle-background");
    if (container) {
      container.appendChild(this.container);
      // Force a resize to ensure proper scaling
      this.resize();
      // Wait for next frame to ensure container is properly sized
      requestAnimationFrame(() => {
        this.animate();
      });
    }
  }

  stop() {
    if (this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}

export default ParticleSystem;
