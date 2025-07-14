Salary Predictor Web App

This project takes a machine learning model, originally built in a Jupyter Notebook, and deploys it as an interactive web application using GitHub Pages.
Live Demo: https://amrit-b.github.io/salary-predictor-website/

Description

This web application predicts a person's salary based on their years of professional experience. The prediction is calculated using a simple linear regression model that was trained on a dataset of salary information.

The primary goal of this project was to learn how to transition a data science project from a Python environment to a live, user-facing website that can be shared with anyone.
How It Works

The core of this project is translating a machine learning model into a format that can run in a web browser.

    Model Training (Offline): A linear regression model was trained in Python using the scikit-learn library on the Salary_Data.csv dataset.

    Extracting the Formula: The formula for a simple linear regression is y = mx + c. The key values from the trained model—the slope (m) and the intercept (c)—were extracted.

    Implementing in JavaScript: These slope and intercept values were hardcoded into the project's JavaScript. The website uses these values to calculate the predicted salary (y) based on the years of experience (x) entered by the user.

This approach allows the predictive power of the model to be used on a static website without needing a live Python backend.
How to Use

    Navigate to the live demo link above.

    Enter a number (including decimals) into the "Years of Professional Experience" input field.

    Click the "Predict Salary" button.

    The estimated annual salary will be displayed below the button.

Files in this Repository

    index.html: This is the main file for the website. It contains the HTML structure, Tailwind CSS for styling, and the JavaScript logic for calculating the salary prediction.

    README.md: This file, providing an overview and documentation for the project.

(The original Python script and .csv data file are not included in this repository as they are only needed for the initial model training step.)
