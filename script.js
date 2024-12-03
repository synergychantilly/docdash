document.addEventListener('DOMContentLoaded', () => {
    const nameForm = document.getElementById('nameForm');
    const firstNameInput = document.getElementById('firstNameInput');
    const lastNameInput = document.getElementById('lastNameInput');
    const documentSection = document.getElementById('documentSection');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const buttonList = document.getElementById('buttonList');
    const errorMessage = document.getElementById('errorMessage');
    const pageTitle = document.getElementById('pageTitle');
    const roleTag = document.getElementById('roleTag'); // Reference to the role tag

    // Pantry Configuration
    const PANTRY_URL = 'https://getpantry.cloud/apiv1/pantry/001967b7-939b-4e58-a253-3b1301a854e5/basket/docdash-1'; // Replace with your Pantry URL

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
        roleTag.classList.add('hidden'); // Hide role tag initially

        if (!firstName || !lastName) {
            showError('Please enter both first and last names.');
            return;
        }

        try {
            // Fetch the JSON data from Pantry
            const response = await fetch(PANTRY_URL, { method: 'GET' });
            if (!response.ok) {
                throw new Error('Failed to load data.');
            }

            const data = await response.json();

            console.log('Fetched data:', data); // Log the entire data for debugging

            // Check if users exist
            if (!data.users || !Array.isArray(data.users)) {
                throw new Error('Invalid JSON structure: "users" array is missing.');
            }

            const users = data.users;

            console.log('Users:', users); // Log the users array for debugging

            // Search for the user
            const user = users.find(user => 
                user.firstName.toLowerCase() === firstName &&
                user.lastName.toLowerCase() === lastName
            );

            if (user) {
                displayUserDocuments(user);
                hideSearchForm(); // Hide the search form and title
            } else {
                showError("Hm. We can't seem to find your information. Please notify the office if the issue persists.");
            }
        } catch (error) {
            showError('Technical error occurred, please notify the office if you received this message.');
            console.error(error);
        }
    });

    function displayUserDocuments(user) {
        // Calculate the number of unsigned documents
        const unsignedDocuments = user.documents.filter(doc => !doc.isSigned);
        const numUnsigned = unsignedDocuments.length;

        // Display the role tag
        roleTag.textContent = user.role;
        roleTag.classList.remove('hidden');

        if (numUnsigned === 0) {
            // If no documents to sign
            welcomeMessage.textContent = "There are no documents for you to sign at this time. Thank you.";
            buttonList.innerHTML = ''; // Clear any buttons
        } else {
            const documentText = numUnsigned === 1 ? 'document' : 'documents';
            // Update the welcome message
            welcomeMessage.textContent = `Welcome, ${capitalize(user.firstName)}! You have ${numUnsigned} ${documentText} to sign and complete.`;

            // Clear any existing buttons
            buttonList.innerHTML = '';

            // Display unsigned documents only
            unsignedDocuments.forEach(doc => {
                const button = document.createElement('a');
                button.textContent = doc.documentName;
                button.classList.add('document-button');

                // Link to the document URL
                button.href = doc.documentURL;
                button.target = '_blank'; // Open in new tab

                buttonList.appendChild(button);
            });
        }

        documentSection.classList.remove('hidden');
    }

    function hideSearchForm() {
        nameForm.classList.add('hidden');
        pageTitle.classList.add('hidden'); // Hide the page title
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        roleTag.classList.add('hidden'); // Hide role tag if there's an error
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});
