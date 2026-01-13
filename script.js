// Scroll Animation
const animatedItems = document.querySelectorAll(".animate");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.2 }
);

animatedItems.forEach((item) => observer.observe(item));

// Mobile Menu Toggle
function toggleMenu() {
  const nav = document.getElementById("navLinks");
  nav.classList.toggle("show-menu");
}

// Scroll To Section
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

// FAQ Toggle
function toggleFAQ(button) {
  const answer = button.nextElementSibling;
  const icon = button.querySelector("span");

  if (answer.style.display === "block") {
    answer.style.display = "none";
    icon.textContent = "+";
  } else {
    answer.style.display = "block";
    icon.textContent = "−";
  }
}

// Alerts
function bookNow() {
  alert("✅ Appointment Booked Successfully! Our team will contact you soon. 😊");
}

function showOffer() {
  alert("🎉 Special Offer: Get 20% OFF on Teeth Whitening this week!");
}

function showMission() {
  alert("💙 Our mission is to deliver safe, premium & affordable dental care for all.");
}

function serviceAlert(serviceName) {
  alert(`✅ You selected: ${serviceName}\nOur team will guide you for the next steps!`);
}

function buyPlan(plan) {
  alert(`💎 You selected the ${plan} plan!\nOur team will call you to confirm your booking.`);
}

function callNow() {
  alert("📞 Calling Clinic... (Demo Alert)\nPlease dial: +91 98765 43210");
}

function sendMessage(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  alert(`✅ Message Sent Successfully!\n\nName: ${name}\nEmail: ${email}\n\nWe’ll contact you soon 😊`);

  event.target.reset();
}
