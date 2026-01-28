const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, ".env.local") });

async function run() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const models = await genAI.listModels();
        console.log("Modelos disponíveis:");
        models.models.forEach((m) => {
            console.log(`- ${m.name} (v: ${m.version}, methods: ${m.supportedGenerationMethods})`);
        });
    } catch (e) {
        console.error("Erro ao listar modelos:", e);
    }
}

run();
