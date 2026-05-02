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
                    // Add a tiny delay to allow the CSS to pick up the change
                    setTimeout(() => {
                        entry.target.style.transform = 'perspective(1000px) rotateX(0) translateY(0)';
                        entry.target.style.opacity = '1';
                    }, 50);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        fadeElements.forEach(el => {
            el.style.transform = 'perspective(1000px) rotateX(-15deg) translateY(30px)';
            el.style.opacity = '0';
            el.style.transition = 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.8s ease-out';
            observer.observe(el);
        });
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
            const zOffset = index * 20; // Simulated depth
            blob.style.transform = `translate3d(${xOffset}px, ${yOffset}px, ${zOffset}px)`;
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
                this.density = (Math.random() * 30) + 2; // Slightly reduced density force
                this.angle = Math.random() * Math.PI * 2;
                this.velocity = Math.random() * 0.008 + 0.004; // Slower wave velocity
            }

            draw() {
                ctx.fillStyle = 'rgba(212, 175, 55, 0.6)'; // Increased base opacity
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }

            update() {
                // Smooth gliding wave movement
                this.angle += this.velocity;
                let waveY = Math.sin(this.angle) * 12; // Reduced wave height for subtler glide
                
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
                        this.x -= dx / 50; // Much smoother/slower return to base
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

    // 9. Generic 3D Tilt Effect for Cards & Hero Elements (Anti-Glitch Version)
    const tiltElements = document.querySelectorAll('.service-card, .feature-card, .founder-card, .hero-content, .hero-stats:not(.no-tilt), .glass-card:not(.no-tilt)');
    
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            let divisor = 15;
            if (el.classList.contains('hero-content')) divisor = 40;
            if (el.classList.contains('blog-card')) divisor = 45; // Significantly lower tilt for blogs for better readability
            
            
            const rotateX = (centerY - y) / divisor;
            const rotateY = (x - centerX) / divisor;
            
            // Use a very fast transition to smooth out the jitter at the edges
            el.style.transition = 'transform 0.1s ease-out, box-shadow 0.2s ease';
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${el.classList.contains('hero-content') ? '' : 'scale(1.02)'}`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s ease';
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
    // 10. Huly-style Magnetic Shuttle Animation
    const shuttleBtns = document.querySelectorAll('.btn-shuttle');
    
    shuttleBtns.forEach(btn => {
        const glow = btn.querySelector('.shuttle-glow');
        
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Move the glow shuttle to track the mouse
            glow.style.transform = `translate(${x - 50}px, ${y - 50}px)`;
            glow.style.opacity = '1';
        });
        
        btn.addEventListener('mouseleave', () => {
            glow.style.opacity = '0';
        });
    });

    // 0. Notification System
    const notifyContainer = document.createElement('div');
    notifyContainer.className = 'notification-container';
    document.body.appendChild(notifyContainer);

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        const icon = type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-info';
        notification.innerHTML = `
            <i class="fa-solid ${icon}"></i>
            <span>${message}</span>
        `;
        notifyContainer.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 600);
        }, 3500);
    }

    // 11. Model Selection & Booking Pre-fill
    const modelItems = document.querySelectorAll('.model-item');
    let selectedModel = '';

    modelItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all
            modelItems.forEach(i => i.classList.remove('active-model'));
            // Add to clicked
            item.classList.add('active-model');
            selectedModel = item.getAttribute('data-model');
            
            // Update status text if it exists
            const statusText = document.querySelector('.status-text');
            if (statusText) {
                statusText.textContent = `Selected: ${selectedModel} - Ready to book`;
                statusText.style.color = 'var(--accent)';
            }
            
            showNotification(`Great choice! ${selectedModel} selected.`, 'success');
        });
    });

    // 11.5 Main Brand CTA - Scroll to Plans
    const mainBrandCTA = document.querySelector('.contact-wrapper .btn-primary:not(.pricing-card .btn)');
    if (mainBrandCTA) {
        mainBrandCTA.addEventListener('click', (e) => {
            e.preventDefault();
            const plansSection = document.querySelector('section.bg-dark');
            if (plansSection) {
                plansSection.scrollIntoView({ behavior: 'smooth' });
                showNotification("Please select a service plan to continue", "info");
                
                // Visual highlight for plans
                plansSection.style.transition = 'background 0.5s';
                plansSection.style.background = 'rgba(212, 175, 55, 0.05)';
                setTimeout(() => plansSection.style.background = '', 1500);
            }
        });
    }

    const bookBtns = document.querySelectorAll('.pricing-card .btn, .pricing-footer .btn');
    bookBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (!selectedModel) {
                showNotification("Please select your car model first!", "warning");
                const explorer = document.querySelector('.models-explorer');
                if (explorer) {
                    explorer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    explorer.classList.add('shake-element');
                    setTimeout(() => explorer.classList.remove('shake-element'), 500);
                }
                return;
            }
            
            // Find the service name
            const card = btn.closest('.pricing-card');
            const serviceName = card.querySelector('.pricing-header h3').textContent.trim();
            
            // Build URL
            let url = new URL(btn.href, window.location.origin);
            url.searchParams.set('service', serviceName);
            
            // Get brand from the page title
            let brandName = '';
            const titleMatch = document.title.match(/^(.*?)\s+Service/);
            if (titleMatch) {
                brandName = titleMatch[1].trim();
            }
            
            if (selectedModel) {
                url.searchParams.set('car', `${brandName} ${selectedModel}`.trim());
            }
            
            window.location.href = url.toString();
        });
    });

    // 12. Auto-fill Contact Form from URL Params
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    const carParam = urlParams.get('car');

    if (serviceParam) {
        const serviceSelect = document.getElementById('service-select');
        if (serviceSelect) {
            for (let i = 0; i < serviceSelect.options.length; i++) {
                if (serviceSelect.options[i].value.toLowerCase() === serviceParam.toLowerCase()) {
                    serviceSelect.selectedIndex = i;
                    break;
                }
            }
        }
    }

    // 14. Cascading Car Brand & Model Selection (Synchronized with Brand Pages)
    const brandModels = {
        "Aston Martin": ["DB9", "Rapide", "Vantage"],
        "Audi": ["A3", "A4", "A6", "A8", "Q3", "Q5", "Q7", "RS Series", "TT"],
        "Bentley": ["Bentayga", "Continental GT", "Flying Spur", "Mulsanne"],
        "BMW": ["3 Series", "5 Series", "7 Series", "X1", "X3", "X5", "X6", "Z4", "M Series"],
        "Chevrolet": ["Cruze", "Captiva", "Trailblazer", "Beat"],
        "Datsun": ["GO", "GO+", "Redi-GO"],
        "Ferrari": ["458 Italia", "458 Spider", "488 GTB", "812 Superfast", "California", "F12 Berlinetta", "GTC4Lusso", "Portofino"],
        "Fiat": ["Linea", "Punto", "Abarth", "Avventura"],
        "Ford": ["EcoSport", "Endeavour", "Mustang", "Figo", "Aspire"],
        "Honda": ["City", "Civic", "CR-V", "Amaze", "Accord"],
        "Hyundai": ["Creta", "Elantra", "Santa Fe", "Tucson", "Verna"],
        "Jaguar": ["F-Pace", "F-Type", "XE", "XF", "XJ"],
        "Lamborghini": ["Aventador", "Gallardo", "Huracan"],
        "Land Rover": ["Discovery", "Discovery Sport", "Range Rover", "Range Rover Evoque", "Range Rover Sport", "Range Rover Velar", "Defender"],
        "Lexus": ["ES", "LS", "LX", "NX", "RX"],
        "Mahindra": ["Scorpio", "XUV500", "XUV700", "Thar", "Bolero"],
        "Maruti Suzuki": ["Baleno", "Brezza", "Ciaz", "Ertiga", "Swift", "Dzire"],
        "Maserati": ["Ghibli", "GranCabrio", "GranTurismo", "Levante", "Quattroporte"],
        "Mercedes-Benz": ["A-Class", "B-Class", "C-Class", "E-Class", "S-Class", "CLA", "GLA", "GLC", "GLE", "GLS", "Maybach"],
        "Mini": ["Cooper", "Countryman", "Clubman"],
        "Mitsubishi": ["Pajero Sport", "Outlander", "Montero"],
        "Nissan": ["Magnite", "Kicks", "Sunny", "Terrano", "GT-R"],
        "Porsche": ["911", "Boxster", "Cayenne", "Cayman", "Macan", "Panamera"],
        "Renault": ["Duster", "Kwid", "Triber", "Koleos"],
        "Rolls Royce": ["Ghost", "Phantom", "Wraith"],
        "Skoda": ["Octavia", "Superb", "Kodiaq", "Rapid", "Kushaq"],
        "Tata": ["Harrier", "Safari", "Nexon", "Hexa", "Tigor"],
        "Toyota": ["Camry", "Corolla", "Fortuner", "Innova Crysta", "Land Cruiser"],
        "Volkswagen": ["Polo", "Vento", "Jetta", "Passat", "Tiguan"],
        "Volvo": ["S60", "S90", "XC40", "XC60", "XC90"]
    };

    const brandSelect = document.getElementById('brand-select');
    const modelSelect = document.getElementById('model-select');

    if (brandSelect && modelSelect) {
        // Populate Brands
        Object.keys(brandModels).sort().forEach(brand => {
            const option = document.createElement('option');
            option.value = brand;
            option.textContent = brand;
            brandSelect.appendChild(option);
        });

        brandSelect.addEventListener('change', () => {
            const brand = brandSelect.value;
            modelSelect.innerHTML = '<option value="" disabled selected>Select Model</option>';
            
            if (brand && brandModels[brand]) {
                brandModels[brand].forEach(model => {
                    const option = document.createElement('option');
                    option.value = model;
                    option.textContent = model;
                    modelSelect.appendChild(option);
                });
                modelSelect.disabled = false;
            } else {
                modelSelect.disabled = true;
            }
        });
    }

    if (carParam && brandSelect && modelSelect) {
        let found = false;
        for (const brand in brandModels) {
            if (carParam.startsWith(brand)) {
                brandSelect.value = brand;
                brandSelect.dispatchEvent(new Event('change'));
                
                const model = carParam.replace(brand, '').trim();
                if (model) {
                    modelSelect.value = model;
                }
                found = true;
                break;
            }
        }
    }

    // 13. Service Descriptions Cloud
    const serviceDescriptions = {
        "BASIC": "Essential maintenance including engine oil change, oil filter cleaning, and basic 25-point inspection.",
        "STANDARD": "Comprehensive service with multi-point inspection, brake pads servicing, coolant top-up, and car wash.",
        "COMPREHENSIVE": "Premium full-spectrum care including fuel filter replacement, wheel alignment, and cabin filter sanitization.",
        "Interior Cleaning": "Deep cabin sanitization, dashboard polishing, seat cleaning, and full vacuuming for a fresh interior.",
        "Exterior cleaning": "Foam wash, rubbing and polishing compound application, and wheel polishing for a high-gloss finish.",
        "Paint protection": "Advanced protective layer that guards against corrosion, adds intense shine, and removes swirl marks.",
        "TYRE ROTATION": "Professional rotation of all tyres to ensure uniform tread wear and improved vehicle stability.",
        "WHEEL ALIGNMENT": "Precision laser alignment to correct steering pull and prevent uneven tyre wear.",
        "WHEEL BALANCING": "Accurate balancing to eliminate steering wheel vibrations and ensure a smooth highway ride.",
        "denting": "Expert body repair and dent removal followed by professional paint matching for a like-new finish.",
        "ceramic": "Ultra-hard protective coating that provides superior hydrophobicity and long-lasting paint protection.",
        "accidental": "Full structural and aesthetic restoration using genuine parts, working with major insurance partners.",
        "service": "Tailored general maintenance and diagnostic check tailored to your vehicle's specific mileage."
    };

    const serviceSelect = document.getElementById('service-select');
    const serviceCloud = document.getElementById('service-cloud');

    if (serviceSelect && serviceCloud) {
        const updateCloud = () => {
            const selectedValue = serviceSelect.value;
            const description = serviceDescriptions[selectedValue];
            
            if (description) {
                serviceCloud.textContent = description;
                serviceCloud.classList.add('visible');
            } else {
                serviceCloud.classList.remove('visible');
            }
        };

        serviceSelect.addEventListener('change', updateCloud);
        
        // Check on load in case it was pre-filled
        setTimeout(updateCloud, 200);
    }

    // 14. Premium Blog Popup System
    const blogDetails = {
        1: {
            title: "BEST CAR REPAIRING CENTER | HI END CARS",
            content: `Now a days to find best car repairing center in NCR, Gurgaon, (India) to very difficult but Vehicle maintenance and repair is one of the best ways to keep your car in pristine condition. Remember that your car needs to be serviced every month. With the right maintenance and service, it will last a long time and you will also enjoy a smooth ride. Most manufacturers usually offer the new car owner free service packages for the first three months. So car owners do not have to spend a cent for maintenance during the first three months. Always listen to the advice of the manufacturers as they can help keep your car in top condition.

            When buying a car for the first time, you should first seek advice from your friends or family about car maintenance. In addition, you can also ask them to refer a reliable and trustworthy technician for repair. You should never take your car for granted.

            Just as you go to your doctor for a regular health check-up, your car needs the same care and maintenance for a safe and smooth ride. A do-it-yourself approach to vehicle maintenance - is that correct? Never take a do-it-yourself approach to vehicle maintenance unless it's a very minor problem and you know how to fix it. If you have no knowledge of car problems it is always advisable to visit a reputable service station. Check out some of the great tips to keep in mind for taking care of your cars in the best way: - It is very important for an owner to follow the maintenance schedule properly based on the distance / miles. Usually it is the company that sets the schedule for the owners.

            Every vehicle owner must change the oil once a year. The oil change also depends on the distance / miles traveled. With timely oil change, you can enjoy a smooth ride. Of course you can check the fluid level of your car yourself. If you don't know how to do this, ask your technician for help. Check coolant, brake fluid and transmission fluids, these are some of the most important fluids. The fact is that there are good mechanics to help you with repairs, but there are also bad ones that just want to cheat you.

            If you are looking for best car repairing center, connect with us on social media`,
            image: "Images/Blogs/Blog1.jpg"
        },
        2: {
            title: "CAR SERVICING: BEST CAR MAINTENANCE| HI END CARS",
            content: `Men often treat their cars as something highly valuable. They invest in upgrades and accessories to improve both appearance and performance. Many focus on enhancing the overall look of their vehicles, from installing bumpers, skirts, tinted windows, and custom wheels to upgrading engines for better speed and power. While spending on aesthetics is common, it’s just as important to pay attention to engine maintenance.

            Car servicing is one of the most effective ways to maintain the quality of your vehicle. Regular check-ups help prevent major repairs and keep your car running smoothly for years. When you buy a brand-new car, most companies include servicing offers under the warranty. It’s important to follow the recommended service schedule based on time or mileage. Manufacturers provide these guidelines because they understand the vehicle best.

            If it’s your first time owning a car, consider asking experienced friends or a professional mechanic for advice. Maintenance should never be ignored. Just like people need regular health check-ups, cars also require routine servicing and tune-ups.

            Avoid handling major maintenance tasks on your own unless you have proper experience. For anything beyond minor fixes, it’s safer to visit a reliable car service center. Below are some essential maintenance tips to keep your car in good condition:

            • Regular Car Service – Always follow the recommended service schedule based on distance or time. This is especially important during the first few years of ownership.

            • Proper Engine Oil Change – Change the engine oil as advised, typically once a year or based on mileage. This helps extend engine life.

            • Check Fluid Levels – Keep an eye on essential fluids such as coolant, brake fluid, battery fluid, and transmission fluid. If unsure, ask a mechanic for help.

            • Check Brakes and Tires – Since these are used constantly, inspect them regularly. Ensure proper brake pressure and maintain the correct tire air levels.

            • Car Body Maintenance – Maintain the appearance of your car by checking parts like mirrors, headlights, bumpers, doors, and seats. Repairs or repainting can be done when necessary.

            If you are looking for the best car repairing center, connect with us on social media.`,
            image: "Images/Blogs/Blog2.jpg"
        },
        3: {
            title: "WHY REGULAR CAR SERVICES IS MUST?| HI END CARS",
            content: `Over the recent decades, the car has become a very important part of our lives, and we depend on it more and more everyday without realizing it. Both personal and family life would become very difficult without the use of the car for most people in the developed countries today. We have to admit that a car has become one of the most essential machines in life.

            However, owning a car also means putting some effort into making sure that it is in its perfect running condition at all times. In Henry de Bracton's words "an ounce of prevention is worth a pound of cure".

            You will need to service the car regularly to keep the maintenance costs low, to prevent accidents and to make it more efficient.

            There are some maintenance steps you can, and are advised, to carry on your own such as adding water if your car is water cooled, replenishing screen washer fluid and checking oil levels.

            Beyond the straightforward maintenance, you should have the car looked at whenever you hear an unusual sound or notice even the slightest abnormality. My recommendation is that you have the car checked regularly, preferably once every six to twelve months to minimize the chances of it breaking down hence costing you more in repairs and inconvenience.

            Just a word of caution though! While the current gloomy economic conditions continue, some people are attempting to service or repair their own car in order to save some money. However, this is not only a risky move if you are not a qualified mechanic with the right set of tool but it will almost certainly invalidate your car insurance as well.

            I highly recommend that unless you are qualified to do so, do not entertain the idea and find a dependable mechanic, a repair and service center or a car work shop where there are professionals trained and licensed to service (or repair) your type of car .

            You do not necessarily need to go to the approved dealer each time, but if your purchase agreement means you get a free or discounted service then by all means do.

            When looking for a car servicing center I would suggest that you find one that is not too far away from your place or work or residence. Nowadays, there are also very cost effective options, such as the mobile car servicing, where the professionals visit your home or work place to service your car.

            The important considerations when comparing different repair centers should include: professionalism, experience, services on offer, after sales service, discounts and pricing. Remember, getting your vehicle serviced regularly by qualified professionals will ensure your own safety as well as saving you money in the long term.

            If you are looking for best car repairing center, connect with us on social media`,
            image: "Images/Blogs/Blog3.jpg"
        },
        4: {
            title: "CAR REPAIR SOME BASIC GUIDELINES | HI END CARS",
            content: `Generally, a car undergoes some kind of repair quite a few times during its lifetime. What do you do if something happens to your car? Either you're trying to get things right yourself or you're getting an expert or an auto mechanic to look at it for you and do the needy.

            Now if you want someone to see what's wrong with your car you need to find a good mechanic or better yet look for a reputed workshop where you rely on your car to be properly repaired. Looking for a quality workshop is not really easy considering that car repair workshops are a dime a dozen. Yet there are many reliable and honest people who will do a great job for you.

            Depending on what's wrong with your car ask around for a mechanic or repair shop that can meet your requirements. It would be ideal if the people involved are the ones who have a pickup and drop-off facility, so in case your car needs to be towed Getup to give you an estimate of the problems your car has and also to quote their costs. Don't forget to inquire about their turnaround time as well. The best way to search for quality car repair shops is to search the internet because most of the successful repair workshops have websites and a strong internet presence.

            There are plenty of workshops in Orlando to get your car straightened, so look up the websites for Orlando auto repair services and you're sure to come Having to pay for car repair work can be quite expensive, so it would be wise to take out car insurance. Make sure you maintain your car properly by changing the oil, oil filter, tuning the engine as and when needed etc. Prevention is better than cure and this also applies to your car.

            If you are looking for best car repairing center, connect with us on social media`,
            image: "Images/Blogs/Blog4.jpg"
        },
        5: {
            title: "GIVE YOUR CAR PERFORMANCE A BOOST | HI END CARS",
            content: `Is the current engine in your car not giving you the performance you want or need? Are you looking to upgrade your car with quality high performance auto parts but can't find a workshop which has a qualified and reliable technician to get the job done? Well, look no further, come by Auto Performance Garage workshop, where we offer a quality line of automotive parts to suit many different car models, with a knowledgeable and Our auto parts are imported and high quality to suit for car models like Proton, Perodua, Honda, Toyota, Mazda, Daihatsu, Mitsubishi, Nissan, Kia, and more. Here are the different parts and systems we have to offer for these cars:- motorsport package (a standard or customized system of parts for the whole car) Our products are reasonably priced so that you, no matter what living standard you come from, can afford these products and have the chance like anyone else to give your car the edge it needs and make your dreams come true. Because our workshop is run by a team of qualified technicians, you will not need to worry about the workmanship during the installation or safety of the car after the installation. Rest assured, you will be satisfied with your car the moment you drive it out of our workshop. Come visit our online car workshop, your ideal service centre for virtually all car models. We provide services like standard car service including engine oil change, standard car accessories installation, high performance automotive parts upgrade and installation especially for those who love car racing, change current engine with better used engine, identifying car problem, and many more automotive services.
            If you are looking for best car repairing center, connect with us on social media`,
            image: "Images/Blogs/Blog5.jpg"
        },
        6: {
            title: "CAR REPAIR COSTS-THREE EASY TIPS | HI END CARS",
            content: `Own a car and it's going to cost you money, unfortunately it's as simple as that. In addition to the cost of loan payments, insurance, registration and fuel, there are regular maintenance and maintenance costs and there is always a risk of an expensive failure. These costs are part of life and unless we parked our cars in the garage to raise dust, we must be prepared for them. Being prepared for them is only part of the equation, as we arm ourselves with the right information we can also stand to make significant savings when it Y has seen many traps that the motorist should be aware of and believe me during spending the last ten years of my life working as a car mechanic I've seen many A few important money-saving tips are described below.

            1. Many workshops use 'advertised special offers' to bring your car to them. Have you ever heard the saying, "there is no such thing as a free lunch"? Well, this is especially true with these so-called 'advertised special offers'. Certainly they will change your oil and filter for twenty dollars and perform a free safety inspection for you. Oh, but what's this huge list of problems they found while doing security check and why do they say I shouldn't be myRee wary of offers that sound toogood to be true because that's usually exactly what they are! If the workshop owner has a slow month or is not quite honest and you are in proclauning your complete lack of mechanical knowledge you also drive him a In

            If you are looking for best car repairing center, connect with us on social media`,
            image: "Images/Blogs/Blog6.jpg"
        },
        7: {
            title: "4 PREVENTATIVE MAINTENANCE TIPS | HI END CARS",
            content: `1. Keep it clean: Your engine does a lot for your vehicle. In fact, without it, your car wouldn't be very far at all, so it's important to keep your engine clean of debris, dust and grate. Over time, filters can be blocked, leaves and dirty blows under the neck, and insects find their way into your vehicle. Grease covering your engine can enter heat, making it difficult for your engine to cool down properly. Your mechanic will probably use it, or recommend a pensioner to carefully clean the outside of your engine. A vacuum tool can also be used to remove debris and dust away from the crash. Fortunately, keep the way your engine is assembled, most of the debris that your vehicle is near the working parts of your engine. However, if you have any strange noises, smells, or smoke coming from your engine compartment, call your mechanic as soon as possible.

            2. Spark plug-in service: To keep dirt and grid out of the combustion room, your spark plug needs to be cleaned up from time to time. To do this, your mechanic will remove the plug lead, clean the space around it, remove the plug and use a special cleaner and brush to remove any build-up, This is such a small job, but it can be a great way to improve the overall performance of your engine.

            3 Good suspery: There are so many moving parts in an engine that it is essential to have a good suspery forever. Otherwise, the friction caused by many of these moving pieces will begin to rub and cause grinding and damage. Sometimes this damage is irreversible and will lead to the need to replace one or more parts before your engine will function properly again. Your mechanic will ensure that your craukas, piston rings and cylinder walls are well-smeared friction and damage to your vehicle. It's also a good time for your mechanic stamps to look into certain parts of the engine to make sure everything fits together the way it should be for

            4. Oil change: It's such a simple procedure, and yet so much to postpone until it's too late. An oil change can make a difference to the performance of your engine and the overall performance of your vehicle. Over time, your oil can become cloudy, cloudy and tough, and it doesn't help your engine to get most of its sleep system. Your oil should be checked and replaced once every 6 months of 10,000 miles to make sure your vehicle is in tip top shape, and your engine gets the Call Glenn's Auto Repair for an oil check today! If you see a problem with your engine, it's best to make an appointment with your mechanic. The longer an engine problem goes unfixed, the more damage it will begin to cause.

            If you are looking for best car repairing center, connect with us on social media`,
            image: "Images/Blogs/Blog7.jpg"
        },
        8: {
            title: "CHOOSING THE BEST MECHANIC FOR OUR MAINTENANCE | HI END CARS",
            content: `1. License and certification: Many people love cars, are passionate about engines, and will offer to fix your vehicle for a bargain price. Unfortunately, not all of these individuals are certified mechanics. When someone other than a certified mechanic works on your vehicle, not only can it invalidate your warranty, it can also cause more problems later. Before you hand over your mode of transport to a stranger, ask for his or her credentials. Where did they go to school, or under whom did they practice? And they have certification as a mechanic.

            2. Meet the staff in person: It is so easy to book an appointment over the phone or over the Internet these days. Many people leave their vehicles without ever talking to the company that will work. Try to stop by a potential garage in person. Discuss all the problems your vehicle has, and get a feel for whether the team really looks in their hopes of helping you. Any mechanic can repair a vehicle, but are they going to do dedication and high-quality work that guarantees you a safe vehicle when they're ready? At Glenn's Auto Repair, our team of experienced mechanics works hard to provide the best possible service every time they work on a vehicle. Before there were advertising companies and park benches covered with company logos, there was word, and this way of advertising still stands. Fortunately, the age of the Internet has made it easier than ever before to see what others are saying about a business and their practices. At Glenn's Auto Repair, we encourage our customers to check what previous customers have said about us. We also like to discuss previous types of work we've done and how we can help you improve your vehicle.

            If you are looking for best car repairing center, connect with us on social media`,
            image: "Images/Blogs/Blog8.jpg"
        },
        9: {
            title: "DO I NEED CAR REPAIR INSURANCE FOR USED CARS | HI END CARS",
            content: `Stretching the shot helps in securing your money and vehicle. With lower costs you can be guaranteed all the more effectively. Used vehicle fixation protection is an outright need for anyone with a more established vehicle. A few people believe that as long as you keep a close eye on your vehicle, there is no good reason to make an arrangement to cover it. Shockingly, these individuals often find that even after following support schemes, oil changes, tire pivots, and ratings, their old vehicle eventually needs to be repaired. That's where protection comes in.

            While a few people decide not to make an arrangement, others realize it's the insightful activity. It's a useful cycle to get an explanation, go through the terms and conditions, and arrange the admission that's right for you.

            Why used car repair insurance is important
            Without an approach, you run the risk of paying unnecessary fixed costs when the opportunity arises to replace or fix things. This occurs after your underlying vehicle warranty has expired, when such invoices are no longer backed by the extraordinary insurance offered by the manufacturer or company. Most trade-in vehicles will fit into this classification after 30 to 90 days. Some never accompany such a warranty or only record a limited recording. d any incidents that occur during the life of your vehicle. It also secures your vehicle by considering repairs that can be done in an easier way than was possible without a strategy in any case. The more you trust that repairs will be made, the more you will regret a circumstance not far away.

            Any incidents that occur during the life of your vehicle. It also secures your vehicle by considering repairs that can be done in an easier way than was possible without a strategy in any case. The more you trust that repairs will be made, the more you will regret a circumstance not far away.

            If you are looking for best car repairing center, connect with us on social media`,
            image: "Images/Blogs/Blog9.jpg"
        }
    };

    const modal = document.getElementById('blog-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    const closeBtn = document.getElementById('close-blog-modal');
    const blogCards = document.querySelectorAll('.blog-card');

    if (modal && blogCards.length > 0) {
        blogCards.forEach(card => {
            card.addEventListener('click', () => {
                const id = card.getAttribute('data-blog-id');
                const data = blogDetails[id];

                if (data) {
                    modalImg.src = data.image;
                    modalTitle.textContent = data.title;
                    modalContent.textContent = data.content;
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent scroll
                }
            });
        });

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        // 16. Modal Spotlight Effect (3D Light without Jitter)
        const modalContainer = modal.querySelector('.blog-modal-container');
        if (modalContainer) {
            modalContainer.addEventListener('mousemove', (e) => {
                const rect = modalContainer.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                modalContainer.style.setProperty('--x', `${x}px`);
                modalContainer.style.setProperty('--y', `${y}px`);
            });
        }
    }
});
