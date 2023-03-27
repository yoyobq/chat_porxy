import http from 'http';
import { Configuration, OpenAIApi } from "openai";

const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });
  req.on('end', async () => {
    try {
      const data = JSON.parse(body);
      // console.log(data);
      const question = data.query;
      const API_KEY = data.API_KEY;
      const mode = data.mode;
      // console.log(mode);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      
      let answer;
      if (mode === 'complete') {
        answer = await GeneratingText(question, API_KEY);
      } else {
        if (mode === 'chat') {
          answer = await talk(question, API_KEY);
        }
      }

      res.end(JSON.stringify(answer));
    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  
  });
});

server.listen(8080, () => {
  console.log('Server started on port 8080');
});

async function talk(question, API_KEY) {
  console.log(question);
  return 0;
}

// 对应 comoplete mode
async function GeneratingText(question, API_KEY) {
  try {
    // 创建 OpenAIapi 实例，向 Chat GPT 提交问题
    const configuration = new Configuration({
      apiKey: API_KEY,
    });
    let openai = new OpenAIApi(configuration);
    
    console.log(question);
    // 获得响应
    const completion = await openai.createCompletion(question);

    // 关闭实例
    openai = null;
    // console.log(completion.data);
    // return { result: completion.data.choices[0].text };
    console.log(completion.data.choices[0].text);
    return completion.data;
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      // res.status(error.response.status).json(error.response.data);
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
