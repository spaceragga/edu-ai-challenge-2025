# Whisper Transcription App

A console application that transcribes audio files using OpenAI's Whisper API, generates summaries with GPT-4, and provides detailed analytics including word count, speaking speed, and frequently mentioned topics.

## 🚀 Quick Start

### Option 1: Try with Sample Audio (Recommended)

The `demo/` folder contains a sample audio file for quick testing:

```bash
# 1. Set up your API key
cp env.example .env
# Edit .env and add your OpenAI API key

# 2. Run demo with sample audio
npm run demo
# Or: cd demo && node run-demo.js
```

**What's included in demo:**
- `CAR0004.mp3` - Sample business presentation audio
- `run-demo.js` - One-command demo runner
- Generated files: `transcription.md`, `summary.md`, `analysis.json`

### Option 2: Process Your Own Audio

```bash
# Process any audio file
node index.js your-audio.mp3
node index.js /path/to/audio.wav
```

## Features

- 🎤 **Audio Transcription**: Uses OpenAI's Whisper-1 model for high-accuracy speech-to-text
- 📝 **Text Summarization**: Generates concise summaries using GPT-4
- 📊 **Analytics**: Extracts word count, speaking speed (WPM), and frequently mentioned topics
- 💾 **File Management**: Automatically saves transcriptions, summaries, and analytics with timestamps
- 🌍 **Multilingual Support**: Handles multiple languages through Whisper
- 🔧 **Easy Setup**: Simple configuration with environment variables

## Requirements

- Node.js (v14 or higher)
- OpenAI API key with access to Whisper and GPT-4
- Audio files in supported formats (MP3, WAV, M4A, etc.)

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd 11
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env and add your OpenAI API key
   # Replace 'your_openai_api_key_here' with your actual API key
   ```

4. **Your .env file should look like:**
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

## Usage

### Basic Command
```bash
node index.js <audio-file-path>
```

### Examples
```bash
# Demo with provided sample audio
npm run demo

# Process your own audio files
node index.js audio.mp3
node index.js /path/to/your/audio.wav
node index.js recording.m4a

# Using npm script (pass filename as argument)
npm start audio.mp3
```

## Output Files

The application generates three types of output files with timestamps:

1. **Transcription**: `transcription_<filename>_<timestamp>.md`
   - Full transcript of the audio
   - Includes metadata (original filename, generation time)

2. **Summary**: `summary_<filename>_<timestamp>.md`
   - Concise summary of the main points
   - Generated using GPT-4

3. **Analytics**: `analysis_<filename>_<timestamp>.json`
   - Word count
   - Speaking speed in words per minute (WPM)
   - Top frequently mentioned topics with mention counts

## Sample Output

### Console Output
```
🚀 Processing audio file: audio.mp3

🎤 Transcribing audio...
📝 Generating summary...
📊 Analyzing transcript...

💾 Saving results...
💾 Transcription saved to: transcription_audio_2024-01-15T10-30-45-123Z.md
💾 Summary saved to: summary_audio_2024-01-15T10-30-45-123Z.md
💾 Analysis saved to: analysis_audio_2024-01-15T10-30-45-123Z.json

============================================================
📊 RESULTS
============================================================

📝 SUMMARY:
[Generated summary text here...]

📊 ANALYTICS:
{
  "word_count": 1280,
  "speaking_speed_wpm": 132,
  "frequently_mentioned_topics": [
    { "topic": "Customer Onboarding", "mentions": 6 },
    { "topic": "Q4 Roadmap", "mentions": 4 },
    { "topic": "AI Integration", "mentions": 3 }
  ]
}
============================================================
```

## API Usage and Costs

This application uses the following OpenAI APIs:
- **Whisper-1**: For audio transcription (~$0.006 per minute)
- **GPT-4**: For summarization and analytics (~$0.03 per 1K tokens)

Estimated cost per 5-minute audio file: ~$0.05-0.10

## Supported Audio Formats

The application supports various audio formats including:
- MP3
- WAV
- M4A
- FLAC
- OGG

Maximum file size: 25MB (OpenAI Whisper API limit)

## Troubleshooting

### Common Issues

1. **"OPENAI_API_KEY not found"**
   - Ensure you've copied `env.example` to `.env` in the main project folder (not in demo/)
   - Verify your API key is correctly set in the `.env` file
   - Make sure there are no spaces around the API key

2. **"Audio file not found"**
   - Check the file path is correct
   - Ensure the audio file exists in the specified location
   - Use absolute paths if relative paths don't work

3. **"Transcription failed"**
   - Verify your OpenAI API key has Whisper access
   - Check your account has sufficient credits
   - Ensure the audio file is under 25MB

4. **"Analysis failed"**
   - This usually indicates an issue with GPT-4 response parsing
   - Try running the command again
   - Check your API key has GPT-4 access

### File Size Limits

- Maximum audio file size: 25MB (OpenAI limit)
- For larger files, consider:
  - Compressing the audio
  - Splitting into smaller segments
  - Using a different audio format

## Development

### Project Structure
```
11/
├── index.js          # Main application logic
├── package.json      # Dependencies and scripts
├── README.md         # This file (all documentation)
├── env.example       # Environment variables template
├── demo/             # Demo folder with sample files
│   ├── CAR0004.mp3   # Sample audio file
│   └── run-demo.js   # One-command demo runner
└── .env              # Your API key (not in repo)
```

### Key Dependencies
- `openai`: Official OpenAI Node.js library
- `dotenv`: Environment variable management
- `fs`: File system operations
- `path`: File path utilities

## License

MIT License

## Support

For issues or questions:
1. Check this README for common solutions
2. Verify your OpenAI API key and account status
3. Ensure all dependencies are properly installed
4. Check the console output for specific error messages 