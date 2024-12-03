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

    // JSONBin Configuration
    const JSONBIN_URL = 'https://api.jsonbin.io/v3/b/674f289cacd3cb34a8b35ca0'; // Replace with your JSONBin URL
    // If your bin is private, you might need to handle authentication differently

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
            // Fetch the JSON data from JSONBin
            const response = await fetch(JSONBIN_URL);
            if (!response.ok) {
                throw new Error('Failed to load data.');
            }

            const data = await response.json();

            console.log('Fetched data:', data); // Log the entire data for debugging

            // JSONBin v3 response structure
            if (!data.record || !data.record.users) {
                throw new Error('Invalid JSON structure: "users" array is missing.');
            }

            const users = data.record.users;

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
