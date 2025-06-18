const consultationModeSelect = document.getElementById("consultationMode");
const consultationType = document.getElementById("consultationType");
const locationOptions = document.getElementById("locationOptions");
const loc = document.getElementById("loc");

let latitude = null;
let longitude = null;

function createTherapistModal(t, index, selectedDate) {
  const id = `therapistModal-${index}`;
  const timeOptions = t.timeSlots?.length
    ? t.timeSlots.map(slot => `<option>${slot}</option>`).join('')
    : '<option disabled>No Slots Available</option>';

  return `
    <div class="modal fade" id="${id}" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${t.name} - Full Profile</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p><strong>Education:</strong> ${t.edu || 'N/A'}</p>
            <p><strong>Experience:</strong> ${t.exp || 'N/A'}</p>
            <p><strong>Certifications:</strong> ${t.certification?.join(", ") || 'N/A'}</p>
            <p><strong>Languages:</strong> ${t.lang?.join(", ") || 'N/A'}</p>
            <p><strong>Treatment Approaches:</strong> ${t.treat_app?.join(", ") || 'N/A'}</p>
            <h6 class="mt-4">Booking</h6>
            <form class="booking-form" data-index="${index}">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Consultation Type</label>
                  <select class="form-select" disabled>
                    <option selected>${consultationType.value || 'N/A'}</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Mode</label>
                  <select class="form-select" disabled>
                    <option selected>${consultationModeSelect.value || 'N/A'}</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Date</label>
                  <input type="date" class="form-control" disabled value="${selectedDate || ''}" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Time Slot</label>
                  <select class="form-select time-slot" required>
                    <option selected disabled>Select Time</option>
                    ${timeOptions}
                  </select>
                </div>
              </div>
              <div class="mt-3">
                <button type="submit" class="btn btn-success confirm-booking" data-username="${t.username}">Confirm Booking</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}


function createTherapistCard(t, index) {
  const id = `therapistModal-${index}`;
  return `
    <div class="col">
      <div class="card profile-card">
        <div class="card-header text-center">
          <h5>${t.name}</h5>
        </div>
        <div class="card-body text-center">
          <img src="${t.image || '/default-avatar.png'}" class="rounded-circle mb-3" alt="Therapist">
          <p><strong>Specialist:</strong> ${t.specialization || 'N/A'}</p>
          <p><strong>Fee:</strong> ₹${t.price || 'N/A'}</p>
          <p class="availability"><strong>Available:</strong> ${t.available?.join(", ") || 'N/A'}</p>
          <a href="#${id}" data-bs-toggle="modal" class="btn btn-primary">Book Session</a>
        </div>
      </div>
    </div>
  `;
}

function renderTherapistCardsAndModals(therapists) {
  const cardsContainer = document.getElementById("therapistCards");
  const modalContainer = document.getElementById("modalContainer");
  const selectedDate = document.querySelector("input[type='date']").value;

  cardsContainer.innerHTML = "";
  modalContainer.innerHTML = "";

  if (!therapists.length) {
    cardsContainer.innerHTML = `<p class="text-center">No therapists available for the selected filters.</p>`;
    return;
  }

  therapists.forEach((t, index) => {
    cardsContainer.innerHTML += createTherapistCard(t, index);
    modalContainer.innerHTML += createTherapistModal(t, index, selectedDate);
  });

  attachBookingFormListeners();
}

function attachBookingFormListeners() {
  document.querySelectorAll(".booking-form").forEach(form => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const consultationTypeValue = consultationType.value;
      const consultationModeValue = consultationModeSelect.value;
      const timeSlot = this.querySelector(".time-slot").value;

      if (
        consultationTypeValue.toLowerCase() === "all" ||
        consultationModeValue.toLowerCase() === "all"
      ) {
        alert("Please complete the filter form by selecting a Consultation Type and Mode before booking.");
        return;
      }

      if (!timeSlot || timeSlot === "Select Time") {
        alert("Please select a time slot for booking.");
        return;
      }

      // Booking will be handled by separate confirm-booking event
    });
  });
}

consultationModeSelect.addEventListener("change", () => {
  if (consultationModeSelect.value.toLowerCase() === "in-person") {
    locationOptions.style.display = "block";
  } else {
    locationOptions.style.display = "none";
  }
  latitude = null;
  longitude = null;
});

loc.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        longitude = position.coords.longitude;
        latitude = position.coords.latitude;
        sendFiltersToServer();
      },
      (error) => {
        console.error("Error getting location:", error.message);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
});

document.querySelectorAll(".form-select, #manualAddress, input[type='date']").forEach(input => {
  input.addEventListener("change", sendFiltersToServer);
});

function sendFiltersToServer() {
  let selectedDate = document.querySelector("input[type='date']").value;
  if (!selectedDate) return;

  const selected = new Date(selectedDate);
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 7);

  selected.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  maxDate.setHours(0, 0, 0, 0);

  if (selected < today || selected > maxDate) {
    alert("Please select a date within the next 7 days.");
    document.querySelector("input[type='date']").value = "";
    return;
  }

  const mode = consultationModeSelect.value.toLowerCase();
  const manualAddress = document.getElementById("manualAddress").value.trim();

  if (mode === "virtual") {
    latitude = 0;
    longitude = 0;
  }

  if (mode === "in-person") {
    const hasValidAddress = manualAddress.length > 0;
    const hasValidCoordinates =
      latitude !== null && longitude !== null && latitude !== 0 && longitude !== 0;

    if (!hasValidAddress && !hasValidCoordinates) {
      alert("Please either enter a manual address or allow location access.");
      return;
    }
  }

  const data = {
    specialization: document.getElementById("specialization").value,
    language: document.getElementById("language").value,
    date: selectedDate,
    consultationType: consultationType.value,
    mode,
    address: manualAddress,
    latitude,
    longitude,
  };

  fetch("/api/filter-therapists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch therapist data");
      return res.json();
    })
    .then((response) => {
      if (response.success && response.matchedTherapists) {
        renderTherapistCardsAndModals(response.matchedTherapists);
      } else {
        renderTherapistCardsAndModals([]);
      }
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      alert(err.message || "Error fetching therapists.");
    });
}

document.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("confirm-booking")) {
    const username = e.target.getAttribute("data-username");
    const form = e.target.closest("form");
    const timeSlot = form.querySelector("select.form-select:not([disabled])")?.value;
    const selectedDate = document.querySelector("input[type='date']").value;
    const consultationTypeValue = consultationType.value;
    const consultationModeValue = consultationModeSelect.value;

    if (
      consultationTypeValue.toLowerCase() === "all" ||
      consultationModeValue.toLowerCase() === "all" ||
      !timeSlot || timeSlot === "Select Time" || !selectedDate
    ) {
      alert("Please complete all booking details (consultation type, mode, date, and time slot).");
      return;
    }

    fetch("/api/book-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        therapistUsername: username,
        date: selectedDate,
        time: timeSlot,
        consultationType: consultationTypeValue,
        mode: consultationModeValue
      })
    })
      .then(async res => {
        const data = await res.json();
        if (res.status === 409) {
          alert(data.message); // Booking conflict
        } else if (!res.ok) {
          throw new Error(data.message || "Failed to book session.");
        } else {
          alert("Booking confirmed successfully!");
        }
      })
      .catch(err => {
        console.error("Error while booking:", err);
        alert("An error occurred during booking.");
      });
  }
});
