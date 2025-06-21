// Enhanced Portfolio JavaScript with all improvements

// Global Variables
const typingIndex = 0
const typingSpeed = 100
const erasingSpeed = 50
const newTextDelay = 2000
let typewriterTimeout

const typingTexts = ["Frontend Developer", "React Specialist", "UI/UX Enthusiast", "Problem Solver", "Code Craftsman"]

// Theme Management
class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById("themeToggle")
    this.body = document.body
    this.themeIcon = this.themeToggle?.querySelector("i")
    this.currentTheme = localStorage.getItem("theme") || "light"

    this.init()
  }

  init() {
    this.setTheme(this.currentTheme)
    this.themeToggle?.addEventListener("click", () => this.toggleTheme())
  }

  setTheme(theme) {
    this.body.setAttribute("data-theme", theme)
    this.updateThemeIcon(theme)
    localStorage.setItem("theme", theme)
    this.currentTheme = theme
  }

  toggleTheme() {
    const newTheme = this.currentTheme === "dark" ? "light" : "dark"
    this.setTheme(newTheme)
  }

  updateThemeIcon(theme) {
    if (!this.themeIcon) return

    if (theme === "dark") {
      this.themeIcon.className = "fas fa-sun"
    } else {
      this.themeIcon.className = "fas fa-moon"
    }
  }
}

// Navigation Manager
class NavigationManager {
  constructor() {
    this.navbar = document.getElementById("navbar")
    this.hamburger = document.getElementById("hamburger")
    this.navMenu = document.getElementById("navMenu")
    this.navLinks = document.querySelectorAll(".nav-link")

    this.init()
  }

  init() {
    this.handleScroll()
    this.handleMobileMenu()
    this.highlightActiveLink()

    window.addEventListener("scroll", () => this.handleScroll())
  }

  handleScroll() {
    if (window.scrollY > 100) {
      this.navbar?.classList.add("scrolled")
    } else {
      this.navbar?.classList.remove("scrolled")
    }
  }

  handleMobileMenu() {
    this.hamburger?.addEventListener("click", () => {
      this.hamburger.classList.toggle("active")
      this.navMenu?.classList.toggle("active")
    })

    // Close mobile menu when clicking on links
    this.navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        this.hamburger?.classList.remove("active")
        this.navMenu?.classList.remove("active")
      })
    })

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!this.navbar?.contains(e.target)) {
        this.hamburger?.classList.remove("active")
        this.navMenu?.classList.remove("active")
      }
    })
  }

  highlightActiveLink() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html"

    this.navLinks.forEach((link) => {
      link.classList.remove("active")
      const linkHref = link.getAttribute("href")

      if (
        linkHref === currentPage ||
        (currentPage === "" && linkHref === "index.html") ||
        (currentPage === "index.html" && linkHref === "index.html")
      ) {
        link.classList.add("active")
      }
    })
  }
}

// Typewriter Effect
class TypewriterEffect {
  constructor(element, texts) {
    this.element = element
    this.texts = texts
    this.textIndex = 0
    this.charIndex = 0
    this.isDeleting = false
    this.typeSpeed = 100
    this.deleteSpeed = 50
    this.pauseDelay = 2000

    if (this.element) {
      this.type()
    }
  }

  type() {
    const currentText = this.texts[this.textIndex]

    if (this.isDeleting) {
      this.element.textContent = currentText.substring(0, this.charIndex - 1)
      this.charIndex--
    } else {
      this.element.textContent = currentText.substring(0, this.charIndex + 1)
      this.charIndex++
    }

    let typeSpeed = this.isDeleting ? this.deleteSpeed : this.typeSpeed

    if (!this.isDeleting && this.charIndex === currentText.length) {
      typeSpeed = this.pauseDelay
      this.isDeleting = true
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false
      this.textIndex = (this.textIndex + 1) % this.texts.length
      typeSpeed = 500
    }

    setTimeout(() => this.type(), typeSpeed)
  }
}

