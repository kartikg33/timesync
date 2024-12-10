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
constructor(containerId, initialTimezone = 'UTC') {
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
        ${this.generateTimezoneOptions()}
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

generateTimezoneOptions() {
    const timezones = [
    { name: 'UTC', offset: 0 },
    { name: 'UTC+4', offset: 240 },
    { name: 'UTC+5:30', offset: 330 },
    { name: 'UTC-5', offset: -300 },
    { name: 'UTC+1 (DST)', offset: 60, dst: true },
    { name: 'UTC-7', offset: -420 },
    { name: 'UTC+2', offset: 120 }
    ];

    return timezones
    .map(
        (tz) =>
        `<option value="${tz.offset}" data-dst="${tz.dst || false}">${tz.name}</option>`
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
