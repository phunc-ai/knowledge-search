# Installation Guide

## Frontend (ReactJS)

To install the dependencies for the frontend, follow these steps:

1. Navigate to the frontend directory:

   ```bash
   cd frontend/
   ```

2. Install the dependencies using npm:
   ```bash
   npm install
   ```

## Backend (Python)

To install the dependencies for the backend, follow these steps:

1. Navigate to the backend directory:

   ```bash
   cd backend/
   ```

2. Create a new Conda environment with a specific name and Python version:

   ```bash
   conda create --name eks python=3.12
   ```

3. Activate the newly created environment:

   ```bash
   conda activate eks
   ```

4. Install the dependencies from `requirements.txt`:
   ```bash
   pip install -r requirements.txt
   ```

# Running the Application

## Frontend

To run the frontend application, follow these steps:

1. Navigate to the frontend directory:

   ```bash
   cd frontend/
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open your browser and go to `http://localhost:5173` to view the application.

## Backend

To run the backend application, follow these steps:

1. Ensure the Conda environment is activated:

   ```bash
   conda activate eks
   ```

2. Start the backend server:

   ```bash
   python main.py
   ```

3. The backend server should now be running on `http://localhost:5000`.
