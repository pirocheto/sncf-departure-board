/**
 * Calculates the remaining time between the current date and a future date.
 *
 * @param {Date} currentDate - The current date and time.
 * @param {Date} futureDate - The future date and time to compare against.
 * @returns {number[]} An array where the first element is the remaining hours and the second element is the remaining minutes.
 */
export function getRemainingTime(currentDate, futureDate) {
  const diff = futureDate - currentDate

  const minutes = Math.floor(diff / 1000 / 60)
  const remainingHours = Math.floor(minutes / 60)
  const remainingMinutes = Math.floor(minutes % 60)

  return [remainingHours, remainingMinutes]
}

/**
 * Formats the remaining time into a human-readable string and determines the status.
 *
 * @param {number} remainingHours - The number of remaining hours.
 * @param {number} remainingMinutes - The number of remaining minutes.
 * @returns {[string, string]} An array where the first element is the formatted remaining time
 *                             and the second element is the status.
 */
export function formatRemainingTime(remainingHours, remainingMinutes) {
  const formattedMinutes = remainingMinutes.toString().padStart(2, "0")

  const remainingTime =
    remainingHours > 0
      ? `${remainingHours} h ${formattedMinutes} min`
      : `${formattedMinutes} min`

  const status = getStatus(remainingHours, remainingMinutes)
  return [remainingTime, status]
}

/**
 * Determines the status based on the remaining time until a future date.
 *
 * @param {number} remainingHours - The remaining hours.
 * @param {number} remainingMinutes - The remaining minutes.
 * @returns {string} The status, which is "imminent" if the remaining time is less than 10 minutes,
 *                   "soon" if the remaining time is less than 20 minutes, otherwise "late".
 */
export function getStatus(remainingHours, remainingMinutes) {
  const totalMinutes = remainingHours * 60 + remainingMinutes
  return totalMinutes < 10 ? "imminent" : totalMinutes < 20 ? "soon" : "late"
}

/**
 * Formats a Date object into a string with the format "HH:MM".
 *
 * @param {Date} time - The Date object to format.
 * @returns {string} The formatted time string.
 */
export function getTime(time) {
  const hours = time.getHours().toString().padStart(2, "0")
  const minutes = time.getMinutes().toString().padStart(2, "0")
  return `${hours}:${minutes}`
}
