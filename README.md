# Employee Task Management System

A modern employee task management system built with Vite, React, and TypeScript. This application provides a comprehensive solution for managing employee tasks, assignments, and tracking progress.

## 🔗 Links

- GitHub Repository: [https://github.com/Ashish-kumar-upadhyay/Employee-task](https://github.com/Ashish-kumar-upadhyay/Employee-task)
- Live Demo: [https://employee-task-psi.vercel.app/](https://employee-task-psi.vercel.app/)

## Features

- 📝 Task Creation and Management
- 👥 Employee Management
- 📊 Task Status Tracking
- 🔄 Real-time Updates
- 🎨 Clean and Responsive UI
- 🔒 Secure Authentication
- 📱 Mobile-friendly Design

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Redux Toolkit (for state management)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd employee-task
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Development

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

This will create a `dist` folder with optimized production files.

### Deployment

1. **Vercel Deployment**:
   - Push your code to GitHub
   - Go to [Vercel](https://vercel.com)
   - Import your repository
   - Configure build settings:
     - Framework Preset: Vite
     - Build Command: `npm run build` or `yarn build`
     - Output Directory: `dist`
   - Deploy

2. **Netlify Deployment**:
   - Push your code to GitHub
   - Go to [Netlify](https://www.netlify.com)
   - Import your repository
   - Configure build settings:
     - Build Command: `npm run build` or `yarn build`
     - Publish Directory: `dist`
   - Deploy

3. **Manual Deployment**:
   - Run `npm run build` or `yarn build`
   - Upload the contents of the `dist` folder to your hosting provider
   - Configure your server to serve the `index.html` file for all routes

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_URL=your_api_url
VITE_APP_NAME=Employee Task Manager
```

## Project Structure

```
employee-task/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── store/         # Redux store configuration
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   └── App.tsx        # Main application component
├── public/            # Static assets
└── package.json       # Project dependencies
```

## Usage

1. Login to the system using your credentials
2. Create new tasks and assign them to employees
3. Track task progress and update status
4. Manage employee profiles and permissions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any queries or support, please contact [ashishkumarupadhyay@0328@gmail.com](mailto:ashishkumarupadhyay@0328@gmail.com)
