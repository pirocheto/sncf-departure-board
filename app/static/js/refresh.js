import { NETWORK_ICON_SRC, LINE_ICON_SRC } from "./constants.js"
import { getTime, getRemainingTime, formatRemainingTime } from "./utils.js"

/**
 * Fetches departure data from the API backend and updates the table with the fetched data.
 *
 * This function makes a GET request to the "api/departures" endpoint, processes the
 * response to extract departure information, and dynamically updates the table body
 * (`tbody`) with the departure details. If there are fewer than 5 departures, it fills
 * the remaining rows with a message indicating no more trains are scheduled.
 *
 * The table rows include:
 * - Network and line icons
 * - Headsign
 * - Destination
 * - Departure time
 * - Remaining time until departure
 *
 * The function also ensures that the table always has at least 5 rows, filling in
 * empty rows with a placeholder message if necessary.
 */
function fetchDepartures() {
  fetch("api/departures")
    .then((response) => response.json())
    .then((data) => {
      const tbody = document.createElement("tbody")

      data.forEach((row) => {
        const futureDateTime = new Date(row.date_time)
        const currentDateTime = new Date()

        const time = getTime(futureDateTime)

        const [remainingHours, remainingMinutes] = getRemainingTime(
          currentDateTime,
          futureDateTime
        )

        const [formattedRemainingTime, status] = formatRemainingTime(
          remainingHours,
          remainingMinutes
        )

        const tr = document.createElement("tr")
        tr.innerHTML = `
          <td>
            <span class='line'>
              <img class='icon' src="${NETWORK_ICON_SRC[row.network]}" />
              <img class='icon' src="${LINE_ICON_SRC[row.line]}" />
            </span>
          </td>
          <td>${row.headsign}</td>
          <td class='destination'>${row.destination}</td>
          <td><span class='time-departure'>${time}</span></td>
          <td><span data-status=${status}>${formattedRemainingTime}</span></td>
        `
        tbody.appendChild(tr)
      })

      // Replace the current tbody with the new one
      const table = document.querySelector("table")
      table.replaceChild(tbody, table.querySelector("tbody"))
    })
}

// Fetch departures on page load and refresh every minute
fetchDepartures() && setInterval(fetchDepartures, 1 * 60 * 1000)

/**
 * Updates the current date and time on the webpage.
 *
 * This function retrieves the current date and time, formats them according to French locale conventions,
 * and updates the content of HTML elements with the IDs "date" and "clock" to display the formatted date and time.
 *
 * The date is formatted as "weekday, day month" (e.g., "lundi, 6 février").
 * The time is formatted as "HH:mm" (e.g., "14:35").
 */
function updateDateTime() {
  const now = new Date()

  const options = { weekday: "long", day: "numeric", month: "long" }
  const formattedDate = now.toLocaleDateString("fr-FR", options)
  const formattedTime = getTime(now)

  document.getElementById("date").textContent = `${formattedDate}`
  document.getElementById("clock").textContent = `${formattedTime}`
}

// Update the date and time when the page loads and every minute thereafter
updateDateTime() && setInterval(updateDateTime, 1 * 60 * 1000)
