tailwind.config = {
    theme: {
      extend: {
        colors: {
          primary: "#60a5fa",
          secondary: "#34d399",
        },
        borderRadius: {
          none: "0px",
          sm: "4px",
          DEFAULT: "8px",
          md: "12px",
          lg: "16px",
          xl: "20px",
          "2xl": "24px",
          "3xl": "32px",
          full: "9999px",
          button: "8px",
        },
      },
    },
  };
  
  document.addEventListener("DOMContentLoaded", function() {
    // Track login state
    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    let isLoginForm = true;
  
    // DOM Elements
    const authSection = document.getElementById('authSection');
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const loginBtnCourses = document.getElementById('loginBtnCourses');
    const getStartedBtn = document.getElementById('getStartedBtn');
    const closeModal = document.getElementById('closeModal');
    const toggleForm = document.getElementById('toggleForm');
    const modalTitle = document.getElementById('modalTitle');
    const submitButton = document.getElementById('submitButton');
    const loginOnlyElements = document.querySelectorAll(".login-only");
    const signupOnlyElements = document.querySelectorAll(".signup-only");
  
    // Toggle between login and signup forms
    const toggleFormType = () => {
      isLoginForm = !isLoginForm;
      modalTitle.textContent = isLoginForm ? "Login" : "Create Account";
      submitButton.textContent = isLoginForm ? "Login" : "Sign Up";
      
      // Toggle visibility of form sections
      loginOnlyElements.forEach((el) => el.classList.toggle("hidden"));
      signupOnlyElements.forEach((el) => el.classList.toggle("hidden"));
      
      // Update required attributes
      const signupFields = loginForm.querySelectorAll(".signup-only input");
      signupFields.forEach((field) => {
        field.required = !isLoginForm;
      });
    };
  
    // Show login modal
    const showLoginModal = () => {
      loginModal.style.display = "block";
      if (!isLoginForm) {
        toggleFormType();
      }
    };
  
    // Show signup modal
    const showSignupModal = () => {
      loginModal.style.display = "block";
      if (isLoginForm) {
        toggleFormType();
      }
    };
  
    // Login function
    const login = () => {
      isLoggedIn = true;
      localStorage.setItem('isLoggedIn', 'true');
      updateAuthUI();
      loginModal.style.display = 'none';
    };
  
    // Logout function
    const logout = () => {
      isLoggedIn = false;
      localStorage.removeItem('isLoggedIn');
      updateAuthUI();
    };
  
    // Update UI based on auth state
    function updateAuthUI() {
      if (isLoggedIn) {
        authSection.innerHTML = `
          <div class="relative">
            <button id="profileBtn" class="flex items-center space-x-2 focus:outline-none">
              <img src="https://public.readdy.ai/ai/img_res/9c2447779f15e5ce78236ce58619f4d9.jpg" 
                   class="w-8 h-8 rounded-full border-2 border-primary" 
                   alt="Profile">
            </button>
            <div id="profileDropdown" class="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 hidden">
              <a href="profile.html" class="block px-4 py-2 text-gray-300 hover:bg-gray-700">Profile</a>
              <a href="dash.html" class="block px-4 py-2 text-gray-300 hover:bg-gray-700">Dashboard</a>
              <a href="#" id="logoutBtn" class="block px-4 py-2 text-gray-300 hover:bg-gray-700">Logout</a>
            </div>
          </div>
        `;
        
        // Add dropdown toggle
        const profileBtn = document.getElementById('profileBtn');
        const dropdown = document.getElementById('profileDropdown');
        
        if (profileBtn) {
          profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('hidden');
          });
        }
        
        document.getElementById('logoutBtn')?.addEventListener('click', logout);
      } else {
        authSection.innerHTML = `
          <button id="loginBtn" class="bg-primary text-white px-4 py-2 !rounded-button hover:bg-primary/90 whitespace-nowrap">
            Login
          </button>
        `;
        document.getElementById('loginBtn')?.addEventListener('click', showLoginModal);
      }
    }
  
    // Event Listeners
    toggleForm?.addEventListener('click', (e) => {
      e.preventDefault();
      toggleFormType();
    });
  
    loginBtn?.addEventListener('click', showLoginModal);
    if (loginBtnCourses) loginBtnCourses.addEventListener('click', showLoginModal);
    getStartedBtn?.addEventListener('click', showSignupModal);
  
    closeModal?.addEventListener('click', () => {
      loginModal.style.display = "none";
    });
  
    window.addEventListener('click', (e) => {
      if (e.target === loginModal) {
        loginModal.style.display = "none";
      }
      
      // Close dropdown when clicking outside
      const dropdown = document.getElementById('profileDropdown');
      if (dropdown && !dropdown.contains(e.target)) {
        const profileBtn = document.getElementById('profileBtn');
        if (profileBtn && !profileBtn.contains(e.target)) {
          dropdown.classList.add('hidden');
        }
      }
    });
  
    // Form Submission
    loginForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Clear previous errors
      const existingErrors = document.querySelectorAll(".form-error");
      existingErrors.forEach(error => error.remove());
      
      // Password confirmation check for signup
      if (!isLoginForm) {
        const password = loginForm.querySelector("input[name='password']").value;
        const confirmPassword = loginForm.querySelector("input[name='confirmPassword']").value;
        
        if (password !== confirmPassword) {
          const errorDiv = document.createElement("div");
          errorDiv.className = "form-error text-red-500 text-sm mt-2";
          errorDiv.textContent = "Passwords do not match";
          loginForm.querySelector("input[name='confirmPassword']").parentNode.appendChild(errorDiv);
          return;
        }
      }
      
      // Form data collection
      const formData = new FormData(loginForm);
      const data = Object.fromEntries(formData);
      
      // Here you would typically send the data to your backend
      console.log(`${isLoginForm ? "Login" : "Sign up"} attempt with:`, data);
      
      // Call login function
      login();
    });
  
    // Handle courses page routing
    const coursesPage = document.getElementById("coursesPage");
    if (window.location.pathname.includes("courses.html")) {
      document.body.innerHTML = coursesPage.innerHTML;
      coursesPage.remove();
    } else {
      coursesPage.remove();
    }
  
    // Initialize
    updateAuthUI();
  });
  