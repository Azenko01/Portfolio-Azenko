// Projects page specific functionality

// Project filtering functionality
class ProjectFilter {
  constructor() {
    this.filterButtons = document.querySelectorAll(".filter-btn")
    this.projectCards = document.querySelectorAll(".project-card")
    this.init()
  }

  init() {
    this.filterButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        this.handleFilterClick(e.target)
      })
    })
  }

  handleFilterClick(button) {
    // Update active button
    this.filterButtons.forEach((btn) => btn.classList.remove("active"))
    button.classList.add("active")

    const filterValue = button.getAttribute("data-filter")
    this.filterProjects(filterValue)
  }

  filterProjects(filter) {
    this.projectCards.forEach((card, index) => {
      const category = card.getAttribute("data-category")
      const shouldShow = filter === "all" || category === filter

      if (shouldShow) {
        card.style.display = "block"
        card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s both`
      } else {
        card.style.display = "none"
      }
    })

    // Update project count
    this.updateProjectCount(filter)
  }

  updateProjectCount(filter) {
    const visibleProjects = Array.from(this.projectCards).filter((card) => {
      const category = card.getAttribute("data-category")
      return filter === "all" || category === filter
    })

    // You can add a project counter here if needed
    console.log(`Showing ${visibleProjects.length} projects`)
  }
}

// Project search functionality
class ProjectSearch {
  constructor() {
    this.searchInput = this.createSearchInput()
    this.projectCards = document.querySelectorAll(".project-card")
    this.init()
  }

  createSearchInput() {
    const searchContainer = document.createElement("div")
    searchContainer.className = "project-search"
    searchContainer.innerHTML = `
            <div class="search-box">
                <input type="text" placeholder="Search projects..." id="projectSearch">
                <i class="fas fa-search"></i>
            </div>
        `

    const filtersSection = document.querySelector(".project-filters .container")
    filtersSection.appendChild(searchContainer)

    return document.getElementById("projectSearch")
  }

  init() {
    this.searchInput.addEventListener("input", (e) => {
      this.handleSearch(e.target.value)
    })
  }

  handleSearch(searchTerm) {
    const term = searchTerm.toLowerCase()

    this.projectCards.forEach((card) => {
      const title = card.querySelector("h3").textContent.toLowerCase()
      const description = card.querySelector("p").textContent.toLowerCase()
      const category = card.querySelector(".project-category").textContent.toLowerCase()
      const tech = Array.from(card.querySelectorAll(".project-tech span"))
        .map((span) => span.textContent.toLowerCase())
        .join(" ")

      const matches =
        title.includes(term) || description.includes(term) || category.includes(term) || tech.includes(term)

      if (matches) {
        card.style.display = "block"
        card.style.animation = "fadeInUp 0.5s ease both"
      } else {
        card.style.display = "none"
      }
    })
  }
}

// Project card animations
class ProjectAnimations {
  constructor() {
    this.init()
  }

  init() {
    this.addHoverEffects()
    this.addScrollAnimations()
  }

  addHoverEffects() {
    const projectCards = document.querySelectorAll(".project-card")

    projectCards.forEach((card) => {
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

  addScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in")
          }
        })
      },
      { threshold: 0.1 },
    )

    document.querySelectorAll(".project-card").forEach((card) => {
      observer.observe(card)
    })
  }
}

// Project statistics counter
class ProjectStatsCounter {
  constructor() {
    this.counters = document.querySelectorAll(".project-stats-section .stat-number")
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
    const text = element.textContent
    const hasPlus = text.includes("+")
    const hasPercent = text.includes("%")
    const targetValue = Number.parseInt(text.replace(/[+%]/g, ""))

    if (isNaN(targetValue)) return

    const duration = 2000
    const increment = targetValue / (duration / 16)
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= targetValue) {
        current = targetValue
        clearInterval(timer)
      }

      let displayValue = Math.floor(current)
      if (hasPlus) displayValue += "+"
      if (hasPercent) displayValue += "%"

      element.textContent = displayValue
    }, 16)
  }
}

// Initialize all project page functionality
document.addEventListener("DOMContentLoaded", () => {
  new ProjectFilter()
  new ProjectSearch()
  new ProjectAnimations()
  new ProjectStatsCounter()

  // Add custom CSS for project page
  const style = document.createElement("style")
  style.textContent = `
        .projects-hero {
            padding: 8rem 0 4rem;
            background: var(--gradient-hero);
            text-align: center;
        }

        .hero-title {
            font-size: var(--font-size-5xl);
            font-weight: 800;
            color: var(--text-primary);
            margin-bottom: 1rem;
        }

        .hero-description {
            font-size: var(--font-size-lg);
            color: var(--text-secondary);
            max-width: 600px;
            margin: 0 auto;
        }

        .project-filters {
            padding: 2rem 0;
            background: var(--bg-secondary);
        }

        .filter-buttons {
            display: flex;
            justify-content: center;
            gap: 1rem;
            flex-wrap: wrap;
            margin-bottom: 2rem;
        }

        .filter-btn {
            padding: 0.75rem 1.5rem;
            border: 2px solid var(--border-color);
            background: var(--bg-card);
            color: var(--text-secondary);
            border-radius: var(--radius-full);
            font-weight: 500;
            cursor: pointer;
            transition: all var(--transition-base);
        }

        .filter-btn:hover,
        .filter-btn.active {
            background: var(--primary-color);
            color: var(--text-white);
            border-color: var(--primary-color);
            transform: translateY(-2px);
        }

        .project-search {
            max-width: 400px;
            margin: 0 auto;
        }

        .search-box {
            position: relative;
        }

        .search-box input {
            width: 100%;
            padding: 1rem 3rem 1rem 1rem;
            border: 2px solid var(--border-color);
            border-radius: var(--radius-lg);
            background: var(--bg-card);
            color: var(--text-primary);
            font-size: var(--font-size-base);
        }

        .search-box i {
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-secondary);
        }

        .projects-section {
            padding: 4rem 0;
        }

        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
        }

        .project-stats {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid var(--border-light);
        }

        .project-stats .stat {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: var(--font-size-sm);
            color: var(--text-secondary);
        }

        .project-stats .stat i {
            color: var(--primary-color);
        }

        .project-stats-section {
            padding: 4rem 0;
            background: var(--bg-secondary);
        }

        .project-stats-section .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
        }

        .project-stats-section .stat-item {
            text-align: center;
            padding: 2rem;
            background: var(--bg-card);
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-md);
        }

        .project-stats-section .stat-number {
            font-size: var(--font-size-4xl);
            font-weight: 800;
            color: var(--primary-color);
            margin-bottom: 0.5rem;
        }

        .project-stats-section .stat-label {
            color: var(--text-secondary);
            font-weight: 500;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .project-card.animate-in {
            animation: fadeInUp 0.6s ease both;
        }

        @media (max-width: 768px) {
            .hero-title {
                font-size: var(--font-size-4xl);
            }

            .filter-buttons {
                gap: 0.5rem;
            }

            .filter-btn {
                padding: 0.5rem 1rem;
                font-size: var(--font-size-sm);
            }

            .projects-grid {
                grid-template-columns: 1fr;
                gap: 1.5rem;
            }
        }
    `
  document.head.appendChild(style)
})
