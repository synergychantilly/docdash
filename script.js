document.addEventListener('DOMContentLoaded', () => {
    const nameForm = document.getElementById('nameForm');
    const firstNameInput = document.getElementById('firstNameInput');
    const lastNameInput = document.getElementById('lastNameInput');
    const documentSection = document.getElementById('documentSection');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const buttonList = document.getElementById('buttonList');
    const errorMessage = document.getElementById('errorMessage');
    const pageTitle = document.getElementById('pageTitle');
    const roleTag = document.getElementById('roleTag');

    // **Document URL Mapping**
    const documentURLMapping = {
        "Employee Application": "https://docuseal.com/d/R9tHhdF4Q389j2",
        "Applicant Profile": "https://docuseal.com/d/kAFt7RBfPpSspY",
        "Competency Checklist": "https://docuseal.com/d/TKGurJ6FgACerv",
        "References List": "https://docuseal.com/d/HJWCrNeNAqeGcA",
        "Job Description Form": "https://docuseal.com/d/yE7cDNCj2i93y2",
        "Hepatitis B Declination": "https://docuseal.com/d/zoHzfsjXoniAB7",
        "Flu Vaccine Acceptance": "https://docuseal.com/d/NFoLhhgAS5JCau",
        "VA Sworn Statement": "https://docuseal.com/d/LwJR5pZtLrryoN",
        "Non-Medical Acknowledgement": "https://docuseal.com/d/weTLTXDiCgd7kG",
        "Arbitration Agreement": "https://docuseal.com/d/1yYcNF68N5jufW",
        "Confidentiality Agreement": "https://docuseal.com/d/EjgvnrDhJn6W3x",
        // Add more documents and their URLs here
    };

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
        roleTag.classList.add('hidden');

        if (!firstName || !lastName) { // Ensure email is also entered
            showError('Please enter first name, last name.');
            return;
        }

        try {
            // Fetch the JSON data from Pantry
            const response = await fetch(PANTRY_URL, { method: 'GET' });
            if (!response.ok) {
                throw new Error('Failed to load data.');
            }

            const data = await response.json();

            console.log('Fetched data:', data);

            if (!data.users || !Array.isArray(data.users)) {
                throw new Error('Invalid JSON structure: "users" array is missing.');
            }

            const users = data.users;

            console.log('Users:', users);

            // Search for the user primarily by email, then fallback to name
            const user = users.find(user => user.email.toLowerCase() === email);

            if (user && user.firstName.toLowerCase() === firstName && user.lastName.toLowerCase() === lastName) {
                displayUserDocuments(user);
                hideSearchForm();
            } else {
                showError("Hm. We can't seem to find your information. Please ensure the information entered is correct and notify the office if the issue persists.");
            }
        } catch (error) {
            showError('Technical error occurred, please notify the office if you received this message.');
            console.error(error);
        }
    });

    function displayUserDocuments(user) {
        const unsignedDocuments = user.documents.filter(doc => !doc.isSigned);
        const numUnsigned = unsignedDocuments.length;

        roleTag.textContent = user.role;
        roleTag.classList.remove('hidden');

        if (numUnsigned === 0) {
            welcomeMessage.textContent = "There are no documents for you to sign at this time. Thank you.";
            buttonList.innerHTML = '';
        } else {
            const documentText = numUnsigned === 1 ? 'document' : 'documents';
            welcomeMessage.textContent = `Welcome, ${capitalize(user.firstName)}! You have ${numUnsigned} ${documentText} to sign and complete.`;
            buttonList.innerHTML = '';

            unsignedDocuments.forEach(doc => {
                const button = document.createElement('a');
                button.textContent = doc.documentName;
                button.classList.add('document-button');
                const url = documentURLMapping[doc.documentName];

                if (url) {
                    button.href = url;
                    button.target = '_blank';
                } else {
                    button.href = '#';
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        alert('No URL available for this document.');
                    });
                }
                buttonList.appendChild(button);
            });
        }
        documentSection.classList.remove('hidden');
    }

    function hideSearchForm() {
        nameForm.classList.add('hidden');
        pageTitle.classList.add('hidden');
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        roleTag.classList.add('hidden');
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});
