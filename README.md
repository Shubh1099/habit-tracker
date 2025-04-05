# Habit Tracker

A simple, intuitive habit tracking application that helps you build and maintain positive habits by tracking your daily progress and providing visual feedback on your journey.


## 📝 Features

- **Habit Dashboard**: Visualize all your habits in one place
- **Daily Tracking**: Mark habits as complete each day
- **Streak Counter**: Stay motivated by tracking your consistency
- **Progress Charts**: Heatmap style visualization like github

## 🚀 Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Shubh1099/habit-tracker.git
   cd habit-tracker
   cd frontend/habit-tracker
   ```

2. Install dependencies
   ```bash
   npm install
   ```
   
3. Create a `.env` file in the root directory and add your environment variables
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development server
   ```bash
   npm run dev
   ```
5. Start backend server
   ```bash
   cd backend 
   npm run dev
   ```
6. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Tech Stack

- **Frontend**: React.js,TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT

## 📸 Screenshots
![Screenshot](https://github.com/Shubh1099/habit-tracker/blob/main/frontend/habit-tracker/src/assets/screenshots/screenshot.png)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

    1. Fork the repository
    2. Create your feature branch (`git checkout -b feature/amazing-feature`)
    3. Commit your changes (`git commit -m 'Add some amazing feature'`)
    4. Push to the branch (`git push origin feature/amazing-feature`)
    5. Open a Pull Request
