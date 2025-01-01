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

// Function to get the time offset for a selected timezone
function getTimezoneOffset(timeZone, date = new Date()) {
  // Get the formatter for the selected timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour12: false, // Use 24-hour time format for simplicity
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
  });

  // Format the date in the selected timezone
  const parts = formatter.formatToParts(date);

  // Extract the time components
  const year = parseInt(parts.find(part => part.type === 'year').value, 10);
  const month = parseInt(parts.find(part => part.type === 'month').value, 10) - 1; // JS months are 0-based
  const day = parseInt(parts.find(part => part.type === 'day').value, 10);
  const hour = parseInt(parts.find(part => part.type === 'hour').value, 10);
  const minute = parseInt(parts.find(part => part.type === 'minute').value, 10);
  const second = parseInt(parts.find(part => part.type === 'second').value, 10);

  // Create a new date object for the local time in the selected timezone
  const localTime = new Date(Date.UTC(year, month, day, hour, minute, second));

  // Calculate the timezone offset in minutes
  const offsetInHours = Math.round((localTime - date) / (30 * 60 * 1000)) / 2;

  console.log(timeZone, offsetInHours);

  return offsetInHours >= 0 ? `+${offsetInHours}` : `${offsetInHours}`;
}

// Function to generate list of timezones for dropdown box
function generateTimezoneOptions() {
  const timezones = [
      { value: "Etc/GMT+12", label: `(UTC${getTimezoneOffset("Etc/GMT+12")}) Eniwetok, Kwajalein` },
      { value: "Pacific/Midway", label: `(UTC${getTimezoneOffset("Pacific/Midway")}) Midway Island, Samoa` },
      { value: "Pacific/Honolulu", label: `(UTC${getTimezoneOffset("Pacific/Honolulu")}) Hawaii` },
      { value: "Pacific/Marquesas", label: `(UTC${getTimezoneOffset("Pacific/Marquesas")}) Taiohae` },
      { value: "America/Anchorage", label: `(UTC${getTimezoneOffset("America/Anchorage")}) Alaska` },
      { value: "America/Los_Angeles", label: `(UTC${getTimezoneOffset("America/Los_Angeles")}) Pacific Time (US & Canada)` },
      { value: "America/Denver", label: `(UTC${getTimezoneOffset("America/Denver")}) Mountain Time (US & Canada)` },
      { value: "America/Chicago", label: `(UTC${getTimezoneOffset("America/Chicago")}) Central Time (US & Canada), Mexico City` },
      { value: "America/New_York", label: `(UTC${getTimezoneOffset("America/New_York")}) Eastern Time (US & Canada), Bogota, Lima` },
      { value: "America/Caracas", label: `(UTC${getTimezoneOffset("America/Caracas")}) Caracas` },
      { value: "America/Halifax", label: `(UTC${getTimezoneOffset("America/Halifax")}) Atlantic Time (Canada), Caracas, La Paz` },
      { value: "America/St_Johns", label: `(UTC${getTimezoneOffset("America/St_Johns")}) Newfoundland` },
      { value: "America/Argentina/Buenos_Aires", label: `(UTC${getTimezoneOffset("America/Argentina/Buenos_Aires")}) Brazil, Buenos Aires, Georgetown` },
      { value: "Atlantic/South_Georgia", label: `(UTC${getTimezoneOffset("Atlantic/South_Georgia")}) Mid-Atlantic` },
      { value: "Atlantic/Azores", label: `(UTC${getTimezoneOffset("Atlantic/Azores")}) Azores, Cape Verde Islands` },
      { value: "Europe/London", label: `(UTC${getTimezoneOffset("Europe/London")}) Western Europe Time, London, Lisbon, Casablanca`, selected: true },
      { value: "Europe/Paris", label: `(UTC${getTimezoneOffset("Europe/Paris")}) Brussels, Copenhagen, Madrid, Paris` },
      { value: "Europe/Kaliningrad", label: `(UTC${getTimezoneOffset("Europe/Kaliningrad")}) Kaliningrad, South Africa` },
      { value: "Europe/Moscow", label: `(UTC${getTimezoneOffset("Europe/Moscow")}) Baghdad, Riyadh, Moscow, St. Petersburg` },
      { value: "Asia/Tehran", label: `(UTC${getTimezoneOffset("Asia/Tehran")}) Tehran` },
      { value: "Asia/Dubai", label: `(UTC${getTimezoneOffset("Asia/Dubai")}) Abu Dhabi, Muscat, Baku, Tbilisi` },
      { value: "Asia/Kabul", label: `(UTC${getTimezoneOffset("Asia/Kabul")}) Kabul` },
      { value: "Asia/Karachi", label: `(UTC${getTimezoneOffset("Asia/Karachi")}) Ekaterinburg, Islamabad, Karachi, Tashkent` },
      { value: "Asia/Calcutta", label: `(UTC${getTimezoneOffset("Asia/Calcutta")}) Bombay, Calcutta, Madras, New Delhi` },
      { value: "Asia/Kathmandu", label: `(UTC${getTimezoneOffset("Asia/Kathmandu")}) Kathmandu, Pokhara` },
      { value: "Asia/Dhaka", label: `(UTC${getTimezoneOffset("Asia/Dhaka")}) Almaty, Dhaka, Colombo` },
      { value: "Asia/Yangon", label: `(UTC${getTimezoneOffset("Asia/Yangon")}) Yangon, Mandalay` },
      { value: "Asia/Bangkok", label: `(UTC${getTimezoneOffset("Asia/Bangkok")}) Bangkok, Hanoi, Jakarta` },
      { value: "Asia/Shanghai", label: `(UTC${getTimezoneOffset("Asia/Shanghai")}) Beijing, Perth, Singapore, Hong Kong` },
      { value: "Australia/Eucla", label: `(UTC${getTimezoneOffset("Australia/Eucla")}) Eucla` },
      { value: "Asia/Tokyo", label: `(UTC${getTimezoneOffset("Asia/Tokyo")}) Tokyo, Seoul, Osaka, Sapporo, Yakutsk` },
      { value: "Australia/Adelaide", label: `(UTC${getTimezoneOffset("Australia/Adelaide")}) Adelaide, Darwin` },
      { value: "Australia/Sydney", label: `(UTC${getTimezoneOffset("Australia/Sydney")}) Eastern Australia, Guam, Vladivostok` },
      { value: "Australia/Lord_Howe", label: `(UTC${getTimezoneOffset("Australia/Lord_Howe")}) Lord Howe Island` },
      { value: "Asia/Magadan", label: `(UTC${getTimezoneOffset("Asia/Magadan")}) Magadan, Solomon Islands, New Caledonia` },
      { value: "Pacific/Norfolk", label: `(UTC${getTimezoneOffset("Pacific/Norfolk")}) Norfolk Island` },
      { value: "Pacific/Auckland", label: `(UTC${getTimezoneOffset("Pacific/Auckland")}) Auckland, Wellington, Fiji, Kamchatka` },
      { value: "Pacific/Chatham", label: `(UTC${getTimezoneOffset("Pacific/Chatham")}) Chatham Islands` },
      { value: "Pacific/Apia", label: `(UTC${getTimezoneOffset("Pacific/Apia")}) Apia, Nukualofa` },
      { value: "Pacific/Kiritimati", label: `(UTC${getTimezoneOffset("Pacific/Kiritimati")}) Line Islands, Tokelau` }
  ];

  const optionsHtml = timezones.map(tz => {
      const selectedAttribute = tz.selected ? ' selected="selected"' : '';
      return `<option value="${tz.value}"${selectedAttribute}>${tz.label}</option>`;
  }).join('');
  timezoneSelect.innerHTML = optionsHtml;
}

// Function to calculate time with a given IANA timezone
function calculateTime(localTime, timezone) {
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
document.getElementById("current-timezone-offset").textContent = `Current Timezone: UTC${offsetSign}${offsetHours.toString().padStart(2, "0")}:${offsetMins.toString().padStart(2, "0")}`;

// initialise timezone dropdown list
generateTimezoneOptions();