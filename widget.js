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

class TimeSelectorWidget {
constructor(containerId, initialTimezone = 'Europe/London') {
    this.container = document.getElementById(containerId);
    this.timezone = initialTimezone;
    this.offsetMinutes = 0;
    this.dstActive = false;
    this.render();
    this.attachListeners();
    this.updateOffset();
}

render() {
    const widget = document.createElement('div');
    widget.className = 'time-selector';
    widget.innerHTML = `
    <select class="timezone-selector">
        ${this.generateTimezoneOptions(this.timezone)}
    </select>
    <div class="time-inputs">
        <select class="hour-select">
        ${this.generateOptions(0, 23)}
        </select>
        <div class="time-colon">:</div>
        <select class="minute-select">
        ${this.generateOptions(0, 59)}
        </select>
    </div>
    <div class="offset-label">
        Offset: <span class="offset-value"></span>, DST: <span class="dst-status"></span>
    </div>
    `;
    this.container.appendChild(widget);
}

generateOptions(min, max) {
    let options = '';
    for (let i = min; i <= max; i++) {
    const value = i.toString().padStart(2, '0');
    options += `<option value="${value}">${value}</option>`;
    }
    return options;
}

generateTimezoneOptions(currentTimezone) {
    const timezones = [
        { timezone: "Pacific/Midway", name: "(GMT-11:00) Midway Island" },
        { timezone: "America/Adak", name: "(GMT-10:00) Hawaii-Aleutian" },
        { timezone: "Pacific/Honolulu", name: "(GMT-10:00) Hawaii" },
        { timezone: "Pacific/Marquesas", name: "(GMT-09:30) Marquesas Islands" },
        { timezone: "Pacific/Gambier", name: "(GMT-09:00) Gambier Islands" },
        { timezone: "America/Anchorage", name: "(GMT-09:00) Alaska" },
        { timezone: "America/Tijuana", name: "(GMT-08:00) Tijuana, Baja California" },
        { timezone: "Pacific/Pitcairn", name: "(GMT-08:00) Pitcairn Islands" },
        { timezone: "America/Los_Angeles", name: "(GMT-08:00) Pacific Time (US & Canada)" },
        { timezone: "America/Denver", name: "(GMT-07:00) Mountain Time (US & Canada)" },
        { timezone: "America/Chihuahua", name: "(GMT-07:00) Chihuahua, La Paz, Mazatlan" },
        { timezone: "America/Phoenix", name: "(GMT-07:00) Arizona" },
        { timezone: "America/Regina", name: "(GMT-06:00) Saskatchewan, Central America" },
        { timezone: "America/Mexico_City", name: "(GMT-06:00) Guadalajara, Mexico City, Monterrey" },
        { timezone: "Pacific/Easter", name: "(GMT-06:00) Easter Island" },
        { timezone: "America/Chicago", name: "(GMT-06:00) Central Time (US & Canada)" },
        { timezone: "America/New_York", name: "(GMT-05:00) Eastern Time (US & Canada)" },
        { timezone: "America/Havana", name: "(GMT-05:00) Cuba" },
        { timezone: "America/Bogota", name: "(GMT-05:00) Bogota, Lima, Quito, Rio Branco" },
        { timezone: "America/Caracas", name: "(GMT-04:30) Caracas" },
        { timezone: "America/Santiago", name: "(GMT-04:00) Santiago" },
        { timezone: "America/La_Paz", name: "(GMT-04:00) La Paz" },
        { timezone: "Atlantic/Stanley", name: "(GMT-04:00) Falkland Islands" },
        { timezone: "America/Campo_Grande", name: "(GMT-04:00) Brazil" },
        { timezone: "America/Goose_Bay", name: "(GMT-04:00) Atlantic Time (Goose Bay)" },
        { timezone: "America/Halifax", name: "(GMT-04:00) Atlantic Time (Canada)" },
        { timezone: "America/St_Johns", name: "(GMT-03:30) Newfoundland" },
        { timezone: "America/Araguaina", name: "(GMT-03:00) UTC-3" },
        { timezone: "America/Montevideo", name: "(GMT-03:00) Montevideo" },
        { timezone: "America/Miquelon", name: "(GMT-03:00) Miquelon, St. Pierre" },
        { timezone: "America/Nuuk", name: "(GMT-03:00) Greenland" },
        { timezone: "America/Argentina/Buenos_Aires", name: "(GMT-03:00) Buenos Aires" },
        { timezone: "America/Sao_Paulo", name: "(GMT-03:00) Brasilia" },
        { timezone: "America/Noronha", name: "(GMT-02:00) Mid-Atlantic" },
        { timezone: "Atlantic/Cape_Verde", name: "(GMT-01:00) Cape Verde Is." },
        { timezone: "Atlantic/Azores", name: "(GMT-01:00) Azores" },
        { timezone: "Europe/London", name: "(GMT) London, Lisbon, Belfast, Dublin" },
        { timezone: "Africa/Abidjan", name: "(GMT) Monrovia, Reykjavik" },
        { timezone: "Europe/Amsterdam", name: "(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna" },
        { timezone: "Europe/Belgrade", name: "(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague" },
        { timezone: "Europe/Brussels", name: "(GMT+01:00) Brussels, Copenhagen, Madrid, Paris" },
        { timezone: "Africa/Algiers", name: "(GMT+01:00) West Central Africa" },
        { timezone: "Africa/Windhoek", name: "(GMT+01:00) Windhoek" },
        { timezone: "Asia/Beirut", name: "(GMT+02:00) Beirut" },
        { timezone: "Africa/Cairo", name: "(GMT+02:00) Cairo" },
        { timezone: "Asia/Gaza", name: "(GMT+02:00) Gaza" },
        { timezone: "Africa/Harare", name: "(GMT+02:00) Harare, Pretoria" },
        { timezone: "Asia/Jerusalem", name: "(GMT+02:00) Jerusalem" },
        { timezone: "Europe/Minsk", name: "(GMT+02:00) Minsk" },
        { timezone: "Asia/Damascus", name: "(GMT+02:00) Syria" },
        { timezone: "Europe/Moscow", name: "(GMT+03:00) Moscow, St. Petersburg, Volgograd" },
        { timezone: "Africa/Nairobi", name: "(GMT+03:00) Nairobi" },
        { timezone: "Asia/Tehran", name: "(GMT+03:30) Tehran" },
        { timezone: "Asia/Dubai", name: "(GMT+04:00) Abu Dhabi, Muscat" },
        { timezone: "Asia/Yerevan", name: "(GMT+04:00) Yerevan" },
        { timezone: "Asia/Kabul", name: "(GMT+04:30) Kabul" },
        { timezone: "Asia/Yekaterinburg", name: "(GMT+05:00) Ekaterinburg" },
        { timezone: "Asia/Tashkent", name: "(GMT+05:00) Tashkent" },
        { timezone: "Asia/Calcutta", name: "(GMT+05:30) Chennai, Calcutta, Mumbai, New Delhi" },
        { timezone: "Asia/Kathmandu", name: "(GMT+05:45) Kathmandu" },
        { timezone: "Asia/Dhaka", name: "(GMT+06:00) Astana, Dhaka" },
        { timezone: "Asia/Novosibirsk", name: "(GMT+06:00) Novosibirsk" },
        { timezone: "Asia/Yangon", name: "(GMT+06:30) Yangon (Rangoon)" },
        { timezone: "Asia/Bangkok", name: "(GMT+07:00) Bangkok, Hanoi, Jakarta" },
        { timezone: "Asia/Krasnoyarsk", name: "(GMT+07:00) Krasnoyarsk" },
        { timezone: "Asia/Shanghai", name: "(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi" },
        { timezone: "Asia/Irkutsk", name: "(GMT+08:00) Irkutsk, Ulaan Bataar" },
        { timezone: "Australia/Perth", name: "(GMT+08:00) Perth" },
        { timezone: "Australia/Eucla", name: "(GMT+08:45) Eucla" },
        { timezone: "Asia/Tokyo", name: "(GMT+09:00) Osaka, Sapporo, Tokyo" },
        { timezone: "Asia/Seoul", name: "(GMT+09:00) Seoul" },
        { timezone: "Asia/Yakutsk", name: "(GMT+09:00) Yakutsk" },
        { timezone: "Australia/Adelaide", name: "(GMT+09:30) Adelaide" },
        { timezone: "Australia/Darwin", name: "(GMT+09:30) Darwin" },
        { timezone: "Australia/Brisbane", name: "(GMT+10:00) Brisbane" },
        { timezone: "Australia/Hobart", name: "(GMT+10:00) Hobart" },
        { timezone: "Asia/Vladivostok", name: "(GMT+10:00) Vladivostok" },
        { timezone: "Australia/Lord_Howe", name: "(GMT+10:30) Lord Howe Island" },
        { timezone: "Pacific/Guadalcanal", name: "(GMT+11:00) Solomon Is., New Caledonia" },
        { timezone: "Asia/Magadan", name: "(GMT+11:00) Magadan" },
        { timezone: "Pacific/Norfolk", name: "(GMT+11:30) Norfolk Island" },
        { timezone: "Asia/Anadyr", name: "(GMT+12:00) Anadyr, Kamchatka" },
        { timezone: "Pacific/Auckland", name: "(GMT+12:00) Auckland, Wellington" },
        { timezone: "Pacific/Fiji", name: "(GMT+12:00) Fiji, Kamchatka, Marshall Is." },
        { timezone: "Pacific/Chatham", name: "(GMT+12:45) Chatham Islands" },
        { timezone: "Pacific/Tongatapu", name: "(GMT+13:00) Nuku'alofa" },
        { timezone: "Pacific/Kiritimati", name: "(GMT+14:00) Kiritimati" }
    ];

    return timezones.map(
        (tz) =>
        `<option value="${tz.timezone}" ${tz.timezone === currentTimezone ? 'selected' : ''}>${tz.name}</option>`
    )
    .join('');
}

attachListeners() {
    const hourSelect = this.container.querySelector('.hour-select');
    const minuteSelect = this.container.querySelector('.minute-select');
    const timezoneSelect = this.container.querySelector('.timezone-selector');

    const onTimeChange = () => {
    const hours = parseInt(hourSelect.value, 10);
    const minutes = parseInt(minuteSelect.value, 10);
    this.updateAllWidgets(hours, minutes);
    };

    const onTimezoneChange = () => {
    const selectedOption = timezoneSelect.options[timezoneSelect.selectedIndex];
    this.offsetMinutes = parseInt(selectedOption.value, 10);
    this.dstActive = selectedOption.getAttribute('data-dst') === 'true';
    this.updateOffset();
    this.updateAllWidgets(
        parseInt(hourSelect.value, 10),
        parseInt(minuteSelect.value, 10)
    );
    };

    hourSelect.addEventListener('change', onTimeChange);
    minuteSelect.addEventListener('change', onTimeChange);
    timezoneSelect.addEventListener('change', onTimezoneChange);
}

updateOffset() {
    const offsetLabel = this.container.querySelector('.offset-value');
    const dstLabel = this.container.querySelector('.dst-status');

    offsetLabel.textContent = `${this.offsetMinutes >= 0 ? '+' : ''}${this.offsetMinutes} min`;
    dstLabel.textContent = this.dstActive ? 'Active' : 'Inactive';
}

updateAllWidgets(hours, minutes) {
    const utcMinutes = hours * 60 + minutes - this.offsetMinutes;

    TimeSelectorWidget.instances.forEach((widget) => {
    if (widget !== this) {
        widget.updateWidgetTime(utcMinutes);
    }
    });
}

updateWidgetTime(utcMinutes) {
    const localMinutes = (utcMinutes + this.offsetMinutes + 1440) % 1440;
    const hours = Math.floor(localMinutes / 60);
    const minutes = localMinutes % 60;

    const hourSelect = this.container.querySelector('.hour-select');
    const minuteSelect = this.container.querySelector('.minute-select');

    hourSelect.value = hours.toString().padStart(2, '0');
    minuteSelect.value = minutes.toString().padStart(2, '0');
}
}

// Static property to keep track of all widget instances
TimeSelectorWidget.instances = [];