// Counter Animation
class CounterAnimation {
  constructor() {
    this.counters = document.querySelectorAll(".stat-number")
    this.init()
  }

  init() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateCounter(entry.target)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 },
    )

    this.counters.forEach((counter) => observer.observe(counter))
  }

  animateCounter(element) {
    const target = Number.parseInt(element.getAttribute("data-count"))
    const duration = 2000
    const increment = target / (duration / 16)
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(timer)
      }
      element.textContent = Math.floor(current)
    }, 16)
  }
}

// Scroll to Top Button
class ScrollToTop {
  constructor() {
    this.button = document.getElementById("scrollToTop")
    this.init()
  }

  init() {
    if (!this.button) return

    window.addEventListener("scroll", () => this.toggleVisibility())
    this.button.addEventListener("click", () => this.scrollToTop())
  }

  toggleVisibility() {
    if (window.pageYOffset > 300) {
      this.button.classList.add("visible")
    } else {
      this.button.classList.remove("visible")
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }
}

// Project Modal Manager
class ProjectModalManager {
  constructor() {
    this.modal = document.getElementById("projectModal")
    this.modalBody = document.getElementById("modalBody")
    this.projectData = this.getProjectData()

    this.init()
  }

  init() {
    // Close modal when clicking outside
    this.modal?.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.closeModal()
      }
    })

    // Close modal with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal?.style.display === "block") {
        this.closeModal()
      }
    })
  }

  openModal(projectId) {
    if (!this.modal || !this.modalBody) return

    const project = this.projectData[projectId]
    if (!project) return

    this.modalBody.innerHTML = this.generateModalContent(project)
    this.modal.style.display = "block"
    document.body.style.overflow = "hidden"
  }

  closeModal() {
    if (!this.modal) return

    this.modal.style.display = "none"
    document.body.style.overflow = "auto"
  }

  generateModalContent(project) {
    return `
            <div class="project-modal-header">
                <img src="${project.image}" alt="${project.title}" class="modal-project-image">
                <div class="modal-project-info">
                    <div class="project-category">${project.category}</div>
                    <h2>${project.title}</h2>
                    <p class="project-description">${project.description}</p>
                </div>
            </div>
            
            <div class="project-modal-content">
                <div class="project-details">
                    <h3>Key Features</h3>
                    <ul class="feature-list">
                        ${project.features.map((feature) => `<li>${feature}</li>`).join("")}
                    </ul>
                    
                    <h3>Technologies Used</h3>
                    <div class="tech-stack">
                        ${project.technologies.map((tech) => `<span class="tech-tag">${tech}</span>`).join("")}
                    </div>
                    
                    <h3>Project Highlights</h3>
                    <p>${project.highlights}</p>
                </div>
                
                <div class="project-actions">
                    <a href="${project.github}" class="btn btn-primary" target="_blank">
                        <i class="fab fa-github"></i> View on GitHub
                    </a>
                    ${
                      project.demo
                        ? `<a href="${project.demo}" class="btn btn-secondary" target="_blank">
                        <i class="fas fa-external-link-alt"></i> Live Demo
                    </a>`
                        : ""
                    }
                </div>
            </div>
        `
  }

  getProjectData() {
    return {
      pizza: {
        title: "Pizza Landing",
        category: "Landing Page",
        description:
          "A modern, responsive landing page for a pizza restaurant featuring interactive menu, smooth animations, and optimized user experience.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Pizza-landing-pPP2EycLJtCQ2YbWWBOc0nwJZLqNWW.png",
        features: [
          "Responsive design that works on all devices",
          "Interactive menu with filtering and search",
          "Smooth scroll animations and transitions",
          "Contact form with validation",
          "Modern UI/UX design principles",
          "Optimized performance and loading speed",
        ],
        technologies: ["HTML5", "CSS3", "JavaScript ES6+", "Responsive Design", "CSS Animations"],
        highlights:
          "This project showcases modern web development techniques with a focus on user experience and performance. The interactive menu system and smooth animations create an engaging experience for visitors.",
        github: "https://github.com/Azenko01/Pizza-landing",
        demo: null,
      },
      arena: {
        title: "Arena Battle PvP",
        category: "Game Development",
        description:
          "An online multiplayer PvP game built with WebSocket technology for real-time gameplay and interactive combat mechanics.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Arena%20Battle%20PvP-8PR3lOlIRZtMEp16MP7I7zVl2IxhLA.png",
        features: [
          "Real-time multiplayer gameplay using WebSocket",
          "Interactive combat system with animations",
          "Player matchmaking and lobby system",
          "Live game state synchronization",
          "Responsive game interface",
          "Score tracking and leaderboards",
        ],
        technologies: ["WebSocket", "JavaScript ES6+", "HTML5 Canvas", "CSS3", "Node.js", "Real-time Communication"],
        highlights:
          "This project demonstrates advanced real-time web technologies and game development concepts. The WebSocket implementation ensures smooth, lag-free multiplayer experience.",
        github: "https://github.com/Azenko01/Arena-Battle-PvP-Mini-Game-with-WebSocket",
        demo: null,
      },
      techstore: {
        title: "TechStore",
        category: "E-commerce",
        description:
          "A comprehensive e-commerce website for electronics featuring product catalog, shopping cart functionality, and advanced filtering options.",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TechStore-XSeKpnQumsfSUkI0kZdLkYpBJYuzsH.png",
        features: [
          "Product catalog with detailed views",
          "Shopping cart and checkout process",
          "Advanced filtering and search functionality",
          "User reviews and ratings system",
          "Responsive design for all devices",
          "Local storage for cart persistence",
        ],
        technologies: ["JavaScript ES6+", "CSS3", "HTML5", "Local Storage", "JSON", "Responsive Design"],
        highlights:
          "This e-commerce project showcases complex state management and user interaction patterns. The filtering system and cart functionality demonstrate practical JavaScript applications.",
        github: "https://github.com/Azenko01/TechStore",
        demo: null,
      },
      coffee: {
        title: "Coffee Landing",
        category: "Landing Page",
        description:
          "Elegant coffee shop landing page with warm design, showcasing artisan coffee experience and brand storytelling.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Coffee%20Landing.jpg-QIMUlhnZRwEcwybiuy19JjrFron1ID.jpeg",
        features: [
          "Warm, inviting design with coffee-themed aesthetics",
          "Brand storytelling and experience focus",
          "Statistics showcase (varieties, rating, experience)",
          "Responsive layout with modern typography",
          "Call-to-action buttons for menu and story",
          "Professional coffee shop branding",
        ],
        technologies: ["HTML5", "SCSS", "JavaScript", "Responsive Design", "CSS Animations"],
        highlights:
          "This project demonstrates sophisticated design principles with a focus on brand experience and emotional connection. The warm color palette and typography create an inviting atmosphere perfect for a premium coffee brand.",
        github: "https://github.com/Azenko01/coffee-landing",
        demo: null,
      },
      liveroom: {
        title: "LiveRoom Chat",
        category: "Web Application",
        description:
          "Real-time chat application with modern UI, featuring instant messaging, user presence, and beautiful gradient design.",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LiveRoom-XHvG276SpfFeCV0x7LOBm9j3WJECcO.png",
        features: [
          "Real-time messaging with instant delivery",
          "Modern dark theme chat interface",
          "User presence and typing indicators",
          "Beautiful gradient background design",
          "Responsive chat layout",
          "Clean and intuitive user experience",
        ],
        technologies: ["HTML5", "CSS3", "JavaScript", "WebSocket", "Real-time Communication"],
        highlights:
          "This chat application showcases real-time web technologies with a focus on user experience. The modern interface design and smooth interactions create an engaging communication platform.",
        github: "https://github.com/Azenko01/LiveRoom",
        demo: null,
      },
    }
  }
}

