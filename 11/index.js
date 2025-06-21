const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");
require("dotenv").config();

class WhisperTranscriptionApp {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async transcribeAudio(audioFilePath) {
    try {
      console.log("🎤 Transcribing audio...");

      const transcription = await this.openai.audio.transcriptions.create({
        file: fs.createReadStream(audioFilePath),
        model: "whisper-1",
        response_format: "text",
      });

      return transcription;
    } catch (error) {
      throw new Error(`Transcription failed: ${error.message}`);
    }
  }

  async summarizeText(text) {
    try {
      console.log("📝 Generating summary...");

      const response = await this.openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a professional summarizer. Create a concise, well-structured summary that captures the key points and main takeaways from the provided transcript.",
          },
          {
            role: "user",
            content: `Please summarize the following transcript:\n\n${text}`,
          },
        ],
        max_tokens: 500,
        temperature: 0.3,
      });

      return response.choices[0].message.content;
    } catch (error) {
      throw new Error(`Summarization failed: ${error.message}`);
    }
  }

  async analyzeText(text, audioFilePath) {
    try {
      console.log("📊 Analyzing transcript...");

      // Get audio duration to calculate speaking speed
      const audioDuration = await this.getAudioDuration(audioFilePath);

      const response = await this.openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: `You are a text analytics expert. Analyze the provided transcript and return ONLY a valid JSON object with the following structure:
{
  "word_count": number,
  "speaking_speed_wpm": number,
  "frequently_mentioned_topics": [
    { "topic": "string", "mentions": number }
  ]
}

Calculate speaking speed using the provided audio duration. Extract the top 3-5 most frequently mentioned topics or themes. Return ONLY the JSON, no additional text.`,
          },
          {
            role: "user",
            content: `Analyze this transcript. Audio duration: ${audioDuration} seconds.\n\nTranscript:\n${text}`,
          },
        ],
        max_tokens: 300,
        temperature: 0.1,
      });

      const analysisText = response.choices[0].message.content.trim();

      // Clean up response to ensure it's valid JSON
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      throw new Error("Invalid JSON response from analysis");
    } catch (error) {
      throw new Error(`Analysis failed: ${error.message}`);
    }
  }

  async getAudioDuration(audioFilePath) {
    // Since we can't use ffprobe in this environment, we'll estimate based on file size
    // This is a rough estimation - in production, you'd use a proper audio library
    const stats = fs.statSync(audioFilePath);
    const fileSizeInMB = stats.size / (1024 * 1024);

    // Rough estimate: MP3 files are typically 1MB per minute at standard quality
    const estimatedDurationMinutes = fileSizeInMB;
    return Math.round(estimatedDurationMinutes * 60);
  }

  saveTranscription(transcription, audioFileName, audioFilePath) {
    const audioDir = path.dirname(audioFilePath);
    const isDemoFile = path.basename(audioDir) === "demo";

    let transcriptionFileName;
    if (isDemoFile) {
      transcriptionFileName = "transcription.md";
    } else {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const baseFileName = path.parse(audioFileName).name;
      transcriptionFileName = `transcription_${baseFileName}_${timestamp}.md`;
    }

    const fullPath = path.join(audioDir, transcriptionFileName);
    const content = `# Transcription\n\n**Audio File:** ${audioFileName}\n**Generated:** ${new Date().toLocaleString()}\n\n---\n\n${transcription}`;

    fs.writeFileSync(fullPath, content);
    console.log(`💾 Transcription saved to: ${fullPath}`);
    return fullPath;
  }

  saveSummary(summary, audioFileName, audioFilePath) {
    const audioDir = path.dirname(audioFilePath);
    const isDemoFile = path.basename(audioDir) === "demo";

    let summaryFileName;
    if (isDemoFile) {
      summaryFileName = "summary.md";
    } else {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const baseFileName = path.parse(audioFileName).name;
      summaryFileName = `summary_${baseFileName}_${timestamp}.md`;
    }

    const fullPath = path.join(audioDir, summaryFileName);
    const content = `# Summary\n\n**Audio File:** ${audioFileName}\n**Generated:** ${new Date().toLocaleString()}\n\n---\n\n${summary}`;

    fs.writeFileSync(fullPath, content);
    console.log(`💾 Summary saved to: ${fullPath}`);
    return fullPath;
  }

  saveAnalysis(analysis, audioFileName, audioFilePath) {
    const audioDir = path.dirname(audioFilePath);
    const isDemoFile = path.basename(audioDir) === "demo";

    let analysisFileName;
    if (isDemoFile) {
      analysisFileName = "analysis.json";
    } else {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const baseFileName = path.parse(audioFileName).name;
      analysisFileName = `analysis_${baseFileName}_${timestamp}.json`;
    }

    const fullPath = path.join(audioDir, analysisFileName);
    fs.writeFileSync(fullPath, JSON.stringify(analysis, null, 2));
    console.log(`💾 Analysis saved to: ${fullPath}`);
    return fullPath;
  }

  async processAudio(audioFilePath) {
    try {
      // Validate audio file exists
      if (!fs.existsSync(audioFilePath)) {
        throw new Error(`Audio file not found: ${audioFilePath}`);
      }

      const audioFileName = path.basename(audioFilePath);
      console.log(`\n🚀 Processing audio file: ${audioFileName}\n`);

      // Step 1: Transcribe audio
      const transcription = await this.transcribeAudio(audioFilePath);

      // Step 2: Generate summary
      const summary = await this.summarizeText(transcription);

      // Step 3: Analyze transcript
      const analysis = await this.analyzeText(transcription, audioFilePath);

      // Step 4: Save files
      console.log("\n💾 Saving results...");
      this.saveTranscription(transcription, audioFileName, audioFilePath);
      this.saveSummary(summary, audioFileName, audioFilePath);
      this.saveAnalysis(analysis, audioFileName, audioFilePath);

      // Step 5: Display results
      console.log("\n" + "=".repeat(60));
      console.log("📊 RESULTS");
      console.log("=".repeat(60));

      console.log("\n📝 SUMMARY:");
      console.log(summary);

      console.log("\n📊 ANALYTICS:");
      console.log(JSON.stringify(analysis, null, 2));
      console.log("\n" + "=".repeat(60));

      return {
        transcription,
        summary,
        analysis,
      };
    } catch (error) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Usage: node index.js <audio-file-path>");
    console.log("Example: node index.js audio.mp3");
    process.exit(1);
  }

  const audioFilePath = args[0];

  // Check if API key is configured
  if (!process.env.OPENAI_API_KEY) {
    console.error(
      "❌ Error: OPENAI_API_KEY not found in environment variables."
    );
    console.error(
      "Please copy env.example to .env and add your OpenAI API key."
    );
    process.exit(1);
  }

  const app = new WhisperTranscriptionApp();
  await app.processAudio(audioFilePath);
}

if (require.main === module) {
  main();
}

module.exports = WhisperTranscriptionApp;
