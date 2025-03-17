import { loadComponents } from "../functions.js";

document.addEventListener("DOMContentLoaded", () => {
    // Load components first
    Promise.all([
        loadComponents("navbar.html", document.getElementById("navbar")),
        loadComponents("footer.html", document.getElementById("footer")),
        loadComponents("drawer.html", document.getElementById("draw")),
    ]).then(() => {
        // Initialize all interactive elements after components are loaded
        initializeNavbarObserver();
        initializeNavbarDrawer()
    });
});


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