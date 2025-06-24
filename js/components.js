function getRelativePath(file) {
    let path = "";
    if (location.pathname.includes("/html/")) {
        path = "../components/" + file;
    } else {
        path = "components/" + file;
    }
    return path;
}

// 사용
fetch(getRelativePath("header.html"));

/* Header */
// HTML 로드하고 렌더링
async function renderHeader() {
    try {
        // header.html 파일을 fetch로 불러오기
        const response = await fetch(getRelativePath("header.html"));
        const headerHTML = await response.text();

        // HTML 삽입
        document.getElementById("header").innerHTML = headerHTML;

        // 이벤트 리스너 초기화
        initHeaderEvents();

        return true;
    } catch (error) {
        console.error("헤더 로드 실패:", error);
        return false;
    }
}

// 이벤트 초기화
function initHeaderEvents() {
    // DOM 요소들
    const modal = document.getElementById("authModal");
    const openModalBtn = document.getElementById("openModal");
    const closeBtn = document.querySelector(".close");
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const showSignupBtn = document.getElementById("showSignup");
    const showLoginBtn = document.getElementById("showLogin");
    const loginSection = document.getElementById("login-section");
    const userSection = document.getElementById("user-section");
    const usernameSpan = document.getElementById("username");
    const logoutBtn = document.getElementById("logoutBtn");

    // 에러/성공 메시지 요소들
    const loginError = document.getElementById("loginError");
    const signupError = document.getElementById("signupError");
    const signupSuccess = document.getElementById("signupSuccess");

    // 페이지 로드 시 로그인 상태 확인
    window.addEventListener("load", checkLoginStatus);

    // 모달 열기/닫기
    openModalBtn.addEventListener("click", (e) => {
        e.preventDefault();
        modal.style.display = "block";
    });

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
        clearMessages();
    });

    // 모달 외부 클릭 시 닫기
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
            clearMessages();
        }
    });

    // 로그인/회원가입 폼 전환
    showSignupBtn.addEventListener("click", (e) => {
        e.preventDefault();
        loginForm.style.display = "none";
        signupForm.style.display = "block";
        clearMessages();
    });

    showLoginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        signupForm.style.display = "none";
        loginForm.style.display = "block";
        clearMessages();
    });

    // 회원가입 처리
    document
        .getElementById("signup-form")
        .addEventListener("submit", async (e) => {
            e.preventDefault();
            clearMessages();

            const formData = new FormData(e.target);
            const signupData = {
                email: formData.get("email"),
                password: formData.get("password"),
                name: formData.get("name"),
            };

            try {
                // Skapi 회원가입 호출
                const result = await skapi.signup(signupData, {
                    login: true,
                });

                // 성공 시
                signupSuccess.textContent =
                    "회원가입이 완료되었습니다! 자동으로 로그인됩니다.";
                signupSuccess.style.display = "block";

                // 2초 후 모달 닫고 UI 업데이트
                setTimeout(() => {
                    modal.style.display = "none";
                    updateUIForLoggedInUser(result);
                    clearMessages();
                }, 2000);
            } catch (error) {
                console.error("회원가입 오류:", error);
                signupError.textContent = getErrorMessage(error);
                signupError.style.display = "block";
            }
        });

    // 로그인 처리
    document
        .getElementById("login-form")
        .addEventListener("submit", async (e) => {
            e.preventDefault();
            clearMessages();

            const formData = new FormData(e.target);
            const loginData = {
                email: formData.get("email"),
                password: formData.get("password"),
            };

            try {
                // Skapi 로그인 호출
                const user = await skapi.login(loginData);

                // 성공 시 모달 닫고 UI 업데이트
                modal.style.display = "none";
                updateUIForLoggedInUser(user);
            } catch (error) {
                console.error("로그인 오류:", error);
                loginError.textContent = getErrorMessage(error);
                loginError.style.display = "block";
            }
        });

    // 로그아웃 처리
    logoutBtn.addEventListener("click", async () => {
        try {
            await skapi.logout();
            updateUIForLoggedOutUser();
        } catch (error) {
            console.error("로그아웃 오류:", error);
            alert("로그아웃 중 오류가 발생했습니다.");
        }
    });

    // 로그인 상태 확인
    async function checkLoginStatus() {
        try {
            const user = await skapi.getProfile();
            if (user) {
                updateUIForLoggedInUser(user);
            } else {
                updateUIForLoggedOutUser();
            }
        } catch (error) {
            console.error("프로필 조회 오류:", error);
            updateUIForLoggedOutUser();
        }
    }

    // 로그인된 사용자 UI 업데이트
    function updateUIForLoggedInUser(user) {
        loginSection.style.display = "none";
        userSection.style.display = "block";
        usernameSpan.textContent = user.name
            ? `안녕하세요, ${user.name}님!`
            : "안녕하세요!";
    }

    // 로그아웃된 사용자 UI 업데이트
    function updateUIForLoggedOutUser() {
        loginSection.style.display = "block";
        userSection.style.display = "none";
    }

    // 에러 메시지 처리
    function getErrorMessage(error) {
        switch (error.code) {
            case "EXISTS":
                return "이미 존재하는 이메일입니다.";
            case "INCORRECT_USERNAME_OR_PASSWORD":
                return "이메일 또는 비밀번호가 잘못되었습니다.";
            case "REQUEST_EXCEED":
                return "너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.";
            case "USER_IS_DISABLED":
                return "비활성화된 계정입니다.";
            case "SIGNUP_CONFIRMATION_NEEDED":
                return "이메일 인증이 필요합니다.";
            default:
                return (
                    error.message || "오류가 발생했습니다. 다시 시도해주세요."
                );
        }
    }

    // 에러/성공 메시지 초기화
    function clearMessages() {
        loginError.style.display = "none";
        signupError.style.display = "none";
        signupSuccess.style.display = "none";
        loginError.textContent = "";
        signupError.textContent = "";
        signupSuccess.textContent = "";
    }
}

