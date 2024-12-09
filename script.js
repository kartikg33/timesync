// DOM Elements
const localTimeInput = document.getElementById("local-time");
const timezoneSelect = document.getElementById("timezone-select");
const addTimezoneBtn = document.getElementById("add-timezone-btn");
const timezoneCards = document.getElementById("timezone-cards");

// Function to format time (HH:mm) in a given timezone
function formatTime(localTime, timezone) {
  const [hours, minutes] = localTime.split(":").map(Number);

  // Create a Date object for the local time
  const localDate = new Date();
  localDate.setHours(hours, minutes, 0);

  // Convert to the target timezone using toLocaleString
  const options = {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  return localDate.toLocaleTimeString("en-US", options);
}

// Function to update all timezone cards
function updateTimezoneCards() {
  const localTime = localTimeInput.value;

  // Update each card with the current local time
  document.querySelectorAll(".card").forEach((card) => {
    const timezone = card.dataset.timezone;
    const timeElement = card.querySelector(".time");
    timeElement.textContent = formatTime(localTime, timezone);
  });
}

// Function to add a new timezone card
function addTimezoneCard() {
  const timezone = timezoneSelect.value;

  // Check if the timezone is already added
  if (document.querySelector(`.card[data-timezone="${timezone}"]`)) {
    alert("Timezone already added!");
    return;
  }

  // Create a new card
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.timezone = timezone;

  // Set the initial time
  const localTime = localTimeInput.value;
  const time = formatTime(localTime, timezone);

  // Add content to the card
  card.innerHTML = `
    <h2>${timezone}</h2>
    <p class="time">${time}</p>
  `;

  // Append the card to the container
  timezoneCards.appendChild(card);
}

// Event Listeners
localTimeInput.addEventListener("input", updateTimezoneCards);
addTimezoneBtn.addEventListener("click", addTimezoneCard);
