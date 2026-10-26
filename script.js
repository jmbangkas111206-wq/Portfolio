/**
 * BENJAMIN PORTFOLIO INTERACTIVE SCRIPT
 * Handles mobile sidebar toggle, theme accent color switching,
 * scrollspy navigation, portfolio category filtering, lightbox, and contact form submission.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------------------
       1. Mobile Menu Sidebar Toggle
       ---------------------------------------------------------------------- */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');

    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (sidebar.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });
    }

    /* ----------------------------------------------------------------------
       2. Dynamic Accent Color Theme Switcher
       ---------------------------------------------------------------------- */
    const themeOptions = document.querySelectorAll('.theme-option');

    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const selectedColor = option.getAttribute('data-color');
            
            // Update CSS custom variable
            document.documentElement.style.setProperty('--accent-color', selectedColor);

            // Compute dark/hover shade dynamically
            const hoverColor = adjustColorBrightness(selectedColor, -20);
            document.documentElement.style.setProperty('--accent-hover', hoverColor);

            // Update active selector state
            themeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
        });
    });

    // Color brightness helper function
    function adjustColorBrightness(hex, percent) {
        let num = parseInt(hex.replace('#', ''), 16),
            amt = Math.round(2.55 * percent),
            R = (num >> 16) + amt,
            B = (num >> 8 & 0x00FF) + amt,
            G = (num & 0x0000FF) + amt;

        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
    }

    /* ----------------------------------------------------------------------
       3. Scrollspy (Active Navigation Links Sync)
       ---------------------------------------------------------------------- */
    const sections = document.querySelectorAll('.section');
    const sidebarNavLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const quickNavLinks = document.querySelectorAll('.quick-nav .quick-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Update Left Sidebar Nav
        sidebarNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

        // Update Right Quick Nav
        quickNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    /* ----------------------------------------------------------------------
       4. Portfolio Filtering System
       ---------------------------------------------------------------------- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    /* ----------------------------------------------------------------------
       5. Lightbox Modal Preview
       ---------------------------------------------------------------------- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.getElementById('close-lightbox');

    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('img').getAttribute('src');
            lightboxImg.setAttribute('src', imgSrc);
            lightbox.style.display = 'flex';
        });
    });

    if (closeLightbox && lightbox) {
        closeLightbox.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
    }

    /*6. Contact Form Submission Toast Alert */
    /* ----------------------------------------------------------------------
   6. Real Contact Form Submission (via Formspree API)
   ---------------------------------------------------------------------- */
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const toast = document.getElementById('toast');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Update button state to loading
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = 'SENDING...';
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                toast.innerText = 'Message sent successfully! I will reply soon.';
                toast.style.backgroundColor = '#10b981'; // Green toast
                contactForm.reset();
            } else {
                toast.innerText = 'Oops! There was a problem sending your message.';
                toast.style.backgroundColor = '#ef4444'; // Red toast
            }
        } catch (error) {
            toast.innerText = 'Connection error. Please try again.';
            toast.style.backgroundColor = '#ef4444';
        } finally {
            // Re-enable submit button
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;

            // Show Toast Alert
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 4000);
       }
    });
}
});