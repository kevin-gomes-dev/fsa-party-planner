// To avoid conflicting with javascript's "Event", naming it different.
/**
 * @typedef ConventionEvent
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {string} date
 * @property {string} location
 */

/**
 * @typedef Rsvp
 * @property {number} id
 * @property {number} guestId
 * @property {number} eventId
 */

/**
 * @typedef Guest
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} bio
 * @property {string} job
 *
 */

// === Constants ===
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2605-ftb-ct-web-pt";
const RESOURCE = "/events";
const API = BASE + COHORT + RESOURCE;

// === State ===
let selectedEvent;
let selectedEventGuests = [];
let guests = [];
let rsvps = [];
let events = [];

// === Data ===

/**
 * Get all events from API for "events" state
 */
async function getEvents() {
  try {
    const response = await fetch(API);
    const data = await response.json();
    events = data.data;
  } catch (error) {
    console.log("Error in getEvents:", error);
  }
}

async function getGuests() {
  try {
    const response = await fetch(BASE + COHORT + "/guests");
    const data = await response.json();
    guests = data.data;
  } catch (error) {
    console.log("Error in getGuests:", error);
  }
}

async function getRsvps() {
  try {
    const response = await fetch(BASE + COHORT + "/rsvps");
    const data = await response.json();
    rsvps = data.data;
  } catch (error) {
    console.log("Error in getRsbps:", error);
  }
}

// Get all the RSVPs of an event. Then serach through them, finding all users. Use the user id to get their info from API

/**
 * Get a single event from API for selected event
 * @param {number} id The id to use for API call
 */
async function setSelectedEvent(id) {
  try {
    const response = await fetch(API + "/" + id);
    const data = await response.json();
    selectedEvent = data.data;
  } catch (error) {
    console.log("Error in getEvent:", error);
  }
  render();
}

/**
 * Get a single guest from API
 * @param {number} id
 */
async function getGuest(id) {
  try {
    const response = await fetch(BASE + COHORT + "/guests/" + id);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log("Error in getGuest:", error);
  }
}

/**
 * Sets selected guest events
 * @param {ConventionEvent} conventionEvent
 */
function setEventGuests(conventionEvent) {
  // selectedEventGuests = [];
  const eventRsvps = rsvps.filter((rsvp) => rsvp.eventId === conventionEvent.id);
  //   return eventRsvps;
  eventRsvps.map(async (rsvp) => {
    try {
      const guest = await getGuest(rsvp.guestId);
      selectedEventGuests.push(guest);
    } catch (error) {
      console.log(error);
    }
  });
}

// === Components ===

/**
 * Returns a clickable li HTML element whose text is given event's name
 * @param {ConventionEvent} conventionEvent
 * @returns {HTMLLIElement}
 */
function eventListItem(conventionEvent) {
  const eventItem = document.createElement("li");
  const eventLink = document.createElement("a");

  eventLink.textContent = conventionEvent.name;
  eventLink.href = "#selected";

  eventItem.addEventListener("click", () => {
    setEventGuests(conventionEvent);
    setSelectedEvent(conventionEvent.id);
  });
  eventItem.id = "p" + conventionEvent.id;
  eventItem.append(eventLink);
  return eventItem;
}

/**
 * Returns an li HTML element for a guest
 * @param {Guest} guest
 * @returns {HTMLLIElement}
 */
function guestListItem(guest) {
  const guestItem = document.createElement("li");
  guestItem.textContent = guest.name;
  return guestItem;
}

/**
 * Returns a ul HTML element for all guests of a particular event
 * @param {ConventionEvent} conventionEvent
 * @returns {HTMLUListElement}
 */
function guestUnorderedList(conventionEvent) {
  const guestList = document.createElement("ul");
  selectedEventGuests.forEach((guest) => {
    guestList.append(guestListItem(guest));
  });
  return guestList;
}

/**
 * Returns an unordered list HTML element containing all items in events state
 * @returns {HTMLUListElement}
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
  <br>
  <ul></ul>
`;
  document.querySelector("#p" + selectedEvent.id).style.font = "italic small-caps bold 16px/2 arial";
  section.querySelector("ul").replaceWith(guestUnorderedList(selectedEvent));
  return section;
}

/**
 * Run API call on load. getEvents calls render after changing state
 */
async function init() {
  await getEvents();
  await getGuests();
  await getRsvps();
  render();
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
  // console.log(selectedEvent);
  $app.querySelector("ul").replaceWith(eventUnorderedList());
  $app.querySelector("#selected").replaceWith(selectedEventSection());
}

init();
