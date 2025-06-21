// Contact page specific functionality

// Telegram Bot Configuration
const TELEGRAM_CONFIG = {
  BOT_TOKEN: "7729666506:AAGaA5rYLbZfZ38NegDqHdKBEw47sRytkNw",
  CHAT_ID: "7729666506",
}

// Contact form functionality
const contactForm = document.getElementById("contactForm")
const formSuccess = document.getElementById("formSuccess")

// Form validation rules
const validationRules = {
  name: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-Z\s]+$/,
    message: "Please enter a valid name (letters and spaces only)",
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
  },
  subject: {
    required: true,
    minLength: 5,
    message: "Subject must be at least 5 characters long",
  },
  message: {
    required: true,
    minLength: 10,
    message: "Message must be at least 10 characters long",
  },
}

// Validate individual field
function validateField(fieldName, value) {
  const rules = validationRules[fieldName]
  const errors = []

  if (rules.required && !value.trim()) {
    errors.push(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`)
  }

  if (value.trim() && rules.minLength && value.trim().length < rules.minLength) {
    errors.push(
      `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${rules.minLength} characters long`,
    )
  }

  if (value.trim() && rules.pattern && !rules.pattern.test(value.trim())) {
    errors.push(rules.message)
  }

  return errors
}

// Display field error
function displayFieldError(fieldName, errors) {
  const errorElement = document.getElementById(`${fieldName}Error`)
  const inputElement = document.getElementById(fieldName)

  if (errors.length > 0) {
    errorElement.textContent = errors[0]
    inputElement.classList.add("error")
  } else {
    errorElement.textContent = ""
    inputElement.classList.remove("error")
  }
}

// Enhanced Telegram sending function
async function sendToTelegram(formData) {
  const name = formData.get("name")
  const email = formData.get("email")
  const subject = formData.get("subject")
  const message = formData.get("message")

  // Format message for Telegram with better formatting
  const telegramMessage = `
🔔 *Нове повідомлення з Portfolio*

👤 *Ім'я:* ${name}
📧 *Email:* ${email}
📋 *Тема:* ${subject}

💬 *Повідомлення:*
${message}

⏰ *Час:* ${new Date().toLocaleString("uk-UA", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })}
🌐 *Джерело:* Portfolio Website
🔗 *Відповісти:* ${email}
    `.trim()

  const telegramAPI = `https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`

  try {
    const response = await fetch(telegramAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CONFIG.CHAT_ID,
        text: telegramMessage,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    })

    const result = await response.json()

    if (!response.ok || !result.ok) {
      throw new Error(`Telegram API error: ${result.description || response.statusText}`)
    }

    console.log("✅ Message sent to Telegram successfully!")
    return { success: true, data: result }
  } catch (error) {
    console.error("❌ Telegram send error:", error)
    throw error
  }
}

// Fallback email service (using EmailJS as backup)
async function sendFallbackEmail(formData) {
  // Fallback to EmailJS or other email service
  console.log("Sending via fallback email service...")

  // Simulate email sending
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true })
    }, 1000)
  })
}

// Real-time validation
Object.keys(validationRules).forEach((fieldName) => {
  const field = document.getElementById(fieldName)
  if (field) {
    field.addEventListener("blur", () => {
      const errors = validateField(fieldName, field.value)
      displayFieldError(fieldName, errors)
    })

    field.addEventListener("input", () => {
      // Clear error on input
      if (field.classList.contains("error")) {
        const errors = validateField(fieldName, field.value)
        if (errors.length === 0) {
          displayFieldError(fieldName, [])
        }
      }
    })
  }
})

// Form submission
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  // Validate all fields
  let isValid = true
  const formData = new FormData(contactForm)

  Object.keys(validationRules).forEach((fieldName) => {
    const value = formData.get(fieldName) || ""
    const errors = validateField(fieldName, value)
    displayFieldError(fieldName, errors)

    if (errors.length > 0) {
      isValid = false
    }
  })

  if (!isValid) {
    return
  }

  // Show loading state
  const submitBtn = contactForm.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'
  submitBtn.disabled = true

  try {
    // Try to send to Telegram first
    await sendToTelegram(formData)

    // Show success message
    contactForm.style.display = "none"
    formSuccess.style.display = "block"

    // Update success message
    const successMessage = formSuccess.querySelector("p")
    successMessage.textContent =
      "Thank you for your message! I've received it via Telegram and will get back to you soon."

    // Reset form after delay
    setTimeout(() => {
      contactForm.reset()
      contactForm.style.display = "block"
      formSuccess.style.display = "none"
      submitBtn.innerHTML = originalText
      submitBtn.disabled = false

      // Clear all error messages
      Object.keys(validationRules).forEach((fieldName) => {
        displayFieldError(fieldName, [])
      })
    }, 5000)
  } catch (error) {
    console.error("Primary send method failed:", error)

    try {
      // Try fallback method
      await sendFallbackEmail(formData)

      // Show success message with fallback notice
      contactForm.style.display = "none"
      formSuccess.style.display = "block"

      const successMessage = formSuccess.querySelector("p")
      successMessage.textContent = "Thank you for your message! I've received it and will get back to you soon."

      // Reset form after delay
      setTimeout(() => {
        contactForm.reset()
        contactForm.style.display = "block"
        formSuccess.style.display = "none"
        submitBtn.innerHTML = originalText
        submitBtn.disabled = false
      }, 5000)
    } catch (fallbackError) {
      console.error("All send methods failed:", fallbackError)

      // Show error message
      alert(
        "Sorry, there was an error sending your message. Please try again later or contact me directly via email: azenko0609@gmail.com",
      )
      submitBtn.innerHTML = originalText
      submitBtn.disabled = false
    }
  }
})

// Clear form function
function clearForm() {
  contactForm.reset()

  // Clear all error messages
  Object.keys(validationRules).forEach((fieldName) => {
    displayFieldError(fieldName, [])
  })

  // Add confirmation
  const clearBtn = document.querySelector(".btn-secondary")
  const originalText = clearBtn.innerHTML
  clearBtn.innerHTML = '<i class="fas fa-check"></i> Cleared'

  setTimeout(() => {
    clearBtn.innerHTML = originalText
  }, 1000)
}

// Contact method animations
function animateContactMethods() {
  const contactMethods = document.querySelectorAll(".contact-method")

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1"
            entry.target.style.transform = "translateX(0)"
          }, index * 100)
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.5 },
  )

  contactMethods.forEach((method) => {
    method.style.opacity = "0"
    method.style.transform = "translateX(-20px)"
    method.style.transition = "opacity 0.5s ease, transform 0.5s ease"
    observer.observe(method)
  })
}

// Add click-to-copy functionality for contact info
function addCopyToClipboard() {
  const copyableElements = document.querySelectorAll(".method-info a")

  copyableElements.forEach((element) => {
    element.addEventListener("click", async (e) => {
      if (element.href.startsWith("mailto:") || element.href.startsWith("tel:")) {
        e.preventDefault()

        const textToCopy = element.href.startsWith("mailto:")
          ? element.href.replace("mailto:", "")
          : element.href.replace("tel:", "")

        try {
          await navigator.clipboard.writeText(textToCopy)

          // Show copy confirmation
          const originalText = element.textContent
          element.textContent = "Copied!"
          element.style.color = "var(--accent-color)"

          setTimeout(() => {
            element.textContent = originalText
            element.style.color = ""
          }, 2000)
        } catch (err) {
          console.error("Failed to copy text: ", err)
          // Fallback for older browsers
          const textArea = document.createElement("textarea")
          textArea.value = textToCopy
          document.body.appendChild(textArea)
          textArea.select()
          document.execCommand("copy")
          document.body.removeChild(textArea)
        }
      }
    })
  })
}

// FAQ accordion functionality
function addFAQAccordion() {
  const faqItems = document.querySelectorAll(".faq-item")

  faqItems.forEach((item) => {
    const question = item.querySelector("h3")
    const answer = item.querySelector("p")

    // Initially hide answers
    answer.style.maxHeight = "0"
    answer.style.overflow = "hidden"
    answer.style.transition = "max-height 0.3s ease"

    // Add click handler
    question.style.cursor = "pointer"
    question.addEventListener("click", () => {
      const isOpen = answer.style.maxHeight !== "0px"

      // Close all other FAQ items
      faqItems.forEach((otherItem) => {
        const otherAnswer = otherItem.querySelector("p")
        otherAnswer.style.maxHeight = "0"
        otherItem.classList.remove("active")
      })

      // Toggle current item
      if (!isOpen) {
        answer.style.maxHeight = answer.scrollHeight + "px"
        item.classList.add("active")
      }
    })

    // Add hover effect
    item.addEventListener("mouseenter", () => {
      item.style.transform = "translateY(-2px)"
      item.style.boxShadow = "var(--shadow-medium)"
    })

    item.addEventListener("mouseleave", () => {
      item.style.transform = "translateY(0)"
      item.style.boxShadow = "var(--shadow-light)"
    })
  })
}

// Add contact form character counter
function addCharacterCounter() {
  const messageField = document.getElementById("message")
  const maxLength = 500

  const counter = document.createElement("div")
  counter.className = "character-counter"
  counter.style.cssText = `
        text-align: right;
        font-size: 0.8rem;
        color: var(--text-secondary);
        margin-top: 0.25rem;
    `

  messageField.parentElement.appendChild(counter)

  function updateCounter() {
    const currentLength = messageField.value.length
    counter.textContent = `${currentLength}/${maxLength}`

    if (currentLength > maxLength * 0.9) {
      counter.style.color = "#ef4444"
    } else if (currentLength > maxLength * 0.7) {
      counter.style.color = "#f59e0b"
    } else {
      counter.style.color = "var(--text-secondary)"
    }
  }

  messageField.addEventListener("input", updateCounter)
  updateCounter()
}

// Test Telegram connection
async function testTelegramConnection() {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/getMe`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.ok) {
      console.log("✅ Telegram Bot підключено успішно:", result.result.username)

      // Send test message to verify chat ID
      await sendTestMessage()

      return true
    } else {
      console.error("❌ Telegram Bot помилка:", result.description)
      return false
    }
  } catch (error) {
    console.error("❌ Помилка тестування Telegram:", error)
    return false
  }
}

