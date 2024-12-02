document.addEventListener('DOMContentLoaded', () => {
    const nameForm = document.getElementById('nameForm');
    const firstNameInput = document.getElementById('firstNameInput');
    const lastNameInput = document.getElementById('lastNameInput');
    const documentSection = document.getElementById('documentSection');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const buttonList = document.getElementById('buttonList');
    const errorMessage = document.getElementById('errorMessage');

    nameForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Get user inputs
        const firstName = firstNameInput.value.trim().toLowerCase();
        const lastName = lastNameInput.value.trim().toLowerCase();

        // Clear previous messages and buttons
        welcomeMessage.textContent = '';
        buttonList.innerHTML = '';
        errorMessage.textContent = '';
        documentSection.classList.add('hidden');
        errorMessage.classList.add('hidden');

        if (!firstName || !lastName) {
            showError('Please enter both first and last names.');
            return;
        }

        try {
            // Fetch the JSON data
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error('Failed to load data.');
            }
            const data = await response.json();

            // Search for the user
            const user = data.users.find(user => 
                user.firstName.toLowerCase() === firstName &&
                user.lastName.toLowerCase() === lastName
            );

            if (user) {
                displayUserDocuments(user);
            } else {
                showError('User not found. Please check your input.');
            }
        } catch (error) {
            showError('An error occurred while processing your request.');
            console.error(error);
        }
    });

    function displayUserDocuments(user) {
        welcomeMessage.textContent = `Welcome, ${capitalize(user.firstName)} ${capitalize(user.lastName)}! Here are your documents:`;
        user.documents.forEach(doc => {
            const button = document.createElement('a');
            button.href = doc.documentURL;
            button.target = '_blank'; // Opens the link in a new tab
            button.textContent = doc.documentName;
            button.classList.add('document-button');
            buttonList.appendChild(button);
        });
        documentSection.classList.remove('hidden');
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});
