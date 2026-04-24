document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Navbar Scroll Effect & Progress Bar
    const navbar = document.querySelector('.navbar');
    const progressBar = document.querySelector('.scroll-progress');

    window.addEventListener('scroll', () => {
        // Navbar background
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll Progress
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) {
            progressBar.style.width = scrolled + "%";
        }
    });

    // 2. Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileBtn.classList.toggle('active');
        });
    }

    // 3. Scroll Animations (Intersection Observer)
    const fadeElements = document.querySelectorAll('.fade-up');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    if (fadeElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        fadeElements.forEach(el => observer.observe(el));
    }

    // 4. Before/After Gallery Slider
    const slider = document.getElementById('compare-slider');
    const beforeImg = document.querySelector('.img-before-wrapper');
    const sliderLine = document.querySelector('.slider-line');
    const sliderButton = document.querySelector('.slider-button');
    
    if (slider && beforeImg && sliderLine && sliderButton) {
        slider.addEventListener('input', (e) => {
            const sliderValue = e.target.value;
            beforeImg.style.width = `${sliderValue}%`;
            sliderLine.style.left = `${sliderValue}%`;
            sliderButton.style.left = `${sliderValue}%`;
        });
    }

    // 5. Form Submission Handling
    const form = document.getElementById('booking-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.textContent;
            
            btn.textContent = 'Sending...';
            btn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                btn.textContent = 'Request Sent Successfully!';
                btn.style.backgroundColor = '#25D366';
                btn.style.color = 'white';
                form.reset();
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // 6. Mouse Parallax Effect
    document.addEventListener('mousemove', (e) => {
        const blobs = document.querySelectorAll('.parallax-blob');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        blobs.forEach((blob, index) => {
            const speed = (index + 1) * 30; // Different speeds for depth
            const xOffset = (x - 0.5) * speed;
            const yOffset = (y - 0.5) * speed;
            blob.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
        
        // Subtle parallax for hero text
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            const xOffsetContent = (x - 0.5) * 15;
            const yOffsetContent = (y - 0.5) * 15;
            heroContent.style.transform = `translate(${xOffsetContent}px, ${yOffsetContent}px)`;
        }
    });

    // 7. Background Canvas Particle Effect (Sharp Wave/Particles)
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null };
        
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 40) + 5;
                this.angle = Math.random() * Math.PI * 2;
                this.velocity = Math.random() * 0.02 + 0.01;
            }

            draw() {
                ctx.fillStyle = 'rgba(212, 175, 55, 0.6)'; // Increased base opacity
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }

            update() {
                // Wave movement
                this.angle += this.velocity;
                let waveY = Math.sin(this.angle) * 20; // Increased wave height
                
                // Mouse interaction
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let maxDistance = 250; // Increased interaction range
                
                if (distance < maxDistance) {
                    let force = (maxDistance - distance) / maxDistance;
                    let directionX = (dx / distance) * force * this.density;
                    let directionY = (dy / distance) * force * this.density;
                    
                    this.x -= directionX;
                    this.y -= directionY;
                    ctx.fillStyle = 'rgba(212, 175, 55, 1)'; // Fully opaque gold on interaction
                } else {
                    if (this.x !== this.baseX) {
                        let dx = this.x - this.baseX;
                        this.x -= dx / 20;
                    }
                    this.y = this.baseY + waveY;
                }
            }
        }

        const init = () => {
            particles = [];
            const numberOfParticles = (canvas.width * canvas.height) / 5000; // Increased density
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        };
        init();

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            requestAnimationFrame(animate);
        };
        animate();
    }

    // 8. Brand Tiles Magnetic Move Effect (Buttery Smooth)
    const tiles = document.querySelectorAll('.brand-tile');
    tiles.forEach(tile => {
        tile.addEventListener('mousemove', (e) => {
            const rect = tile.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate distance from center
            const moveX = (x - centerX) / 8; 
            const moveY = (y - centerY) / 8;
            
            // Apply transformation with a very smooth transition
            tile.style.transition = 'transform 0.3s cubic-bezier(0.1, 0.8, 0.2, 1), box-shadow 0.3s ease';
            tile.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(1.05)`;
            tile.style.boxShadow = `${-moveX/2}px ${-moveY/2}px 30px rgba(212, 175, 55, 0.15)`;
            tile.style.zIndex = '10';
        });
        
        tile.addEventListener('mouseleave', () => {
            tile.style.transition = 'transform 0.6s cubic-bezier(0.1, 0.8, 0.2, 1), box-shadow 0.6s ease';
            tile.style.transform = 'translate3d(0, 0, 0) scale(1)';
            tile.style.boxShadow = '';
            tile.style.zIndex = '1';
        });
    });
});
