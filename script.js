// Import the AI function from our new module
import { fetchCareerInsights } from './gemini-insights.js';

// --- Your Model's Formula Goes Here! ---
const MODEL_SLOPE = 9345.94244312237;      
const MODEL_INTERCEPT = 26816.19224403119; 

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
        // Call the imported function to get insights
        const insightsText = await fetchCareerInsights(lastExperience, lastFormattedSalary);
        geminiResult.textContent = insightsText;

    } catch (error) {
        console.error("Error fetching Gemini insights:", error);
        geminiResult.textContent = "Sorry, something went wrong while fetching career insights. Please try again later.";
    } finally {
        // Hide loader and re-enable button regardless of success or failure
        loader.classList.add('hidden');
        geminiButton.disabled = false;
    }
});