/* Nav */
// HTML 로드하고 렌더링
async function renderNav() {
    try {
        // nav.html 파일을 fetch로 불러오기
        const response = await fetch(getRelativePath("nav.html"));
        const navHTML = await response.text();

        // HTML 삽입
        document.getElementById("nav").innerHTML = navHTML;

        // 이벤트 리스너 초기화
        initNavEvents();

        return true;
    } catch (error) {
        console.error("네비게이션 로드 실패:", error);
        return false;
    }
}

// 이벤트 초기화
function initNavEvents() {
    // 네비게이션 링크 초기화
    initNavigation();

    // 검색 기능 초기화
    initSearch();
}

// Navigation Functions
function initNavigation() {
    const navLinks = document.querySelectorAll(".nav-menu a");

    navLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            // Remove active class from all links
            navLinks.forEach((nav) => nav.classList.remove("active"));
            // Add active class to clicked link
            this.classList.add("active");

            // Smooth scroll for anchor links
            if (this.getAttribute("href").startsWith("#")) {
                e.preventDefault();
                const targetId = this.getAttribute("href").substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
            }
        });
    });
}

// Search Functionality
function initSearch() {
    const searchInput = document.querySelector(".search-box input");
    const searchIcon = document.querySelector(".search-box i");

    if (searchInput && searchIcon) {
        // Search on Enter key
        searchInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                performSearch(this.value);
            }
        });

        // Search on icon click
        searchIcon.addEventListener("click", function () {
            performSearch(searchInput.value);
        });

        // Search suggestions (placeholder functionality)
        searchInput.addEventListener("input", function () {
            const query = this.value.toLowerCase();
            if (query.length > 2) {
                // This is where you would implement search suggestions
                console.log("Searching for:", query);
            }
        });
    }
}

function performSearch(query) {
    if (query.trim() === "") {
        alert("검색어를 입력해주세요.");
        return;
    }

    // This is a placeholder for actual search functionality
    console.log("검색 실행:", query);
    alert(`"${query}" 검색 기능이 구현될 예정입니다.`);
}

/* Footer */
// HTML 로드하고 렌더링
async function renderFooter() {
    try {
        // footer.html 파일을 fetch로 불러오기
        const response = await fetch(getRelativePath("footer.html"));
        const footerHTML = await response.text();

        // HTML 삽입
        document.getElementById("footer").innerHTML = footerHTML;

        // 이벤트 리스너 초기화
        // initFooterEvents();

        return true;
    } catch (error) {
        console.error("푸터 로드 실패:", error);
        return false;
    }
}

// 페이지 로드 시 헤더 렌더링
document.addEventListener("DOMContentLoaded", async () => {
    const headerLoaded = await renderHeader();
    const navLoaded = await renderNav();
    const footerLoaded = await renderFooter();

    Promise.all([headerLoaded, navLoaded, footerLoaded]);
});
