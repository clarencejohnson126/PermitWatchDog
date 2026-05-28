const fs = require('fs');
const path = require('path');
const https = require('https');

const envPath = path.join(__dirname, '../../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/GEMINI_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("GEMINI_API_KEY not found");
  process.exit(1);
}

const imagesToGenerate = [
  {
    filename: "founder_portrait.png",
    prompt: "Clarence at a coffee table with blueprints and a Bauantrag spread, late evening, blue laptop glow. Documentary photo style."
  },
  {
    filename: "credibility_team.png",
    prompt: "Wide shot of the actual Mannheim Innenstadt construction site with workers' silhouettes during golden hour. NO portrait of a single person — a team scene instead."
  },
  {
    filename: "produkt_hero.png",
    prompt: "Macro close-up of dust particles catching electric-blue light in an empty Bauamt at night."
  },
  {
    filename: "produkt_doctrine.png",
    prompt: "Open Bauantrag with multiple Auflagen visible, single overhead lamp."
  },
  {
    filename: "mannheim_quadrate_map.png",
    prompt: "Top-down stylized illustration of the Mannheim Quadrate grid with Q5,18 highlighted in electric blue."
  },
  {
    filename: "bauantrag_produkt.png",
    prompt: "different Bauantrag composition. Different angle, different overlay text, different document type (e.g., Bauantrags-Addendum instead of Bauantrag)."
  }
];

async function generateImage(image) {
  const postData = JSON.stringify({
    instances: [{ prompt: image.prompt }],
    parameters: { sampleCount: 1, aspectRatio: "16:9" }
  });

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/imagen-4.0-generate-001:predict`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.predictions && json.predictions[0] && json.predictions[0].bytesBase64Encoded) {
            const base64Data = json.predictions[0].bytesBase64Encoded;
            const buffer = Buffer.from(base64Data, 'base64');
            const outputPath = path.join(__dirname, 'public/images', image.filename);
            fs.writeFileSync(outputPath, buffer);
            console.log(`Generated ${image.filename}`);
            resolve();
          } else {
            console.error(`Error generating ${image.filename}:`, data);
            reject(new Error("Invalid response"));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
}

async function main() {
  for (const img of imagesToGenerate) {
    console.log(`Generating ${img.filename}...`);
    try {
      await generateImage(img);
    } catch (e) {
      console.error(e);
    }
  }
}

main();
