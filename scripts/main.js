import { loadComponents } from "../functions.js";

// Single DOMContentLoaded event listener to handle all initializations
document.addEventListener("DOMContentLoaded", () => {
    // Load components first
    Promise.all([
        loadComponents("navbar.html", document.getElementById("navbar")),
        loadComponents("footer.html", document.getElementById("footer")),
        loadComponents("WhatWeOffer.html", document.getElementById("what-we-offer")),
        loadComponents("WhyChooseUs.html", document.getElementById("why-choose-us")),
        loadComponents("drawer.html", document.getElementById("draw")),
    ]).then(() => {
        // Initialize all interactive elements after components are loaded
        initializeSlider();
        initializeServiceSlider();
        initializeTestimonialSlider();
        initializeAccordion();
        initializeNavbarObserver();
        initializeNavbarDrawer();
    });
});

// Slider functionality
function initializeSlider() {
    const images = document.querySelectorAll(".hero-img");
    const contentElements = document.querySelectorAll(".content");
    let currentIndex = 0;
    let slideInterval;

    // Start automatic slideshow
    startSlideshow();

    // Function to start automatic slideshow
    function startSlideshow() {
        // Clear any existing interval first
        clearInterval(slideInterval);

        slideInterval = setInterval(() => {
            changeSlide(1);
        }, 5000);
    }

    // Function to show a specific slide
    function showSlide(index) {
        // Hide all images and content
        images.forEach(image => image.classList.remove("active"));
        contentElements.forEach(content => content.classList.remove("active"));

        // Show current image and matching content
        images[index].classList.add("active");

        // Make sure we have a matching content element
        if (contentElements.length > index) {
            contentElements[index].classList.add("active");
        }

        currentIndex = index;
    }

    // Function to change slide
    function changeSlide(direction) {
        currentIndex = (currentIndex + direction + images.length) % images.length;
        showSlide(currentIndex);

        // Reset interval when manually changing slides
        startSlideshow();
    }

    // Initialize the first slide
    showSlide(currentIndex);

    // Add event listeners to navigation buttons
    const leftBtn = document.getElementById("nav-btn-left");
    const rightBtn = document.getElementById("nav-btn-right");

    if (leftBtn) {
        leftBtn.addEventListener("click", () => changeSlide(-1));
    }

    if (rightBtn) {
        rightBtn.addEventListener("click", () => changeSlide(1));
    }

    // Pause slideshow when user hovers over the slider
    const sliderContainer = document.querySelector("#hero");
    if (sliderContainer) {
        sliderContainer.addEventListener("mouseenter", () => {
            clearInterval(slideInterval);
        });

        sliderContainer.addEventListener("mouseleave", () => {
            startSlideshow();
        });
    }
}

// JavaScript for the service provided slider
function initializeServiceSlider() {
    const cardWrapper = document.getElementById('cardWrapper');
    const navButtons = document.getElementById('navButtons');

    if (!cardWrapper || !navButtons) return;

    const cards = Array.from(document.querySelectorAll('.card'));
    const totalCards = cards.length;

    // Generate navigation buttons for each card
    cards.forEach((card, index) => {
        const button = document.createElement('button');
        button.classList.add('nav-btn');
        button.setAttribute('data-index', index);
        button.textContent = index + 1;
        navButtons.appendChild(button);
    });

    // Set first button as active
    const firstBtn = navButtons.querySelector('.nav-btn');
    if (firstBtn) firstBtn.classList.add('active');

    // Navigation event listener
    navButtons.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-btn')) {
            const targetIndex = parseInt(e.target.dataset.index);

            // Remove active states from all buttons
            navButtons.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.classList.add('active');

            // Scroll to the selected card
            cards[targetIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    });

    // Intersection Observer to update active button on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeIndex = parseInt(entry.target.dataset.index);

                // Update active button
                navButtons.querySelectorAll('.nav-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                navButtons.querySelector(`[data-index="${activeIndex}"]`).classList.add('active');
            }
        });
    }, {
        root: cardWrapper,
        threshold: 0.7
    });

    // Observe all cards
    cards.forEach(card => observer.observe(card));
}

