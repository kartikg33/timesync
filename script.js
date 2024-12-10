// DOM Elements
const localTimeInput = document.getElementById("local-time");
const timezoneSelect = document.getElementById("timezone-offset");
const addTimezoneBtn = document.getElementById("add-timezone-btn");
const timezoneCards = document.getElementById("timezone-cards");

// Function to calculate time with a given offset, assuming local time is the user's local time
function calculateTime(localTime, offset) {
  const [localHours, localMinutes] = localTime.split(":").map(Number);

  // Get user's local timezone offset in minutes (negative for GMT+)
  const localOffsetMinutes = new Date().getTimezoneOffset(); // e.g., -330 for IST (GMT+5:30)

  // Parse the selected offset (e.g., +05:30 -> +5 hours, 30 minutes)
  const offsetSign = offset[0] === "+" ? 1 : -1;
  const [offsetHours, offsetMinutes] = offset.slice(1).split(":").map(Number);

  // Convert local time (in user local timezone) to UTC
  let totalMinutes = localHours * 60 + localMinutes + localOffsetMinutes;

  // Adjust for the selected timezone offset
  totalMinutes += offsetSign * (offsetHours * 60 + offsetMinutes);

  // Handle overflow of minutes into hours and days
  let newHours = Math.floor(totalMinutes / 60) % 24;
  let newMinutes = totalMinutes % 60;

  // Adjust for negative hours (e.g., -1 hour should become 23:00 of the previous day)
  if (newMinutes < 0) {
    newMinutes += 60;
    newHours -= 1;
  }
  if (newHours < 0) {
    newHours += 24;
  }

  return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
}

// Function to update all timezone cards
function updateTimezoneCards() {
  const localTime = localTimeInput.value; // User's local time

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
        <button class="delete-btn">&times;</button>
    `;

    // Append the card to the container
    timezoneCards.appendChild(card);

    // Add event listener to delete button
    const deleteBtn = card.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
        card.remove(); // Remove the card from the DOM
    });
}

// Event Listeners
localTimeInput.addEventListener("input", updateTimezoneCards);
addTimezoneBtn.addEventListener("click", addTimezoneCard);

// initialise current local time
document.getElementById('local-time').value = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// initialise current timezone
const offsetMinutes = new Date().getTimezoneOffset();
const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
const offsetMins = Math.abs(offsetMinutes) % 60;
const offsetSign = offsetMinutes <= 0 ? "+" : "-";
document.getElementById("current-timezone-offset").textContent = `Current Timezone: UTC ${offsetSign}${offsetHours.toString().padStart(2, "0")}:${offsetMins.toString().padStart(2, "0")}`;
