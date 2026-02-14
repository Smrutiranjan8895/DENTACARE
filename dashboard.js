// Protect route and keep return target
if (!isAuthenticated()) {
  window.location.href = `auth.html?next=${encodeURIComponent('dashboard.html')}`;
}

// Display user info
window.addEventListener('DOMContentLoaded', () => {
  const email = getUserEmail();
  if (email) {
    const welcomeMsg = document.querySelector('.dashboard h1');
    if (welcomeMsg) {
      welcomeMsg.textContent = `Welcome, ${email}`;
    }
  }
  loadAppointments();
});

function logout() {
  clearAuth();
  window.location.href = "auth.html";
}

// Load appointments from backend
async function loadAppointments() {
  try {
    const data = await apiRequest(getEndpoint('APPOINTMENTS'), {
      method: 'GET'
    });

    const list = document.getElementById("appointmentList");
    list.innerHTML = '';

    if (data.appointments && data.appointments.length > 0) {
      data.appointments.forEach(apt => {
        const li = document.createElement("li");
        li.innerHTML = `
          <span>${apt.name} | ${apt.date}${apt.time ? ' ' + apt.time : ''} | ${apt.service}</span>
          <button class="btn-delete" onclick="deleteAppointment('${apt.id}')">Delete</button>
        `;
        list.appendChild(li);
      });
    } else {
      list.innerHTML = '<li>No appointments yet</li>';
    }
  } catch (error) {
    console.error('Failed to load appointments:', error);
    document.getElementById("appointmentList").innerHTML = '<li>Failed to load appointments</li>';
  }
}

// Add appointment
async function addAppointment() {
  const name = document.getElementById("name").value.trim();
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const service = document.getElementById("service").value.trim();

  if (!name) {
    alert("Please enter a name");
    return;
  }
  if (!date) {
    alert("Please select a date");
    return;
  }
  if (!time) {
    alert("Please select a time");
    return;
  }
  if (!service) {
    alert("Please enter a service");
    return;
  }

  try {
    const btn = event.target;
    btn.disabled = true;
    btn.textContent = "Adding...";

    await apiRequest(getEndpoint('APPOINTMENTS'), {
      method: 'POST',
      body: JSON.stringify({ name, date, time, service })
    });

    document.getElementById("name").value = "";
    document.getElementById("date").value = "";
    document.getElementById("service").value = "";
    document.getElementById("time").value = "";

    btn.disabled = false;
    btn.textContent = "Add";

    alert("Appointment added successfully!");
    loadAppointments();
  } catch (error) {
    alert("Failed to add appointment: " + error.message);
    const btn = event.target;
    btn.disabled = false;
    btn.textContent = "Add";
  }
}

// Delete appointment
async function deleteAppointment(id) {
  if (!confirm('Delete this appointment?')) return;

  try {
    await apiRequest(getEndpoint('APPOINTMENTS') + '/' + id, {
      method: 'DELETE'
    });

    alert("Appointment deleted!");
    loadAppointments();
  } catch (error) {
    alert("Failed to delete: " + error.message);
  }
}
