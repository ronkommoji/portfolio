// Main JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // 0.5. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const sidebar = document.getElementById('mobile-nav');

    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = sidebar.classList.contains('open');
            sidebar.classList.toggle('open');
            mobileMenuBtn.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', !isOpen);

            // Prevent body scroll when menu is open
            document.body.style.overflow = isOpen ? '' : 'hidden';
        });

        // Close menu when clicking a nav link
        sidebar.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                sidebar.classList.remove('open');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside (on the backdrop)
        sidebar.addEventListener('click', (e) => {
            if (e.target === sidebar) {
                sidebar.classList.remove('open');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }
    // 0. Dark Mode Toggle via Bible Verse Words
    const themeLightWord = document.getElementById('theme-light');
    const themeDarkWord = document.getElementById('theme-dark');
    const html = document.documentElement;

    // Check for saved theme preference or default to system preference
    const getPreferredTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        // Check system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    // Update active state indicators on words
    const updateActiveState = (theme) => {
        if (theme === 'dark') {
            themeDarkWord.classList.add('active');
            themeLightWord.classList.remove('active');
        } else {
            themeLightWord.classList.add('active');
            themeDarkWord.classList.remove('active');
        }
    };

    // Apply theme
    const setTheme = (theme) => {
        if (theme === 'dark') {
            html.setAttribute('data-theme', 'dark');
        } else {
            html.removeAttribute('data-theme');
        }
        localStorage.setItem('theme', theme);
        updateActiveState(theme);
    };

    // Initialize theme
    setTheme(getPreferredTheme());

    // Click handler for "light" word
    themeLightWord.addEventListener('click', () => {
        setTheme('light');
    });

    // Click handler for "darkness" word
    themeDarkWord.addEventListener('click', () => {
        setTheme('dark');
    });

    // Keyboard accessibility for theme words
    themeLightWord.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setTheme('light');
        }
    });

    themeDarkWord.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setTheme('dark');
        }
    });

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // 1. Smooth Scroll Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update URL without jump
                history.pushState(null, null, targetId);
            }
        });
    });

    // 2. Experience Dropdowns
    document.querySelectorAll('.experience-header').forEach(button => {
        button.addEventListener('click', function () {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);

            const details = this.nextElementSibling;
            details.hidden = isExpanded;
        });
    });

    // 3. Active Nav Link on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    function highlightNavLink() {
        let current = '';
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Check if we're at the bottom of the page
        const isAtBottom = (scrollY + windowHeight) >= (documentHeight - 100);

        if (isAtBottom) {
            // If at bottom, highlight the last section (Skills)
            const lastSection = sections[sections.length - 1];
            if (lastSection) {
                current = lastSection.getAttribute('id');
            }
        } else {
            // Normal scroll detection
            sections.forEach(section => {
                const sectionTop = section.offsetTop;

                // Offset of 200px to trigger highlight before section hits top
                if (scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);

    // Initial check
    highlightNavLink();

    // 4. Stagger Animation for Bottom Social Links
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px)';

        setTimeout(() => {
            link.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 100 * index + 800); // Start after page load animations
    });

    // ============================================
    // 5. Scroll-Triggered Animations (Intersection Observer)
    // ============================================
    const animateOnScroll = () => {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            // If user prefers reduced motion, make all elements visible immediately
            document.querySelectorAll('.anim-reveal').forEach(el => {
                el.classList.add('is-visible');
            });
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -15% 0px', // Trigger when 15% of element is visible
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');

                    // Animate section header underline
                    const header = entry.target.querySelector('.section-header');
                    if (header) {
                        header.classList.add('is-visible');
                    }

                    // Stagger child animations (only for section content, not sidebar)
                    const children = entry.target.querySelectorAll('.section-content.anim-stagger > *');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, index * 100);
                    });

                    // Unobserve after animation
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all sections with anim-reveal class
        document.querySelectorAll('.anim-reveal').forEach(section => {
            observer.observe(section);
        });

        // Initialize stagger children with hidden state (only section content, not sidebar)
        document.querySelectorAll('.section-content.anim-stagger > *').forEach(child => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(20px)';
            child.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        });
    };

    // Run scroll animations after initial page load animations
    setTimeout(animateOnScroll, 100);

    // ============================================
    // 6. Project Cards Stagger Animation
    // ============================================
    const animateProjectCards = () => {
        const projectsSection = document.getElementById('projects');
        if (!projectsSection) return;

        const projectCards = projectsSection.querySelectorAll('.project-card');

        // Set initial state
        projectCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const cards = entry.target.querySelectorAll('.project-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 150);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(projectsSection);
    };

    setTimeout(animateProjectCards, 100);

    // ============================================
    // 7. Magnetic Cursor Effect for Buttons
    // ============================================
    const magneticButtons = () => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const buttons = document.querySelectorAll('.view-project-btn');

        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                // Subtle magnetic pull effect
                button.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
                button.style.transition = 'transform 0.3s ease-out';
            });

            button.addEventListener('mouseenter', () => {
                button.style.transition = 'transform 0.1s ease-out';
            });
        });
    };

    magneticButtons();

    // ============================================
    // 8. Parallax Effect on Scroll (Subtle)
    // ============================================
    const parallaxEffect = () => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const headerName = document.querySelector('.header-name');
        const profilePic = document.querySelector('.about-picture');

        // Wait for the initial CSS animation to complete, then remove it
        // so JavaScript can control opacity/transform
        if (headerName) {
            setTimeout(() => {
                headerName.style.animation = 'none';
                headerName.style.opacity = '1';
                headerName.style.transform = 'translateY(0)';
            }, 1100); // Wait for anim-load-2 to finish (0.25s delay + 0.8s duration)
        }

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const isMobile = window.innerWidth < 768;

                    // Fade out header name on scroll (quote stays visible) - DESKTOP ONLY
                    if (headerName && scrollY < 500 && !isMobile) {
                        const opacity = Math.max(0, 1 - scrollY / 300);
                        const translateY = scrollY * 0.2;
                        headerName.style.opacity = opacity;
                        headerName.style.transform = `translateY(${translateY}px)`;
                    } else if (headerName && isMobile) {
                        // Keep name visible on mobile
                        headerName.style.opacity = '1';
                        headerName.style.transform = 'translateY(0)';
                    }

                    // Very subtle float on profile picture while scrolling
                    if (profilePic && scrollY < 800) {
                        const translateY = Math.sin(scrollY * 0.01) * 3;
                        profilePic.style.transform = `translateY(${translateY}px)`;
                    }

                    ticking = false;
                });
                ticking = true;
            }
        });
    };

    parallaxEffect();

    // Typing effect removed - tagline now uses CSS animation matching the name

    // ============================================
    // 10. Smooth Section Transitions on Tab Focus
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('focus', function () {
            this.style.outline = 'none';
            this.style.boxShadow = '0 0 0 2px var(--accent-primary)';
        });

        anchor.addEventListener('blur', function () {
            this.style.boxShadow = 'none';
        });
    });
});

