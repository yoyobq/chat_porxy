import http from 'http';
import { Configuration, OpenAIApi } from "openai";

const API_KEY = '';

const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });
  req.on('end', async () => {
    console.log(body);
    const question = JSON.parse(body);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    const answer = await askQuestion(question);
    console.log(answer);
    res.end(JSON.stringify(answer));
  });
});

server.listen(8080, () => {
  console.log('Server started on port 8080');
});

// 处理提交内容


// 向 Chat GPT 提交问题，并获得相应
const configuration = new Configuration({
  apiKey: API_KEY,
});
const openai = new OpenAIApi(configuration);

async function askQuestion(question) {
  try {
    const completion = await openai.createCompletion(question);
    return { result: completion.data.choices[0].text };
    // console.log(completion.data.choices[0].text);
    // return completion;
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}
