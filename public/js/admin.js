// Admin Actions
function blockUser() {
    alert("User has been blocked successfully.");
}

function deleteUser() {
    alert("User has been deleted successfully.");
}

function deleteResource() {
    alert("Resource has been deleted successfully.");
}

const contentForm = document.getElementById('contentForm');
if (contentForm) {
    contentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        alert(`Resource "${title}" has been added successfully.`);
        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
    });
}