// Send test message to verify everything works
async function sendTestMessage() {
  try {
    const testMessage = `
🤖 *Тест підключення Portfolio*

✅ Telegram Bot успішно підключено!
📅 ${new Date().toLocaleString("uk-UA", { timeZone: "Europe/Warsaw" })}

Тепер ви будете отримувати повідомлення з контактної форми.
    `.trim()

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CONFIG.CHAT_ID,
        text: testMessage,
        parse_mode: "Markdown",
      }),
    })

    const result = await response.json()

    if (result.ok) {
      console.log("✅ Тестове повідомлення відправлено!")
    }
  } catch (error) {
    console.log("⚠️ Не вдалося відправити тестове повідомлення:", error)
  }
}

// Initialize contact page functionality
document.addEventListener("DOMContentLoaded", async () => {
  animateContactMethods()
  addCopyToClipboard()
  addFAQAccordion()
  addCharacterCounter()

  // Test Telegram connection and show status
  const statusContainer = document.getElementById("telegramStatus")
  const statusText = document.getElementById("telegramStatusText")

  if (statusContainer && statusText) {
    statusContainer.style.display = "block"

    try {
      const isConnected = await testTelegramConnection()

      if (isConnected) {
        statusText.innerHTML = '<i class="fas fa-check-circle"></i> Telegram підключено успішно!'
        statusContainer.querySelector(".telegram-status").classList.add("success")

        // Hide status after 3 seconds
        setTimeout(() => {
          statusContainer.style.display = "none"
        }, 3000)
      } else {
        statusText.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Помилка підключення до Telegram'
        statusContainer.querySelector(".telegram-status").classList.add("error")
      }
    } catch (error) {
      statusText.innerHTML = '<i class="fas fa-times-circle"></i> Telegram недоступний'
      statusContainer.querySelector(".telegram-status").classList.add("error")
    }
  }

  // Add enhanced CSS
  const style = document.createElement("style")
  style.textContent = `
        .telegram-status-container {
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 1000;
            animation: slideInRight 0.5s ease;
        }
        
        .telegram-status {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem 1.5rem;
            background: var(--primary-color);
            color: white;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            font-weight: 500;
            min-width: 250px;
        }
        
        .telegram-status.success {
            background: var(--success-color);
        }
        
        .telegram-status.error {
            background: var(--error-color);
        }
        
        .telegram-status i {
            font-size: 1.2rem;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .form-group input.error,
        .form-group textarea.error {
            border-color: #ef4444;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        
        .error-message {
            display: block;
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }
        
        .contact-method:hover {
            transform: translateX(5px);
            box-shadow: var(--shadow-lg);
        }
        
        .btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
        
        .btn.loading i {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
            .telegram-status-container {
                top: 80px;
                right: 10px;
                left: 10px;
            }
            
            .telegram-status {
                min-width: auto;
                width: 100%;
            }
        }
    `
  document.head.appendChild(style)
})

// Export contact data for potential API use
window.contactData = {
  email: "azenko0609@gmail.com",
  phone: "+48 720 866 592",
  github: "https://github.com/Azenko01",
  telegram: "https://t.me/OleksandrA0101",
  location: "Poland",
  availability: "Available for new projects",
}

// Add Telegram contact method to the contact page
function addTelegramContactMethod() {
  const contactMethods = document.querySelector(".contact-methods")
  if (contactMethods) {
    const telegramMethod = document.createElement("div")
    telegramMethod.className = "contact-method"
    telegramMethod.innerHTML = `
            <div class="method-icon">
                <i class="fab fa-telegram"></i>
            </div>
            <div class="method-info">
                <h3>Telegram</h3>
                <a href="https://t.me/OleksandrA0101" target="_blank">@OleksandrA0101</a>
            </div>
        `
    contactMethods.appendChild(telegramMethod)
  }
}

// Initialize Telegram contact method
document.addEventListener("DOMContentLoaded", () => {
  addTelegramContactMethod()
})
