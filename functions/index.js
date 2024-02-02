const functions = require("firebase-functions");
const OpenAIAPI = require("openai");

// Initialize OpenAI with API Key
const openai = new OpenAIAPI({
  apiKey: functions.config().OpenAI.key,
});

exports.getCarDescription = functions.https.onRequest(async (req, res) => {
  // Check for POST request
  if (req.method !== "POST") {
    res.status(400).send("Please send a POST request with a car name.");
    return;
  }

  try {
    const {carName, carModel} = req.body;

    // Ensure car name is provided
    if (!carName) {
      res.status(400).send("Car Name is required.");
      return;
    }

    if (!carModel) {
      res.status(400).send("Car Model is required.");
      return;
    }

    // Call OpenAI's GPT-4 model to generate the car description
    const gptResponse = await openai.createCompletion({
      model: "text-davinci-004",
      prompt: `Generate a detailed description of the ${carName} ${carModel} car.
      - **Brand:** ${carName}
      - **Model:** ${carModel}

      Provide a comprehensive and professional description of the specified car, highlighting its key features, performance, and any notable characteristics. Include information about its design, technology, safety features, and overall driving experience. Aim for a detailed and engaging description that would be useful for potential buyers and enthusiasts.`,
      max_tokens: 1000,
    });

    // Send back the description as the response
    res.send(gptResponse.data.choices[0].text);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while generating the description.");
  }
});
