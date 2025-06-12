const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const writeLog = require('./logger');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  writeLog(`Server is running in port ${PORT}`);
  res.send('Chatbot backend is running!');
});

app.post('/api/checklist', async (req, res) => {
  const { tech } = req.body;
  writeLog(`Port ${PORT} Running: Api/Checklist`);
  try {
    const gptResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Create a production deployment checklist for a [type of application] built using [tech stack]. The checklist should cover deployment-phase steps,  including security, monitoring, rollback plans.Ensure to include IP whitelisting steps specifically for AWS services. Format it as a detailed, bullet-pointed list that can be used by DevOps or engineering teams.',
          },
        // {
//   role: 'system',
//   content: 'You are a DevOps expert. Create a production deployment checklist for a [type of application] built using [tech stack]. The checklist should focus only on deployment-phase steps and include essential items such as infrastructure readiness, security, monitoring, and rollback strategies. Ensure to include IP whitelisting steps specifically for AWS services . Format the output as a clear, detailed bullet-point checklist that can be followed by engineering or DevOps teams for a secure and stable release.'
// },

          {
            role: 'user',
            content: `Provide a detailed production deployment checklist for a ${tech} application.`,
          },
        ],
        temperature: 0.5,
        max_tokens: 800,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const checklist = gptResponse.data.choices[0].message.content;
    res.json({ response: checklist });
  } catch (error) {
    writeLog(`Error in Port ${PORT}: Open AI Error: ${error}`);
    console.error('OpenAI Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from OpenAI' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});




