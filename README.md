<div align="center">
  <h1>🚀 GeminiCoderXtra</h1>
  <p>A powerful AI-powered code generation system for React components</p>
  
  <img src="public/screenshots/home-hero.png" alt="GeminiCoderXtra Hero" width="800"/>
</div>

## ✨ Example Generation

Here's an example of generating a calculator component:

<img src="public/screenshots/calculator-example.png" alt="Calculator Example" width="800"/>

<div align="center">
  <a href="#-features">Features</a> •
  <a href="#-prerequisites">Prerequisites</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-usage">Usage</a> •
  <a href="#-development">Development</a> •
  <a href="#-contributing">Contributing</a>
</div>

---

## ✨ Features

- 🤖 Multi-provider AI support
  - Google AI (Gemini Pro)
  - OpenAI (GPT-4, GPT-3.5)
  - Anthropic (Claude 3)
  - DeepSeek
  - Grok
- 🔄 Real-time streaming responses
- 📝 TypeScript & React focused
- 🎨 Tailwind CSS styling
- 🛠️ Enhanced code preview with Sandpack
- 🔍 Robust error handling & recovery
- 🚦 Rate limiting & retry mechanisms

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18.x or later
- PostgreSQL 14.x or later
- npm 9.x or later

You'll also need API keys from the following services:
- [Google AI Studio](https://makersuite.google.com/app/apikey)
- [OpenAI](https://platform.openai.com/api-keys)
- [Anthropic](https://console.anthropic.com/account/keys)
- [DeepSeek](https://platform.deepseek.com/settings/api-keys)
- [X (Twitter) Developer Platform](https://developer.twitter.com/en/portal/dashboard) (for Grok)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/Nichols-AI/GeminiCoderXtra.git
cd GeminiCoderXtra
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/geminicoderxtra"

# AI Provider Keys
GOOGLE_AI_API_KEY=your_google_key
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
DEEPSEEK_API_KEY=your_deepseek_key
GROK_API_KEY=your_grok_key
```

5. Set up the database:
```bash
# Create the database
createdb geminicoderxtra

# Run migrations
npx prisma migrate dev
```

6. Generate Prisma client:
```bash
npx prisma generate
```

7. Start the development server:
```bash
npm run dev
```

Your app should now be running at [http://localhost:3000](http://localhost:3000) 🎉

## 🚀 Usage

### Web Interface

Visit [http://localhost:3000](http://localhost:3000) and:
1. Select your preferred AI model
2. Enter your component requirements
3. Watch as your React component is generated in real-time

### API Usage

Send POST requests to `/api/generateCode`:

```typescript
{
  "model": "gemini-pro",  // or any supported model
  "messages": [
    {
      "role": "user",
      "content": "Create a React counter component"
    }
  ]
}
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run test       # Run tests
```

### Project Structure

```
GeminiCoderXtra/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   └── (main)/           # Main app routes
├── components/            # React components
├── lib/                   # Utility functions
├── prisma/               # Database schema & migrations
└── utils/                # Helper functions
```

### Available Dependencies

The code preview environment includes:
- `uuid` - Generating unique IDs
- `recharts` - Charts and graphs
- `@radix-ui/*` - UI components
- `tailwindcss` - Styling
- `react-router-dom` - Routing
- `date-fns` - Date utilities
- `clsx` - Class name utilities

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📝 Documentation

- [API Documentation](docs/api.md)
- [Provider Guide](docs/providers.md)
- [Changelog](CHANGELOG.md)
- [Roadmap](ROADMAP.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

This project builds upon and is inspired by amazing work from the community:

- Built with [Anthropic's API](https://www.anthropic.com/claude), providing powerful language model capabilities
- Inspired by [GemCoder](https://github.com/osanseviero/gemcoder) and its innovative approach to code generation
- Enhanced with additional AI providers:
  - [OpenAI](https://platform.openai.com/)
  - [Google AI](https://ai.google.dev/)
  - [DeepSeek](https://www.deepseek.com/)
  - [X (Twitter)](https://developer.twitter.com/) for Grok

*This is not an official Google product. While this project is named GeminiCoderXtra, it is independently developed.*
