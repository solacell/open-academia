let OpenAI = require("openai")
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

const response =  openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [
    {
      "role": "system",
      "content": "You will be provided with statements, and your task is to convert them to standard English."
    },
    {
      "role": "user",
      "content": "i not get no girl"
    }
  ],
  temperature: 0.7,
  max_tokens: 64,
  top_p: 1,
});

response
  .then((response) => {
    console.log(response.choices[0].message.content);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
