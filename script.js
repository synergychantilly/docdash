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

    // Optional Back Button
    // const backButton = document.getElementById('backButton');

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
                hideSearchForm(); // Hide the search form and title
            } else {
                showError("Can't find you! Ask the office for assistance.");
            }
        } catch (error) {
            showError('An error occurred while processing your request.');
            console.error(error);
        }
    });

    function displayUserDocuments(user) {
        // Calculate the number of unsigned documents
        const unsignedDocuments = user.documents.filter(doc => !doc.isSigned);
        const numUnsigned = unsignedDocuments.length;
        const documentText = numUnsigned === 1 ? 'document' : 'documents';

        // Update the welcome message
        welcomeMessage.textContent = `Welcome, ${capitalize(user.firstName)}! You have ${numUnsigned} ${documentText} to sign and complete.`;

        // Display the role tag
        roleTag.textContent = user.role;
        roleTag.classList.remove('hidden');

        user.documents.forEach(doc => {
            const button = document.createElement('a');
            button.textContent = doc.documentName;
            button.classList.add('document-button');

            if (doc.isSigned) {
                // If the document is signed, disable the button
                button.classList.add('disabled');
                button.href = '#'; // Disabled buttons won't navigate
                button.addEventListener('click', (e) => e.preventDefault());
            } else {
                // If not signed, link to the document URL
                button.href = doc.documentURL;
                button.target = '_blank'; // Open in new tab
            }

            buttonList.appendChild(button);
        });

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

    // Optional Back Button Event Listener
    /*
    backButton.addEventListener('click', () => {
        // Show the search form and title
        nameForm.classList.remove('hidden');
        pageTitle.classList.remove('hidden');

        // Hide the document section and role tag
        documentSection.classList.add('hidden');
        roleTag.classList.add('hidden');

        // Clear input fields
        firstNameInput.value = '';
        lastNameInput.value = '';
    });
    */
});
