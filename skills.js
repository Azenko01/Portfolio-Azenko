// Skills page specific functionality
class SkillsAnimations {
  constructor() {
    this.init()
  }

  init() {
    this.animateProgressBars()
    this.animateSkillCards()
    this.animateLearningProgress()
    this.addSkillInteractions()
  }

  animateProgressBars() {
    const progressBars = document.querySelectorAll(".progress-bar")

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const progressBar = entry.target
            const width = progressBar.getAttribute("data-width")
            setTimeout(() => {
              progressBar.style.width = width
            }, 200)
            observer.unobserve(progressBar)
          }
        })
      },
      { threshold: 0.5 },
    )

    progressBars.forEach((bar) => observer.observe(bar))
  }

  animateSkillCards() {
    const skillCards = document.querySelectorAll(".skill-card")

    skillCards.forEach((card, index) => {
      // Add stagger animation on load
      setTimeout(() => {
        card.style.opacity = "1"
        card.style.transform = "translateY(0)"
      }, index * 100)

      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-10px) scale(1.02)"
        card.style.boxShadow = "var(--shadow-xl)"
      })

      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0) scale(1)"
        card.style.boxShadow = "var(--shadow-md)"
      })
    })
  }

  animateLearningProgress() {
    const learningCards = document.querySelectorAll(".learning-card")

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              const progressBar = entry.target.querySelector(".progress")
              if (progressBar) {
                const width = progressBar.style.width
                progressBar.style.width = "0%"
                setTimeout(() => {
                  progressBar.style.width = width
                }, 100)
              }
            }, index * 200)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 },
    )

    learningCards.forEach((card) => observer.observe(card))
  }

  addSkillInteractions() {
    // Add click to expand functionality
    const skillCards = document.querySelectorAll(".skill-card")

    skillCards.forEach((card) => {
      card.addEventListener("click", () => {
        card.classList.toggle("expanded")

        if (card.classList.contains("expanded")) {
          card.style.transform = "scale(1.05)"
          card.style.zIndex = "10"
        } else {
          card.style.transform = "scale(1)"
          card.style.zIndex = "1"
        }
      })
    })
  }
}

// Skill level calculator
class SkillLevelCalculator {
  constructor() {
    this.skillLevels = {
      HTML5: 95,
      CSS3: 90,
      JavaScript: 88,
      React: 80,
      SASS: 85,
      WebSocket: 75,
      PHP: 65,
      MySQL: 70,
      Git: 85,
    }
    this.init()
  }

  init() {
    this.updateProgressBars()
    this.addSkillTooltips()
  }

  updateProgressBars() {
    Object.entries(this.skillLevels).forEach(([skill, level]) => {
      const skillCard = Array.from(document.querySelectorAll(".skill-card")).find(
        (card) => card.querySelector("h3").textContent === skill,
      )

      if (skillCard) {
        const progressBar = skillCard.querySelector(".progress-bar")
        if (progressBar) {
          progressBar.setAttribute("data-width", `${level}%`)
        }
      }
    })
  }

  addSkillTooltips() {
    const skillCards = document.querySelectorAll(".skill-card")

    skillCards.forEach((card) => {
      const skillName = card.querySelector("h3").textContent
      const level = this.skillLevels[skillName]

      if (level) {
        card.setAttribute("title", `${skillName}: ${level}% proficiency`)
      }
    })
  }
}

// Initialize skills page functionality
document.addEventListener("DOMContentLoaded", () => {
  new SkillsAnimations()
  new SkillLevelCalculator()

  // Add custom CSS for skills page
  const style = document.createElement("style")
  style.textContent = `
        .skill-card {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .skill-card.expanded {
            box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.4);
            border: 2px solid var(--primary-color);
        }
        
        .progress-bar {
            position: relative;
            overflow: hidden;
        }
        
        .progress-bar::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        
        .learning-card {
            position: relative;
            overflow: hidden;
        }
        
        .learning-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: conic-gradient(from 0deg, transparent, var(--primary-color), transparent);
            animation: rotate 4s linear infinite;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .learning-card:hover::before {
            opacity: 0.1;
        }
        
        @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `
  document.head.appendChild(style)
})