// JavaScript for the Testimonial Slider
function initializeTestimonialSlider() {
    const track = document.querySelector('.slider-track');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    const gotoButtons = document.querySelectorAll('.goto-button');

    if (!track || !prevButton || !nextButton) return;

    let currentIndex = 0;
    const totalGroups = document.querySelectorAll('.slider-group').length;

    // Initialize first slide
    updateSlider();

    // Event listeners
    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalGroups) % totalGroups;
        updateSlider();
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalGroups;
        updateSlider();
    });

    gotoButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentIndex = parseInt(button.dataset.index);
            updateSlider();
        });
    });

    // Update slider position and active button
    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update active button
        gotoButtons.forEach(button => {
            button.classList.remove('active');
            if (parseInt(button.dataset.index) === currentIndex) {
                button.classList.add('active');
            }
        });
    }
}

// Accordion setup
function initializeAccordion() {
    document.querySelectorAll('.accordion-header').forEach(button => {
        button.addEventListener('click', () => {
            const accordionContent = button.nextElementSibling;

            button.classList.toggle('active');
            accordionContent.classList.toggle('active');

            // Close other accordion items
            document.querySelectorAll('.accordion-header').forEach(otherButton => {
                if (otherButton !== button) {
                    otherButton.classList.remove('active');
                    otherButton.nextElementSibling.classList.remove('active');
                }
            });
        });
    });
}

// Intersection observer API for navbar
// Select the sentinel and navbar
function initializeNavbarObserver() {
    // Select the sentinel and navbar
    const sentinel = document.querySelector('.sentinel');
    const navbar = document.getElementById('nav');

    if (!sentinel || !navbar) {
        console.error("Sentinel or navbar not found!");
        return;
    }

    // Create the Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                // Sentinel is out of view (user scrolled down)
                navbar.classList.add('scrolled');
            } else {
                // Sentinel is in view (user scrolled to the top)
                navbar.classList.remove('scrolled');
            }
        });
    }, {
        root: null, // Use the viewport as the root
        rootMargin: '0px', // No margin
        threshold: 0, // Trigger as soon as the sentinel leaves the viewport
    });

    // Start observing the sentinel
    observer.observe(sentinel);
}
// scroll to top functionality
// Get the button
const scrollTopBtn = document.getElementById("scrollTopBtn");

// Show button when user scrolls down 300px from the top
window.onscroll = function () {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        scrollTopBtn.classList.add("show");
    } else {
        scrollTopBtn.classList.remove("show");
    }
};

// Scroll to top when button is clicked
scrollTopBtn.addEventListener("click", function () {
    // For smooth scrolling
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});
// Navbar drawer functionality
function initializeNavbarDrawer() {
    const menuToggle = document.getElementById('menu-toggle');
    const navDrawer = document.getElementById('nav-drawer');
    const closeBtn = document.getElementById('close-drawer');
    const overlay = document.getElementById('drawer-overlay');
    const drawerLinks = document.querySelectorAll('#nav-drawer .nav-link');
    const servicesDropdown = document.getElementById('services-dropdown');
    const servicesDropdownContent = document.getElementById('services-dropdown-content');
    
    // Function to open the drawer
    function openDrawer() {
        navDrawer.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when drawer is open
    }
    
    // Function to close the drawer
    function closeDrawer() {
        navDrawer.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Close any open dropdowns
        if (servicesDropdownContent && servicesDropdownContent.classList.contains('show')) {
            servicesDropdownContent.classList.remove('show');
        }
    }
    
    // Toggle services dropdown in the drawer
    if (servicesDropdown) {
        servicesDropdown.addEventListener('click', (e) => {
            e.preventDefault();
            servicesDropdownContent.classList.toggle('show');
        });
    }
    
    // Toggle drawer when menu button is clicked
    if (menuToggle) {
        menuToggle.addEventListener('click', openDrawer);
    }
    
    // Close drawer when close button is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', closeDrawer);
    }
    
    // Close drawer when overlay is clicked
    if (overlay) {
        overlay.addEventListener('click', closeDrawer);
    }
    
    // Close drawer when a navigation link is clicked
    drawerLinks.forEach(link => {
        // Don't close on service dropdown toggle
        if (!link.classList.contains('dropdown-toggle')) {
            link.addEventListener('click', closeDrawer);
        }
    });
    
    // Close drawer when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navDrawer.classList.contains('open')) {
            closeDrawer();
        }
    });
    
    // Handle resize - close drawer if switching to desktop size
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && navDrawer.classList.contains('open')) {
            closeDrawer();
        }
    });
}
