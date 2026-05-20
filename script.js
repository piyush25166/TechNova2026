const eventsData = [
    {
      id: "EVT101",
      name: "Code Sprint",
      category: "Coding",
      datetime: "2026-02-15 10:00 AM",
      venue: "Lab A",
      fee: "₹100",
      status: "Open"
    },
    {
      id: "EVT102",
      name: "Debug Arena",
      category: "Problem Solving",
      datetime: "2026-02-15 12:00 PM",
      venue: "Lab B",
      fee: "₹80",
      status: "Open"
    },
    {
      id: "EVT103",
      name: "Tech Quiz",
      category: "Quiz",
      datetime: "2026-02-15 02:00 PM",
      venue: "Seminar Hall",
      fee: "₹50",
      status: "Closed"
    },
    {
      id: "EVT104",
      name: "Web Design Battle",
      category: "Design",
      datetime: "2026-02-16 10:30 AM",
      venue: "Computer Center",
      fee: "₹120",
      status: "Open"
    },
    {
      id: "EVT105",
      name: "Project Expo",
      category: "Presentation",
      datetime: "2026-02-16 01:30 PM",
      venue: "Auditorium",
      fee: "₹150",
      status: "Open"
    }
  ];

  const registrations = [];
  const feedbackEntries = [];

  document.addEventListener("DOMContentLoaded", () => {
    highlightCurrentNav();

    if (document.getElementById("liveClock")) {
      startClock();
    }

    if (document.getElementById("eventsContainer")) {
      renderEvents();
      fillEventSelects();
      setupRegistrationForm();
      updateRegistrationCount();
    }

    if (document.getElementById("feedbackForm")) {
      fillFeedbackSelect();
      setupFeedbackForm();
      updateFeedbackSummary();
    }
  });

  function highlightCurrentNav() {
    const page = document.body.dataset.page;
    document.querySelectorAll(".navlink").forEach(link => {
      link.classList.remove("active");
    });

    const activeLink = document.querySelector(`.navlink[href="${page === "home" ? "index.html" : page === "events" ? "events.html" : "feedback.html"}"]`);
    if (activeLink) activeLink.classList.add("active");
  }

  function startClock() {
    const clock = document.getElementById("liveClock");

    function updateClock() {
      const now = new Date();
      clock.textContent = now.toLocaleString("en-IN", {
        dateStyle: "full",
        timeStyle: "medium"
      });
    }

    updateClock();
    setInterval(updateClock, 1000);
  }

  function renderEvents() {
    const container = document.getElementById("eventsContainer");
    container.innerHTML = "";

    eventsData.forEach(event => {
      const card = document.createElement("div");
      card.className = "event-card";

      card.innerHTML = `
        <h4>${event.name}</h4>
        <div class="event-meta">
          <div><strong>Event ID:</strong> ${event.id}</div>
          <div><strong>Category:</strong> ${event.category}</div>
          <div><strong>Date & Time:</strong> ${event.datetime}</div>
          <div><strong>Venue:</strong> ${event.venue}</div>
          <div><strong>Fee:</strong> ${event.fee}</div>
        </div>
        <span class="badge ${event.status.toLowerCase()}">${event.status}</span>
      `;

      container.appendChild(card);
    });
  }

  function fillEventSelects() {
    const eventSelect = document.getElementById("eventSelect");
    const feedbackSelect = document.getElementById("eventAttended");

    if (eventSelect) {
      eventsData.forEach(event => {
        const option = document.createElement("option");
        option.value = event.name;
        option.textContent = `${event.name} (${event.status})`;
        eventSelect.appendChild(option);
      });
    }

    if (feedbackSelect) {
      eventsData.forEach(event => {
        const option = document.createElement("option");
        option.value = event.name;
        option.textContent = event.name;
        feedbackSelect.appendChild(option);
      });
    }
  }

  function fillFeedbackSelect() {
    const feedbackSelect = document.getElementById("eventAttended");
    if (!feedbackSelect) return;

    eventsData.forEach(event => {
      const option = document.createElement("option");
      option.value = event.name;
      option.textContent = event.name;
      feedbackSelect.appendChild(option);
    });
  }

  function setupRegistrationForm() {
    const form = document.getElementById("registrationForm");
    const participationType = document.getElementById("participationType");
    const teamName = document.getElementById("teamName");
    const teamSize = document.getElementById("teamSize");

    function toggleTeamFields() {
      const isTeam = participationType.value === "Team";
      teamName.disabled = !isTeam;
      teamSize.disabled = !isTeam;

      if (!isTeam) {
        teamName.value = "";
        teamSize.value = "";
        clearFieldError("teamNameError");
        clearFieldError("teamSizeError");
      }
    }

    participationType.addEventListener("change", toggleTeamFields);
    toggleTeamFields();

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      clearAllErrors();
      clearMessage("registrationMessage");

      const name = document.getElementById("studentName").value.trim();
      const email = document.getElementById("studentEmail").value.trim();
      const mobile = document.getElementById("mobileNumber").value.trim();
      const regNo = document.getElementById("registerNumber").value.trim();
      const selectedEvent = document.getElementById("eventSelect").value;
      const type = participationType.value;
      const tName = teamName.value.trim();
      const tSize = teamSize.value.trim();

      let valid = true;

      if (!/^[A-Za-remaining ]{3,40}$/.test(name)) {
        showError("studentNameError", "Enter a valid name using letters only.");
        valid = false;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError("studentEmailError", "Enter a valid email address.");
        valid = false;
      }

      if (!/^[6-9]\d{9}$/.test(mobile)) {
        showError("mobileNumberError", "Enter a valid 10-digit mobile number.");
        valid = false;
      }

      if (!/^[A-Za-z0-9-]{6,15}$/.test(regNo)) {
        showError("registerNumberError", "Register number must be 6-15 characters and may contain letters, numbers, or hyphen.");
        valid = false;
      }

      if (!selectedEvent) {
        showError("eventSelectError", "Please choose an event.");
        valid = false;
      }

      if (!type) {
        showError("participationTypeError", "Please choose Solo or Team.");
        valid = false;
      }

      const chosenEvent = eventsData.find(ev => ev.name === selectedEvent);

      if (chosenEvent && chosenEvent.status === "Closed") {
        showError("eventSelectError", "This event is closed. Please choose an open event.");
        valid = false;
      }

      if (type === "Team") {
        if (tName.length < 3) {
          showError("teamNameError", "Team name should be at least 3 characters.");
          valid = false;
        }

        const size = Number(tSize);
        if (!Number.isInteger(size) || size < 2 || size > 4) {
          showError("teamSizeError", "Team size must be between 2 and 4.");
          valid = false;
        }
      }

      const isDuplicate = registrations.some(
        item => item.regNo.toLowerCase() === regNo.toLowerCase() && item.event === selectedEvent
      );

      if (isDuplicate) {
        showMessage(
          "registrationMessage",
          "This register number is already registered for the selected event.",
          "error"
        );
        valid = false;
      }

      if (!valid) return;

      const participant = {
        name,
        email,
        mobile,
        regNo,
        event: selectedEvent,
        type,
        teamName: type === "Team" ? tName : "Not applicable",
        teamSize: type === "Team" ? tSize : "Not applicable"
      };

      registrations.push(participant);
      updateRegistrationCount();
      renderRegistrations();

      showMessage(
        "registrationMessage",
        "Registration successful. Participant details have been saved for this session.",
        "success"
      );

      form.reset();
      toggleTeamFields();
    });
  }

  function renderRegistrations() {
    const list = document.getElementById("registrationList");

    if (registrations.length === 0) {
      list.classList.add("empty-state");
      list.textContent = "No participants registered yet.";
      return;
    }

    list.classList.remove("empty-state");
    list.innerHTML = "";

    registrations.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "participant-card";

      card.innerHTML = `
        <h4>Participant ${index + 1}</h4>
        <div class="card-row">
          <div><strong>Name:</strong> ${item.name}</div>
          <div><strong>Email:</strong> ${item.email}</div>
          <div><strong>Mobile:</strong> ${item.mobile}</div>
          <div><strong>Register No:</strong> ${item.regNo}</div>
          <div><strong>Event:</strong> ${item.event}</div>
          <div><strong>Type:</strong> ${item.type}</div>
          <div><strong>Team Name:</strong> ${item.teamName}</div>
          <div><strong>Team Size:</strong> ${item.teamSize}</div>
        </div>
      `;

      list.appendChild(card);
    });
  }

  function updateRegistrationCount() {
    const count = document.getElementById("registrationCount");
    if (count) count.textContent = registrations.length;
  }

  function setupFeedbackForm() {
    const form = document.getElementById("feedbackForm");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      clearFeedbackErrors();
      clearMessage("feedbackMessage");

      const name = document.getElementById("feedbackName").value.trim();
      const regNo = document.getElementById("feedbackRegisterNumber").value.trim();
      const eventAttended = document.getElementById("eventAttended").value;
      const rating = document.getElementById("rating").value;
      const comments = document.getElementById("comments").value.trim();

      let valid = true;

      if (!/^[A-Za-remaining ]{3,40}$/.test(name)) {
        showError("feedbackNameError", "Enter a valid student name.");
        valid = false;
      }

      if (!/^[A-Za-z0-9-]{6,15}$/.test(regNo)) {
        showError("feedbackRegisterNumberError", "Enter a valid register number.");
        valid = false;
      }

      if (!eventAttended) {
        showError("eventAttendedError", "Please select the event attended.");
        valid = false;
      }

      if (!rating || Number(rating) < 1 || Number(rating) > 5) {
        showError("ratingError", "Please select a rating from 1 to 5.");
        valid = false;
      }

      if (comments.length < 20) {
        showError("commentsError", "Comments must be at least 20 characters long.");
        valid = false;
      }

      if (!valid) return;

      const feedback = {
        name,
        regNo,
        eventAttended,
        rating: Number(rating),
        comments
      };

      feedbackEntries.push(feedback);
      renderFeedbackList();
      updateFeedbackSummary();

      showMessage(
        "feedbackMessage",
        "Feedback submitted successfully. Thank you for your response.",
        "success"
      );

      form.reset();
    });
  }

  function renderFeedbackList() {
    const list = document.getElementById("feedbackList");

    if (feedbackEntries.length === 0) {
      list.classList.add("empty-state");
      list.textContent = "No feedback records yet.";
      return;
    }

    list.classList.remove("empty-state");
    list.innerHTML = "";

    feedbackEntries
      .slice()
      .reverse()
      .forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "feedback-card";

        card.innerHTML = `
          <h4>Feedback ${feedbackEntries.length - index}</h4>
          <div class="card-row">
            <div><strong>Name:</strong> ${item.name}</div>
            <div><strong>Register No:</strong> ${item.regNo}</div>
            <div><strong>Event:</strong> ${item.eventAttended}</div>
            <div><strong>Rating:</strong> ${item.rating}/5</div>
          </div>
          <p><strong>Comments:</strong> ${item.comments}</p>
        `;

        list.appendChild(card);
      });
  }

  function updateFeedbackSummary() {
    const summary = document.getElementById("feedbackSummary");
    const avg = document.getElementById("averageRating");

    if (feedbackEntries.length === 0) {
      summary.classList.add("empty-state");
      summary.textContent = "No feedback submitted yet.";
      avg.textContent = "0.0";
      return;
    }

    summary.classList.remove("empty-state");

    const total = feedbackEntries.length;
    const totalRating = feedbackEntries.reduce((accumulator, item) => accumulator + item.rating, 0);
    const average = (totalRating / total).toFixed(1);

    avg.textContent = average;

    const lastEntry = feedbackEntries[feedbackEntries.length - 1];
    summary.innerHTML = `
      <div class="participant-card">
        <div><strong>Total Feedback:</strong> ${total}</div>
        <div><strong>Latest Event:</strong> ${lastEntry.eventAttended}</div>
        <div><strong>Latest Rating:</strong> ${lastEntry.rating}/5</div>
        <div><strong>Latest Student:</strong> ${lastEntry.name}</div>
      </div>
    `;

    renderFeedbackList();
  }

  function showError(id, message) {
    const el = document.getElementById(id);
    if (el) el.textContent = message;
  }

  function clearFieldError(id) {
    const el = document.getElementById(id);
    if (el) el.textContent = "";
  }

  function clearAllErrors() {
    const ids = [
      "studentNameError",
      "studentEmailError",
      "mobileNumberError",
      "registerNumberError",
      "eventSelectError",
      "participationTypeError",
      "teamNameError",
      "teamSizeError"
    ];
    ids.forEach(clearFieldError);
  }

  function clearFeedbackErrors() {
    const ids = [
      "feedbackNameError",
      "feedbackRegisterNumberError",
      "eventAttendedError",
      "ratingError",
      "commentsError"
    ];
    ids.forEach(clearFieldError);
  }

  function showMessage(id, message, type) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
    el.className = `message-box ${type}`;
  }

  function clearMessage(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = "";
    el.className = "message-box";
  }