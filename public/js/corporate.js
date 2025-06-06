const bulkBookingForm = document.getElementById('bulkBookingForm');

bulkBookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const employeeCount = document.getElementById('employeeCount').value;
    const sessionDate = document.getElementById('sessionDate').value;

    console.log(`Bulk Booking for ${employeeCount} employees on ${sessionDate}`);
    alert(`Successfully booked for ${employeeCount} employees on ${sessionDate}`);
    
    // Clear form
    document.getElementById('employeeCount').value = '';
    document.getElementById('sessionDate').value = '';
});
