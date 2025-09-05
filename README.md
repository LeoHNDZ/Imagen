# Scripter Image

A Next.js application that transforms text scripts into visual art using AI image generation.

## Features

- **Script Input**: Enter descriptive text for image generation
- **Style Customization**: Define visual styles and artistic preferences
- **AI Image Generation**: Powered by OpenAI's DALL-E 3 model
- **Style Suggestions**: Get AI-powered style recommendations
- **Image Download**: Save generated images locally

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env.local` file with your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:9002](http://localhost:9002) in your browser.

## Technology Stack

- **Framework**: Next.js 15 with TypeScript
- **AI Integration**: Google Genkit with OpenAI compatibility plugin
- **Image Generation**: OpenAI DALL-E 3
- **UI Components**: Radix UI with Tailwind CSS
- **Icons**: Lucide React

## Usage

1. Enter a descriptive script in the text area
2. Define the desired image style
3. Click "Generate Image" to create your visual art
4. Download the generated image using the download button