// Preloader Manager
class PreloaderManager {
  constructor() {
    this.preloader = document.getElementById("preloader")
    this.init()
  }

  init() {
    window.addEventListener("load", () => {
      setTimeout(() => {
        this.hidePreloader()
      }, 1000)
    })
  }

  hidePreloader() {
    if (this.preloader) {
      this.preloader.style.opacity = "0"
      setTimeout(() => {
        this.preloader.style.display = "none"
      }, 500)
    }
  }
}

// Smooth Scrolling for Anchor Links
class SmoothScroll {
  constructor() {
    this.init()
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault()
        const target = document.querySelector(anchor.getAttribute("href"))
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      })
    })
  }
}

// Download Resume Functionality
class ResumeDownloader {
  constructor() {
    this.downloadBtn = document.getElementById("downloadResume")
    this.init()
  }

  init() {
    this.downloadBtn?.addEventListener("click", (e) => {
      e.preventDefault()
      this.downloadResume()
    })
  }

  downloadResume() {
    // Create a simple resume content
    const resumeContent = this.generateResumeContent()
    const blob = new Blob([resumeContent], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "Oleksandr_Azenko_Resume.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    // Show success message
    this.showDownloadSuccess()
  }

  generateResumeContent() {
    return `
OLEKSANDR AZENKO
Frontend Developer

Contact Information:
Email: azenko0609@gmail.com
Phone: +48 720 866 592
GitHub: https://github.com/Azenko01
Location: Poland

SUMMARY:
Passionate Frontend Developer with 2+ years of experience in creating modern, responsive web applications. Specialized in HTML5, CSS3, JavaScript, and React. Strong focus on user experience and performance optimization.

TECHNICAL SKILLS:
• Frontend: HTML5, CSS3, JavaScript ES6+, React, SASS
• Backend: WebSocket, PHP, MySQL
• Tools: Git, GitHub, VS Code, Chrome DevTools
• Design: Responsive Design, UI/UX Principles, Figma

PROJECTS:
1. Pizza Landing Page
   - Responsive restaurant landing page with interactive menu
   - Technologies: HTML5, CSS3, JavaScript
   - GitHub: https://github.com/Azenko01/Pizza-landing

2. Arena Battle PvP Game
   - Online multiplayer game with real-time WebSocket communication
   - Technologies: WebSocket, JavaScript, HTML5 Canvas
   - GitHub: https://github.com/Azenko01/Arena-Battle-PvP-Mini-Game-with-WebSocket

3. TechStore E-commerce
   - Full-featured e-commerce website for electronics
   - Technologies: JavaScript, CSS3, HTML5, Local Storage
   - GitHub: https://github.com/Azenko01/TechStore

4. LiveRoom Chat Application
   - Real-time chat application with modern UI
   - Technologies: HTML5, CSS3, JavaScript
   - GitHub: https://github.com/Azenko01/LiveRoom

5. Coffee Landing Page
   - Elegant coffee shop landing with animations
   - Technologies: HTML5, SCSS, JavaScript
   - GitHub: https://github.com/Azenko01/coffee-landing

EXPERIENCE:
Frontend Developer (2022 - Present)
• Developed responsive web applications using modern technologies
• Collaborated with design teams to implement pixel-perfect UIs
• Optimized application performance and user experience
• Maintained clean, well-documented code following best practices

EDUCATION:
Self-taught Developer
Continuous learning through online courses, documentation, and practical projects

LANGUAGES:
• Ukrainian (Native)
• English (Intermediate)
• Polish (Basic)

INTERESTS:
Web Development, UI/UX Design, Gaming, Technology Trends
        `.trim()
  }

  showDownloadSuccess() {
    const originalText = this.downloadBtn.innerHTML
    this.downloadBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded!'
    this.downloadBtn.style.background = "var(--success-color)"

    setTimeout(() => {
      this.downloadBtn.innerHTML = originalText
      this.downloadBtn.style.background = ""
    }, 2000)
  }
}

// Global Modal Functions (for backward compatibility)
function openProjectModal(projectId) {
  window.projectModalManager?.openModal(projectId)
}

function closeProjectModal() {
  window.projectModalManager?.closeModal()
}

// Додати в кінець файлу функцію для ініціалізації skill progress bars
function initSkillProgressBars() {
  const progressBars = document.querySelectorAll(".progress-bar")

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const progressBar = entry.target
          const width = progressBar.getAttribute("data-width")
          progressBar.style.width = width
          observer.unobserve(progressBar)
        }
      })
    },
    { threshold: 0.5 },
  )

  progressBars.forEach((bar) => observer.observe(bar))
}

