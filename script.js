// Tailwind config
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
  let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

  // DOM Elements
  const authSection = document.getElementById('authSection');
  const authSectionMobile = document.getElementById('authSectionMobile');
  const loginModal = document.getElementById('loginModal');
  const loginForm = document.getElementById('loginForm');
  const loginBtn = document.getElementById('loginBtn');
  const loginBtnMobile = document.getElementById('loginBtnMobile');
  const getStartedBtn = document.getElementById('getStartedBtn');
  const closeModal = document.getElementById('closeModal');
  const toggleForm = document.getElementById('toggleForm');
  const modalTitle = document.getElementById('modalTitle');
  const submitButton = document.getElementById('submitButton');
  const loginOnlyElements = document.querySelectorAll(".login-only");
  const signupOnlyElements = document.querySelectorAll(".signup-only");
  const mobileMenuButton = document.getElementById('mobileMenuButton');
  const mobileMenu = document.getElementById('mobileMenu');

  // Mobile menu toggle
  if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener('click', () => {
          mobileMenu.classList.toggle('hidden');
      });
  }

  // Toggle between login and signup forms
  const toggleFormType = () => {
      isLoginForm = !isLoginForm;
      modalTitle.textContent = isLoginForm ? "Login" : "Create Account";
      submitButton.textContent = isLoginForm ? "Login" : "Sign Up";
      
      loginOnlyElements.forEach((el) => el.classList.toggle("hidden"));
      signupOnlyElements.forEach((el) => el.classList.toggle("hidden"));
      
      const signupFields = loginForm.querySelectorAll(".signup-only input");
      signupFields.forEach((field) => {
          field.required = !isLoginForm;
      });
  };

  // Show login modal
  const showLoginModal = () => {
      loginModal.style.display = "block";
      document.body.classList.add("modal-open");
      if (!isLoginForm) toggleFormType();
  };

  // Show signup modal
  const showSignupModal = () => {
      loginModal.style.display = "block";
      document.body.classList.add("modal-open");
      if (isLoginForm) toggleFormType();
  };

  // Login function
  const login = (email, name) => {
      isLoggedIn = true;
      currentUser = { email, name };
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      updateAuthUI();
      loginModal.style.display = 'none';
      document.body.classList.remove("modal-open");
  };

  // Logout function
  const logout = () => {
      isLoggedIn = false;
      currentUser = null;
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('currentUser');
      updateAuthUI();
  };

  // Create profile dropdown
  const createProfileDropdown = (isMobile = false) => {
      const dropdown = document.createElement('div');
      dropdown.className = isMobile ? 'mobile-profile-dropdown' : 'profile-dropdown';
      dropdown.id = isMobile ? 'profileDropdownMobile' : 'profileDropdown';
      dropdown.classList.add('hidden', 'z-50', 'shadow-lg');
      
      dropdown.innerHTML = `
          <a href="profile.html" class="block px-4 py-2 text-gray-300 hover:bg-gray-700">Profile</a>
          <a href="dash.html" class="block px-4 py-2 text-gray-300 hover:bg-gray-700">Dashboard</a>
          <a href="#" class="logout-btn block px-4 py-2 text-gray-300 hover:bg-gray-700">Logout</a>
      `;
      
      // Add logout handler
      dropdown.querySelector('.logout-btn').addEventListener('click', (e) => {
          e.preventDefault();
          logout();
      });
      
      return dropdown;
  };

  // Update UI based on auth state
  function updateAuthUI() {
      if (isLoggedIn && currentUser) {
          // Desktop profile
          authSection.innerHTML = `
              <div class="relative">
                  <button id="profileBtn" class="flex items-center space-x-2 focus:outline-none">
                      <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                          ${currentUser.name.charAt(0).toUpperCase()}
                      </div>
                      <span class="text-white hidden md:inline">${currentUser.name}</span>
                  </button>
              </div>
          `;
          
          // Mobile profile
          authSectionMobile.innerHTML = `
              <div class="relative">
                  <button id="profileBtnMobile" class="flex items-center space-x-2 focus:outline-none w-full justify-center py-2">
                      <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                          ${currentUser.name.charAt(0).toUpperCase()}
                      </div>
                      <span class="text-white">${currentUser.name}</span>
                  </button>
              </div>
          `;
          
          // Add dropdown functionality for desktop
          const profileBtn = document.getElementById('profileBtn');
          if (profileBtn) {
              const dropdown = createProfileDropdown();
              profileBtn.parentNode.appendChild(dropdown);
              
              profileBtn.addEventListener('click', (e) => {
                  e.stopPropagation();
                  dropdown.classList.toggle('hidden');
                  // Close mobile dropdown if open
                  const mobileDropdown = document.getElementById('profileDropdownMobile');
                  if (mobileDropdown) mobileDropdown.classList.add('hidden');
              });
          }
          
          // Add dropdown functionality for mobile
          const profileBtnMobile = document.getElementById('profileBtnMobile');
          if (profileBtnMobile) {
              const dropdownMobile = createProfileDropdown(true);
              profileBtnMobile.parentNode.appendChild(dropdownMobile);
              
              profileBtnMobile.addEventListener('click', (e) => {
                  e.stopPropagation();
                  dropdownMobile.classList.toggle('hidden');
                  // Close desktop dropdown if open
                  const desktopDropdown = document.getElementById('profileDropdown');
                  if (desktopDropdown) desktopDropdown.classList.add('hidden');
              });
          }
      } else {
          // Desktop login button
          authSection.innerHTML = `
              <button id="loginBtn" class="bg-primary text-white px-4 py-2 !rounded-button hover:bg-primary/90 whitespace-nowrap">
                  Login
              </button>
          `;
          
          // Mobile login button
          authSectionMobile.innerHTML = `
              <button id="loginBtnMobile" class="bg-primary text-white px-4 py-2 !rounded-button hover:bg-primary/90 w-full">
                  Login
              </button>
          `;
          
          // Add event listeners to new buttons
          document.getElementById('loginBtn')?.addEventListener('click', showLoginModal);
          document.getElementById('loginBtnMobile')?.addEventListener('click', showLoginModal);
      }
  }

  // Event Listeners
  toggleForm?.addEventListener('click', (e) => {
      e.preventDefault();
      toggleFormType();
  });

  loginBtn?.addEventListener('click', showLoginModal);
  loginBtnMobile?.addEventListener('click', showLoginModal);
  getStartedBtn?.addEventListener('click', showSignupModal);

  closeModal?.addEventListener('click', () => {
      loginModal.style.display = "none";
      document.body.classList.remove("modal-open");
  });

  window.addEventListener('click', (e) => {
      // Close modal when clicking outside
      if (e.target === loginModal) {
          loginModal.style.display = "none";
          document.body.classList.remove("modal-open");
      }
      
      // Close dropdowns when clicking outside
      const dropdowns = document.querySelectorAll('[id^="profileDropdown"]');
      dropdowns.forEach(dropdown => {
          if (!dropdown.contains(e.target)) {
              const profileBtn = document.getElementById(
                  dropdown.id === 'profileDropdown' ? 'profileBtn' : 'profileBtnMobile'
              );
              if (profileBtn && !profileBtn.contains(e.target)) {
                  dropdown.classList.add('hidden');
              }
          }
      });
  });

  // Form Submission
  loginForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Clear previous errors
      document.querySelectorAll(".form-error").forEach(error => error.remove());
      
      const formData = new FormData(loginForm);
      const data = Object.fromEntries(formData);
      
      if (!isLoginForm) {
          // Signup validation
          if (data.password !== data.confirmPassword) {
              const errorDiv = document.createElement("div");
              errorDiv.className = "form-error";
              errorDiv.textContent = "Passwords do not match";
              loginForm.querySelector("input[name='confirmPassword']").parentNode.appendChild(errorDiv);
              return;
          }
          
          if (!data.fullName) {
              const errorDiv = document.createElement("div");
              errorDiv.className = "form-error";
              errorDiv.textContent = "Full name is required";
              loginForm.querySelector("input[name='fullName']").parentNode.appendChild(errorDiv);
              return;
          }
      }
      
      // For demo purposes
      const name = isLoginForm ? (currentUser?.name || "User") : data.fullName;
      login(data.email, name);
  });

  // Initialize
  updateAuthUI();
});
