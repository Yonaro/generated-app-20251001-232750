# FloatFlow: Petty Cash Approval System

A visually stunning and minimalist petty cash approval system for seamless fund request workflows.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Yonaro/generated-app-20251001-232656)

FloatFlow is a modern, minimalist, and visually stunning web application for managing petty cash requests and approvals within an organization. Built on Cloudflare's edge network, it provides a lightning-fast and seamless experience for employees, managers, and finance teams. The system facilitates a transparent workflow: employees can submit requests for funds, managers can review and approve or reject them, and the finance department can track and disburse the cash. Every action is logged, creating a clear audit trail. The interface is designed with a 'less is more' philosophy, focusing on clarity, ease of use, and visual elegance to make financial administration a delightful experience.

## ✨ Key Features

*   **Role-Based Access Control**: Separate, tailored interfaces for Requesters, Managers, and Finance personnel.
*   **Seamless Request Workflow**: Intuitive process for creating, submitting, and tracking petty cash requests.
*   **Approval Management**: Managers can easily review, approve, or reject pending requests.
*   **Financial Oversight**: The finance team can view all approved requests and mark them as disbursed.
*   **Request History**: A detailed timeline view for each request, providing a clear audit trail of all status changes.
*   **Modern & Responsive UI**: A beautiful, minimalist interface built with Tailwind CSS and shadcn/ui that works flawlessly on all devices.
*   **High-Performance**: Built on Cloudflare Workers and Durable Objects for a globally fast and responsive user experience.

## 🛠️ Technology Stack

*   **Frontend**: React, Vite, React Router, TypeScript
*   **Backend**: Cloudflare Workers, Hono
*   **State Management**: Zustand
*   **UI**: Tailwind CSS, shadcn/ui, Framer Motion, Lucide React
*   **Forms**: React Hook Form with Zod for validation
*   **Storage**: Cloudflare Durable Objects

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your system:
*   [Node.js](https://nodejs.org/) (v18 or later recommended)
*   [Bun](https://bun.sh/)
*   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) - Cloudflare's command-line tool for Workers.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/floatflow.git
    cd floatflow
    ```

2.  **Install dependencies:**
    This project uses `bun` for package management.
    ```sh
    bun install
    ```

## 💻 Development

To start the local development server, which includes both the Vite frontend and the Hono backend running on `workerd`:

```sh
bun dev
```

The application will be available at `http://localhost:3000` (or the port specified in your environment). The frontend will automatically proxy API requests to the local worker instance.

## ☁️ Deployment

This project is designed for easy deployment to the Cloudflare network.

1.  **Build the application:**
    The `deploy` script handles building the Vite frontend and the worker.

2.  **Deploy to Cloudflare:**
    Run the following command to deploy your application. Make sure you are logged into your Cloudflare account via the Wrangler CLI (`wrangler login`).

    ```sh
    bun run deploy
    ```

Alternatively, you can deploy directly from your GitHub repository using the button below.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Yonaro/generated-app-20251001-232656)