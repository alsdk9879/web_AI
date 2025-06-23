const skapi = new Skapi(
    "ap222AtpuBBsCowTgi5D",
    "bf305ace-03b5-4f9d-b88f-291458748ca3"
);

skapi.getConnectionInfo().then((info) => {
    console.log("skapi connected.");
});

// Countdown Timer
function initCountdown() {
    const countdownElements = document.querySelectorAll(".count");

    if (countdownElements.length > 0) {
        // Set initial countdown values (days, hours, minutes, seconds)
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 21); // 21 days from now

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor(
                    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                const minutes = Math.floor(
                    (distance % (1000 * 60 * 60)) / (1000 * 60)
                );
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                if (countdownElements[0])
                    countdownElements[0].textContent = days
                        .toString()
                        .padStart(2, "0");
                if (countdownElements[1])
                    countdownElements[1].textContent = hours
                        .toString()
                        .padStart(2, "0");
                if (countdownElements[2])
                    countdownElements[2].textContent = minutes
                        .toString()
                        .padStart(2, "0");
                if (countdownElements[3])
                    countdownElements[3].textContent = seconds
                        .toString()
                        .padStart(2, "0");
            } else {
                countdownElements.forEach((el) => (el.textContent = "00"));
            }
        }

        // Update every second
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
}

// Newsletter Form
function initNewsletterForm() {
    const newsletterForm = document.querySelector(".newsletter-form");
    const emailInput = document.querySelector(".newsletter-form input");
    const submitButton = document.querySelector(".newsletter-form button");

    if (newsletterForm && emailInput && submitButton) {
        newsletterForm.addEventListener("submit", function (e) {
            e.preventDefault();
            handleNewsletterSubmit(emailInput.value);
        });

        submitButton.addEventListener("click", function (e) {
            e.preventDefault();
            handleNewsletterSubmit(emailInput.value);
        });

        emailInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                handleNewsletterSubmit(this.value);
            }
        });
    }
}

function handleNewsletterSubmit(email) {
    if (!validateEmail(email)) {
        alert("올바른 이메일 주소를 입력해주세요.");
        return;
    }

    // This is where you would send the email to your server
    console.log("뉴스레터 구독:", email);
    alert("뉴스레터 구독이 완료되었습니다!");

    // Clear the input
    const emailInput = document.querySelector(".newsletter-form input");
    if (emailInput) emailInput.value = "";
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Scroll Effects
function initScrollEffects() {
    // Navbar scroll effect
    const navbar = document.querySelector(".navbar");

    if (navbar) {
        window.addEventListener("scroll", function () {
            if (window.scrollY > 100) {
                navbar.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                navbar.style.backgroundColor = "rgba(255,255,255,0.95)";
                navbar.style.backdropFilter = "blur(10px)";
            } else {
                navbar.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                navbar.style.backgroundColor = "#fff";
                navbar.style.backdropFilter = "none";
            }
        });
    }

    // Scroll to top functionality
    createScrollToTopButton();

    // Animate elements on scroll
    initScrollAnimations();
}

function createScrollToTopButton() {
    const scrollButton = document.createElement("button");
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollButton.className = "scroll-to-top";
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #ff6b35;
        color: white;
        border: none;
        cursor: pointer;
        display: none;
        z-index: 1000;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
    `;

    document.body.appendChild(scrollButton);

    window.addEventListener("scroll", function () {
        if (window.scrollY > 300) {
            scrollButton.style.display = "block";
        } else {
            scrollButton.style.display = "none";
        }
    });

    scrollButton.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });

    scrollButton.addEventListener("mouseenter", function () {
        this.style.transform = "scale(1.1)";
        this.style.backgroundColor = "#e55a2b";
    });

    scrollButton.addEventListener("mouseleave", function () {
        this.style.transform = "scale(1)";
        this.style.backgroundColor = "#ff6b35";
    });
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    // Animate sections
    const animatedElements = document.querySelectorAll(
        ".review-item, .news-item, .brand-grid-item, .instagram-item"
    );

    animatedElements.forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "all 0.6s ease";
        observer.observe(el);
    });
}

// Mobile Menu
function initMobileMenu() {
    // This would be implemented if you had a hamburger menu
    // For now, the menu is already responsive with CSS
    const navMenu = document.querySelector(".nav-menu");

    if (window.innerWidth <= 768) {
        // Add mobile-specific functionality here
        console.log("Mobile menu initialized");
    }
}

// Brand Hover Effects
function initBrandHover() {
    const brandItems = document.querySelectorAll(
        ".brand-item, .brand-grid-item"
    );

    brandItems.forEach((item) => {
        item.addEventListener("mouseenter", function () {
            this.style.transform = "translateY(-5px) scale(1.05)";
        });

        item.addEventListener("mouseleave", function () {
            this.style.transform = "translateY(0) scale(1)";
        });

        item.addEventListener("click", function () {
            const brandName =
                this.querySelector("span")?.textContent || "Brand";
            console.log(`${brandName} 브랜드 클릭됨`);
            // Here you would navigate to the brand page
        });
    });
}

// Instagram Gallery
function initInstagramGallery() {
    const instagramItems = document.querySelectorAll(".instagram-item");

    instagramItems.forEach((item) => {
        item.addEventListener("click", function () {
            // This would open Instagram post or modal
            // console.log("Instagram post clicked");
            // Placeholder functionality
            alert("Instagram 갤러리 기능이 구현될 예정입니다.");
        });
    });
}

// Button Click Handlers
document.addEventListener("click", function (e) {
    // Handle all primary buttons
    if (e.target.classList.contains("btn-primary")) {
        const buttonText = e.target.textContent.trim();

        switch (buttonText) {
            case "VIEW PRODUCT":
                console.log("제품 보기 클릭됨");
                break;
            case "SHOP COLLECTION":
                console.log("컬렉션 쇼핑 클릭됨");
                break;
            case "GET STARTED":
                console.log("시작하기 클릭됨");
                break;
            case "GO TO SHOP":
                console.log("쇼핑하러 가기 클릭됨");
                break;
            default:
                console.log("버튼 클릭됨:", buttonText);
        }
    }

    // Handle social icons
    if (e.target.classList.contains("fab")) {
        const socialPlatform = e.target.className
            .split(" ")[1]
            .replace("fa-", "");
        console.log(`${socialPlatform} 소셜 미디어 클릭됨`);
    }
});

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Window resize handler
window.addEventListener(
    "resize",
    debounce(function () {
        // Handle responsive changes
        if (window.innerWidth <= 768) {
            // Mobile adjustments
            console.log("Mobile view");
        } else {
            // Desktop adjustments
            console.log("Desktop view");
        }
    }, 250)
);

// Error handling for images
document.addEventListener(
    "error",
    function (e) {
        if (e.target.tagName === "IMG") {
            // console.log("Image failed to load:", e.target.src);
            // You could set a fallback image here
            // e.target.src = 'path/to/fallback-image.jpg';
        }
    },
    true
);

document.addEventListener("DOMContentLoaded", function () {
    // Initialize all functions
    initNavigation();
    initSearch();
    initCountdown();
    initNewsletterForm();
    initScrollEffects();
    initMobileMenu();
    initBrandHover();
    initInstagramGallery();
});
