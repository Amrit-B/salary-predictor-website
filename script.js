
const MODEL_SLOPE = 11481.4007555;      
const MODEL_INTERCEPT = 64790.6934339; 

// Get references to all HTML elements
const predictionForm = document.getElementById('prediction-form');
const experienceInput = document.getElementById('experience');
const resultContainer = document.getElementById('result-container');
const resultElement = document.getElementById('result');
const messageElement = document.getElementById('message');

// Gemini-related elements
const geminiButtonContainer = document.getElementById('gemini-button-container');
const geminiButton = document.getElementById('gemini-button');
const geminiInsightsContainer = document.getElementById('gemini-insights-container');
const loader = document.getElementById('loader');
const geminiResult = document.getElementById('gemini-result');

// Store latest prediction to pass to Gemini
let lastExperience = 0;
let lastFormattedSalary = '';

// Listen for the main form submission
predictionForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const experience = parseFloat(experienceInput.value);
    
    // Hide previous results
    messageElement.textContent = '';
    geminiButtonContainer.classList.add('hidden');
    geminiInsightsContainer.classList.add('hidden');

    if (isNaN(experience) || experience < 0) {
        resultElement.textContent = 'Invalid Input';
        messageElement.textContent = 'Please enter a valid number of years.';
        resultContainer.classList.remove('hidden');
        return;
    }

    const predictedSalary = (MODEL_SLOPE * experience) + MODEL_INTERCEPT;
    const formattedSalary = '$' + predictedSalary.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    resultElement.textContent = formattedSalary;

    if (experience > 40) {
        messageElement.textContent = 'Are you immortal?!';
    } else if (experience > 10) {
        messageElement.textContent = 'You are a senior!';
    } else if (experience > 2) {
        messageElement.textContent = 'You are at a mid-level in your career!';
    } else {
        messageElement.textContent = 'You are getting started at a junior level!';
    }
    
    // Store results and show the Gemini button
    lastExperience = experience;
    lastFormattedSalary = formattedSalary;
    geminiButtonContainer.classList.remove('hidden');
    resultContainer.classList.remove('hidden');
});

// Listen for clicks on the Gemini button
geminiButton.addEventListener('click', async function() {
    // Show loader and insights container, and disable the button
    loader.classList.remove('hidden');
    geminiInsightsContainer.classList.remove('hidden');
    geminiResult.textContent = '';
    geminiButton.disabled = true;

    try {
        // UPDATE: This is the new part. We are now calling OUR OWN API endpoint.
        const response = await fetch('/api/get-insights', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                experience: lastExperience,
                salary: lastFormattedSalary,
            }),
        });

        if (!response.ok) {
            // If our own serverless function returns an error, we'll show it.
            const errorData = await response.json();
            throw new Error(errorData.message || 'The server responded with an error.');
        }

        const data = await response.json();
        geminiResult.textContent = data.insights;

    } catch (error) {
        console.error("Error fetching insights:", error);
        geminiResult.textContent = `Sorry, an error occurred: ${error.message}`;
    } finally {
        // Hide loader and re-enable button regardless of success or failure
        loader.classList.add('hidden');
        geminiButton.disabled = false;
    }
});
