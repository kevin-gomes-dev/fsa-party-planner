// To avoid conflicting with javascript's "Event", naming it different.
/**
 * @typedef ConventionEvent
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {string} date
 * @property {string} location
 */

// === Constants ===
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2605-ftb-ct-web-pt";
const RESOURCE = "/events";
const API = BASE + COHORT + RESOURCE;

// === State ===
let events = [];
let selectedEvent;

// === Data ===

/**
 * Get all events from API for "events" state
 */
async function getEvents() {
  try {
    const response = await fetch(API);
    const data = await response.json();
    // Handles removing entire array in case we call twice and putting all values in
    events = data.data;
  } catch (error) {
    console.log("Error in getEvents:", error);
  }
  render();
}

/**
 * Get a single event from API for selected event
 * @param {number} id The id to use for API call
 */
async function getEvent(id) {
  try {
    const response = await fetch(API + "/" + id);
    const data = await response.json();
    selectedEvent = data.data;
  } catch (error) {
    console.log("Error in getEvent:", error);
  }
  render();
}

// === Components ===

/**
 * Returns a clickable li HTML element whose text is given event's name
 * @param {ConventionEvent} conventionEvent
 */
function eventListItem(conventionEvent) {
  const eventItem = document.createElement("li");
  const eventLink = document.createElement("a");

  eventLink.textContent = conventionEvent.name;
  eventLink.href = "#selected";

  eventItem.addEventListener("click", () => getEvent(conventionEvent.id));
  eventItem.id = "p" + conventionEvent.id;
  eventItem.append(eventLink);
  return eventItem;
}

/**
 * Returns an unordered list HTML element containing all items in events state
 */
function eventUnorderedList() {
  const eventList = document.createElement("ul");
  events.forEach((conventionEvent) => {
    eventList.append(eventListItem(conventionEvent));
  });
  eventList.className = "upcoming";
  return eventList;
}

/**
 * Return a section HTML element containing event info
 */
function selectedEventSection() {
  const section = document.createElement("section");
  section.id = "selected";
  if (!selectedEvent) {
    section.innerHTML = `
    <h2>Please select an event for more info.</h2>
    `;
    return section;
  }
  section.innerHTML = `
  <h4>${selectedEvent.name} #${selectedEvent.id}</h4>
  <br>
  <p>${selectedEvent.date.split("T")[0]}</p>
  <p>${selectedEvent.location}</p>
  <br>
  <p>${selectedEvent.description}</p>
`;
  document.querySelector("#p" + selectedEvent.id).style.font = "italic small-caps bold 16px/2 arial";
  return section;
}

/**
 * Run API call on load. getEvents calls render after changing state
 */
async function init() {
  await getEvents();
}

function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
  <h1> Party Planner </h1>
  <main>
    <section>
        <h2> Upcoming Parties </h2>
        <ul></ul>
    </section>
    <section id="selected">
    </section>
  </main
  `;
  $app.querySelector("ul").replaceWith(eventUnorderedList());
  $app.querySelector("#selected").replaceWith(selectedEventSection());
}

init();
