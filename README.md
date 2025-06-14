# CraftFolio - AI-Powered Portfolio Builder

CraftFolio is a modern, AI-powered portfolio builder that helps users create stunning professional portfolios with ease. Built with cutting-edge technologies, it offers a seamless experience for creating, customizing, and managing personal portfolios.

## 🚀 Features

- **AI-Powered Portfolio Generation**: Create professional portfolios using AI assistance
- **Multiple Portfolio Templates**: Choose from various pre-designed templates
- **Real-time Customization**: Simple interface for easy customization
- **Responsive Design**: Mobile-first approach ensuring perfect display across all devices
- **Authentication**: Secure user authentication using Clerk
- **Interactive UI**: Smooth animations and transitions using Framer Motion
- **State Management**: Efficient state management using Redux Toolkit
- **Database Integration**: Persistent storage using Prisma and Supabase
- **Chatbot Integration**: An intelligent chatbot to assist with portfolio creation.
- **Subdomain Deployment**: Deploy your portfolio to a custom subdomain (e.g., `yourname.craftfolio.com`).
- **Slug Deployment**: Deploy your portfolio to a custom slug (e.g., `craftfolio.com/yourname`).

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.3.1
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Animation**: Framer Motion
- **UI Components**: Radix UI
- **Authentication**: Clerk
- **Code Highlighting**: React Syntax Highlighter
- **PDF Processing**: PDF.js

### Backend
- **API**: Next.js API Routes
- **Database**: Prisma ORM
- **Cloud Storage**: Supabase
- **AI Integration**: Google Generative AI
- **Validation**: Zod

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Containerization**: Docker

## 🏗️ Project Structure

```
craftfolio/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── portfolio-sites/   # Portfolio templates
│   ├── my-portfolios/     # User portfolios
│   └── profile/          # User profile management
├── components/            # Reusable React components
├── lib/                  # Utility functions and configurations
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── store/               # Redux store configuration
```

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/AdityaRai24/Craft-folio.git
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with the following variables:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
DATABASE_URL=your_database_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
GOOGLE_AI_API_KEY=your_google_ai_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🐳 Docker Support

The project includes Docker configuration for easy deployment:

# Build the Docker image
docker build -t adityarai24/craft-folio-app .

# Run the container
docker run -p 3000:3000 adityarai24/craft-folio-app

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

For any queries or support, please reach out to [adityarai407@example.com]
