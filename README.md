# Cultivar: Cannabis Grow Tracker

> Cultivar is a sophisticated, all-in-one web application designed for cannabis growers to meticulously plan, track, and optimize their cultivation cycles. It provides a visually rich, 'greenhouse vibe' interface with earthy tones and intuitive controls. The application's core is a dynamic calendar that auto-generates a feeding schedule based on the selected strain and its growth stages. Users can create detailed 'Grows,' log daily activities like feeding, watering, pH/EC levels, and upload photos to monitor plant health. The application features extensive, pre-populated databases for over 50 cannabis strains and 20+ nutrient brands, complete with detailed information like NPK ratios and dosage instructions. A key feature is the 'Custom Mix Builder,' allowing users to create and save their own nutrient recipes. The platform also provides smart recommendations and data visualizations to help growers make informed decisions. Built on a serverless architecture using Cloudflare Workers and a single Durable Object for state management, Cultivar is designed to be fast, reliable, and scalable.

[cloudflarebutton]

## ✨ Key Features

-   **Extensive Strain Database**: Pre-populated with 50+ popular strains, including details on THC/CBD, flowering time, yield, and growth tips.
-   **Comprehensive Nutrient Database**: Features 20+ brands with NPK ratios, dosage instructions, and application frequency.
-   **Dynamic Grow Calendar**: Automatically generates a week-by-week feeding schedule based on your strain and start date.
-   **Daily Logging & Tracking**: Easily log feedings, pH/EC levels, plant health, and upload photos to monitor progress.
-   **Custom Mix Builder**: Create, save, and reuse your own custom nutrient recipes with drag-and-drop functionality.
-   **Data Visualization**: Interactive charts and reports to track trends and visualize your grow's progress over time.
-   **Smart Recommendations**: Get helpful tips and adjustments based on your strain and logged data.
-   **Responsive Design**: A beautiful, mobile-first 'greenhouse vibe' interface that works flawlessly on any device.

## 🛠️ Technology Stack

-   **Frontend**: React, Vite, TypeScript, Tailwind CSS
-   **UI Components**: shadcn/ui, Radix UI
-   **State Management**: Zustand
-   **Routing**: React Router
-   **Forms**: React Hook Form, Zod
-   **Backend**: Cloudflare Workers, Hono
-   **Storage**: Cloudflare Durable Objects
-   **Icons**: Lucide React
-   **Charts**: Recharts
-   **Animations**: Framer Motion

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Bun](https://bun.sh/) installed on your machine.
-   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) for interacting with the Cloudflare platform.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/cultivar.git
    cd cultivar
    ```

2.  **Install dependencies:**
    This project uses Bun for package management.
    ```sh
    bun install
    ```

3.  **Run the development server:**
    This command starts the Vite development server for the frontend and the Wrangler development server for the backend worker simultaneously.
    ```sh
    bun dev
    ```
    The application will be available at `http://localhost:3000`.

## Project Structure

The project is organized into three main directories:

-   `src/`: Contains the frontend React application, including pages, components, hooks, and styles.
-   `worker/`: Contains the backend Cloudflare Worker code, built with Hono. This is where API routes and Durable Object logic reside.
-   `shared/`: Contains TypeScript types and mock data shared between the frontend and the backend to ensure type safety.

## 🔧 Development

The frontend is a standard Vite + React application. The backend is a Cloudflare Worker that serves an API at `/api/*`.

All application state (grows, strains, nutrients, logs) is persisted in a single `GlobalDurableObject`. The `worker/entities.ts` file defines entity classes that abstract interactions with the Durable Object, making it easy to manage different data types.

When adding new API endpoints, modify `worker/user-routes.ts` and create or update the corresponding entity in `worker/entities.ts`.

## ☁️ Deployment

This application is designed for seamless deployment to the Cloudflare network.

1.  **Build the project:**
    This command bundles the frontend application and the worker for production.
    ```sh
    bun run build
    ```

2.  **Deploy to Cloudflare:**
    Make sure you are logged in to Wrangler (`wrangler login`). Then, run the deploy script:
    ```sh
    bun run deploy
    ```
    This will publish your worker and static assets to your Cloudflare account.

Or deploy directly with one click:

[cloudflarebutton]

## 📜 Available Scripts

-   `bun dev`: Starts the local development server for both frontend and backend.
-   `bun build`: Builds the application for production.
-   `bun lint`: Lints the codebase using ESLint.
-   `bun deploy`: Deploys the application to Cloudflare Workers.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.