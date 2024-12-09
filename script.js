// DOM Elements
const localTimeInput = document.getElementById("local-time");
const timezoneSelect = document.getElementById("timezone-offset");
const addTimezoneBtn = document.getElementById("add-timezone-btn");
const timezoneCards = document.getElementById("timezone-cards");

// Function to calculate time with a given offset
function calculateTime(localTime, offset) {
  const [localHours, localMinutes] = localTime.split(":").map(Number);

  // Parse offset (e.g., +05:30 -> +5 hours, 30 minutes)
  const offsetSign = offset[0] === "+" ? 1 : -1;
  const [offsetHours, offsetMinutes] = offset.slice(1).split(":").map(Number);

  // Calculate new time
  let newHours = localHours + offsetSign * offsetHours;
  let newMinutes = localMinutes + offsetSign * offsetMinutes;

  // Handle minute overflow
  if (newMinutes >= 60) {
    newMinutes -= 60;
    newHours += 1;
  } else if (newMinutes < 0) {
    newMinutes += 60;
    newHours -= 1;
  }

  // Handle hour overflow (24-hour clock)
  if (newHours >= 24) {
    newHours -= 24;
  } else if (newHours < 0) {
    newHours += 24;
  }

  return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
}

// Function to update all timezone cards
function updateTimezoneCards() {
  const localTime = localTimeInput.value;

  document.querySelectorAll(".card").forEach((card) => {
    const offset = card.dataset.offset;
    const timeElement = card.querySelector(".time");
    timeElement.textContent = calculateTime(localTime, offset);
  });
}

// Function to add a new timezone card
function addTimezoneCard() {
  const offset = timezoneSelect.value;
  const label = timezoneSelect.options[timezoneSelect.selectedIndex].text;

  // Check if the timezone is already added
  if (document.querySelector(`.card[data-offset="${offset}"]`)) {
    alert("Timezone already added!");
    return;
  }

  // Create a new card
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.offset = offset;

  // Set the initial time
  const localTime = localTimeInput.value;
  const time = calculateTime(localTime, offset);

  // Add content to the card
  card.innerHTML = `
    <h2>${label}</h2>
    <p class="time">${time}</p>
  `;

  // Append the card to the container
  timezoneCards.appendChild(card);
}

// Event Listeners
localTimeInput.addEventListener("input", updateTimezoneCards);
addTimezoneBtn.addEventListener("click", addTimezoneCard);