// Initialize Everything
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all managers
  window.themeManager = new ThemeManager()
  window.navigationManager = new NavigationManager()
  window.projectModalManager = new ProjectModalManager()
  new PreloaderManager()
  new CounterAnimation()
  new ScrollToTop()
  new SmoothScroll()
  new ResumeDownloader()

  // Initialize typewriter effect
  const typingElement = document.getElementById("typingText")
  if (typingElement) {
    new TypewriterEffect(typingElement, typingTexts)
  }

  // Initialize AOS (Animate On Scroll)
  const AOS = window.AOS // Declare AOS variable here
  if (AOS) {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: "ease-out-cubic",
    })
  }

  // Add custom styles for modal content
  const modalStyles = document.createElement("style")
  modalStyles.textContent = `
        .project-modal-header {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin-bottom: 2rem;
            align-items: start;
        }
        
        .modal-project-image {
            width: 100%;
            height: 250px;
            object-fit: cover;
            border-radius: var(--radius-lg);
        }
        
        .modal-project-info .project-category {
            color: var(--primary-color);
            font-size: var(--font-size-sm);
            font-weight: 600;
            text-transform: uppercase;
            margin-bottom: 0.5rem;
        }
        
        .modal-project-info h2 {
            font-size: var(--font-size-2xl);
            font-weight: 700;
            margin-bottom: 1rem;
            color: var(--text-primary);
        }
        
        .project-description {
            color: var(--text-secondary);
            line-height: 1.6;
        }
        
        .project-modal-content h3 {
            color: var(--text-primary);
            font-size: var(--font-size-lg);
            font-weight: 600;
            margin: 2rem 0 1rem;
        }
        
        .feature-list {
            list-style: none;
            margin-bottom: 2rem;
        }
        
        .feature-list li {
            padding: 0.5rem 0;
            color: var(--text-secondary);
            position: relative;
            padding-left: 1.5rem;
        }
        
        .feature-list li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: var(--success-color);
            font-weight: bold;
        }
        
        .tech-stack {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 2rem;
        }
        
        .tech-tag {
            background: var(--gradient-primary);
            color: var(--text-white);
            padding: 0.25rem 0.75rem;
            border-radius: var(--radius-full);
            font-size: var(--font-size-sm);
            font-weight: 500;
        }
        
        .project-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid var(--border-color);
        }
        
        @media (max-width: 768px) {
            .project-modal-header {
                grid-template-columns: 1fr;
                gap: 1rem;
            }
            
            .project-actions {
                flex-direction: column;
            }
        }
    `
  document.head.appendChild(modalStyles)

  // Console welcome message
  console.log(`
🚀 Welcome to Oleksandr Azenko's Enhanced Portfolio!
📧 Contact: azenko0609@gmail.com
📱 Phone: +48 720 866 592
🔗 GitHub: https://github.com/Azenko01
💼 Looking for a Frontend Developer? Let's connect!

✨ Features:
• Dark/Light theme toggle
• Responsive design
• Smooth animations
• Interactive project modals
• Resume download
• Modern UI/UX
    `)

  initSkillProgressBars()
})

// Performance optimization
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => console.log("SW registered"))
      .catch((registrationError) => console.log("SW registration failed"))
  })
}

// Error handling for images
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", function () {
      this.src = "/placeholder.svg?height=200&width=300&text=Image+Not+Found"
      this.alt = "Image not available"
    })
  })
})
