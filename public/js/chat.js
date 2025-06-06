const chatForm = document.getElementById('chatForm');
const chatMessages = document.getElementById('chatMessages');

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = document.getElementById('chatInput').value;
    
    // Create new message element
    const newMessage = document.createElement('p');
    newMessage.innerHTML = `<strong>You:</strong> ${message}`;
    
    // Append message to chat window
    chatMessages.appendChild(newMessage);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Clear the input field
    document.getElementById('chatInput').value = '';
});
