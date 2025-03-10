# Telegram Connection React App

This is a React application that allows users to connect their Telegram accounts through an authentication process using phone numbers and confirmation codes.

## Features
- Connect Telegram using a phone number.
- Receive and confirm authentication codes.
- Securely authenticate using a password.
- Display success messages upon successful connection.
- Backend API integration for authentication.

## Technologies Used
- React.js
- React Router
- libphonenumber-js (for phone number validation)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo.git
   cd your-repo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the environment variables:
    - Create a `.env` file in the root directory.
    - Add the following variable:
      ```env
      REACT_APP_API_URL=https://your-api-url.com
      ```

4. Start the development server:
   ```bash
   npm start
   ```

   The app will be available at `http://localhost:3000`.


## Deployment
To create a production build, run:
```bash
npm run build
```

