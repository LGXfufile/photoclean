# PhotoClean - AI Photo Editor

Remove unwanted people from your photos with AI-powered image processing.

## 🌟 Live Demo

**Production URL:** [PhotoClean App](https://photoclean.vercel.app)

## Features

- 🎯 **Smart Detection**: AI automatically detects people in photos
- ✨ **One-Click Removal**: Remove unwanted people with a single click
- 🔒 **Privacy First**: All processing happens securely, no data stored
- 📱 **Mobile Friendly**: Works perfectly on all devices
- ⚡ **Fast Processing**: Quick results with professional quality

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **AI Processing**: FAL AI (YOLOv8 + Stable Diffusion)
- **Deployment**: Vercel with GitHub CI/CD

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

## Usage

1. Upload your photo by dragging and dropping or clicking to select
2. AI will automatically detect people in the image
3. Click on detected people to select/deselect for removal
4. Hit "Remove Selected People" to process
5. Download your cleaned photo

## Environment Variables

```bash
FAL_KEY=your_fal_api_key_here
```

## Privacy & Security

- Photos are processed client-side when possible
- No images are stored on our servers
- All uploads are temporary and automatically deleted

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Made with ❤️ using AI technology | Deployed with Vercel