# Steam Worth

Analyze your account's games and information. This project calculates the estimated value of your Steam account based on your games and information.

## Features

- **Searching**: Enter your steam id or url.
- **Account Value Calculation**: Calculate the total value of your account based on the games in your library.
- **Steam API Integration**: Fetch account details and game data using the Steam Web API.
- **Steam Game Collector API**: I have used SteamSpy API to collect games and if game doesnt exist in our db it will find the game for us and will add to db.
## Technologies

- **Frontend**: Next.js
- **Backend**: FastAPI
- **API Usage**: Steam Web API, Steam Game Collector API

## Getting Started

To run this project locally, follow the steps below.

### Prerequisites

- Node.js (for the frontend)
- Python 3.9+ (for the backend)

### Installation Steps

1. **Clone the Repository**

 ```bash
git clone https://github.com/HallosF1/Steam-Worth.git
cd Steam-Worth
```
2. **Frontend (Next.js) Setup**

Go to the frontend directory:

```bash
cd client
````
**Install the required dependencies:**

```bash
npm install
```
**Start the application:**

```bash
npm run dev
```
3. **Backend (FastAPI) Setup**

Go to the backend directory:

```bash
cd backend
```
Install the required Python dependencies:
```bash
pip install -r requirements.txt
```
Start the FastAPI server:
```bash
uvicorn main:app --reload
```
## Contributing
**If you'd like to contribute to this project, feel free to fork the repository and submit a pull request.**

1. **Fork the repository.**
2. **Create a new branch.**
3. **Make your changes.**
4. **Commit and submit a pull request.**
## License
**This project is licensed under the MIT License.**
