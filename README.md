# Megaverse Universe Creator

🌌 **Welcome to the Megaverse!** 🌌  
This project is a React-based application that solves Crossmint's coding challenge to mint a new "Megaverse" into existence. Using a RESTful API, the app creates an X-shaped pattern of 🪐POLYanets in a 2D astral grid, showcasing automation, clean coding practices, and resilience.

## Live Demo
[Megaverse Universe](https://megaverse-universe.vercel.app/)

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [How It Works](#how-it-works)
- [Challenge Requirements Addressed](#challenge-requirements-addressed)
- [Future Enhancements](#future-enhancements)
- [License](#license)
- [Contributing](#contributing)

## Features
- Dynamically generates a grid representing the Megaverse.
- Automates the creation of an X-shape pattern using API calls.
- Visual feedback for real-time updates as Polyanets are minted.
- Modular and scalable code structure with React components.
- Error handling and resilience for API interactions.

## Tech Stack
- **Frontend**: React, TypeScript
- **Styling**: CSS/Tailwind CSS (optional for custom design)
- **API Interaction**: Axios
- **Environment Management**: .env for secure handling of API URLs and Candidate ID

## Setup Instructions
To get started with the Megaverse X Creator, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/megaverse-x-creator.git
   cd megaverse-x-creator
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Add a `.env` file** with your API details:
   ```plaintext
   NEXT_PUBLIC_API_BASE_URL=https://challenge.crossmint.io/api
   NEXT_PUBLIC_CANDIDATE_ID=your_candidate_id_here
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

## How It Works
- The app renders an 11x11 grid of astral objects (🌌 by default).
- Clicking the "Create X-Shape" button:
  - Dynamically calculates positions for an X-shape.
  - Sends POST requests to the `/polyanets` endpoint to mint 🪐POLYanets.
  - The grid visually updates to reflect the minted objects.

## Challenge Requirements Addressed
- **Clean and understandable code**: Structured with reusable components and services.
- **Resilient to errors**: Handles API failures gracefully with error logging.
- **Automated solution**: Eliminates the need for manual API calls.
- **Proper abstraction**: Encapsulates logic in components and utility functions.

## Future Enhancements
- Add support for Soloons and Comeths to expand the grid.
- Implement Phase 2 to create larger, more complex patterns.
- Enhance UI/UX with animations or interactive elements.

## License
This project is open-source and available under the MIT License.

## Contributing
Contributions and feedback are welcome! If you have suggestions for improvements or new features, feel free to open an issue or submit a pull request.