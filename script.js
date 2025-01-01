/*
* Copyright (C) 2024 Kartik Gohil
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

// DOM Elements
const timezoneSelect = document.getElementById("timezone-offset");
const timezoneCards = document.getElementById("timezone-cards");

// Function to calculate time with a given offset, assuming local time is the user's local time
function calculateTime(localTime, offset) {
  const [localHours, localMinutes] = localTime.split(":").map(Number);

  // Create a Date object with the local time
  const localDate = new Date();
  localDate.setHours(localHours, localMinutes, 0, 0);

  // Convert the local time to the specified timezone
  const options = { timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: false };
  const formatter = new Intl.DateTimeFormat([], options);
  const [newHours, newMinutes] = formatter.format(localDate).split(":").map(Number);

  return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
}

// Function to update all timezone cards
function updateTimezoneCards() {
  const localHours = document.getElementById("local-time-hours").value;
  const localMinutes = document.getElementById("local-time-minutes").value;
  const localTime = `${localHours}:${localMinutes}`;

  document.querySelectorAll(".card").forEach((card) => {
    const timezone = card.dataset.timezone;
    const timeElement = card.querySelector(".time");
    timeElement.textContent = calculateTime(localTime, timezone);
  });
}

// Function to add a new timezone card
function addTimezoneCard() {
    const timezone = timezoneSelect.value;
    const label = timezoneSelect.options[timezoneSelect.selectedIndex].text;

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
    const localHours = document.getElementById("local-time-hours").value;
    const localMinutes = document.getElementById("local-time-minutes").value;
    const localTime = `${localHours}:${localMinutes}`;
    const time = calculateTime(localTime, timezone);

    // Add content to the card
    card.innerHTML = `
        <h2>${label}</h2>
        <p class="time">${time}</p>
        <button class="delete-btn">&times;</button>
        <p><i></i></p> <!-- TODO: add DST active flag -->
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
document.getElementById("local-time-hours").addEventListener("change", updateTimezoneCards);
document.getElementById("local-time-minutes").addEventListener("change", updateTimezoneCards);
document.getElementById('add-timezone-btn').addEventListener("click", addTimezoneCard);

// initialise current local time
const now = new Date();
document.getElementById('local-time-hours').value = now.getHours().toString().padStart(2, '0');
document.getElementById('local-time-minutes').value = now.getMinutes().toString().padStart(2, '0');

// initialise current timezone
const offsetMinutes = new Date().getTimezoneOffset();
const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
const offsetMins = Math.abs(offsetMinutes) % 60;
const offsetSign = offsetMinutes <= 0 ? "+" : "-";
document.getElementById("current-timezone-offset").textContent = `Current Timezone: UTC ${offsetSign}${offsetHours.toString().padStart(2, "0")}:${offsetMins.toString().padStart(2, "0")}`;
