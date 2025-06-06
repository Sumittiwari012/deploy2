const bookingForm = document.getElementById('bookingForm');

bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const therapist = document.getElementById('therapist').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    console.log(`Booked with: ${therapist}`);
    console.log(`Date: ${date}`);
    console.log(`Time: ${time}`);

    alert("Your session is booked successfully!");
});
