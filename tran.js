import http from 'http';
import { Configuration, OpenAIApi } from "openai";

const API_KEY = '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';

const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });
  req.on('end', async () => {
    // console.log('Received data:', body);
    const question = JSON.parse(body)['question'];
    console.log(question);
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
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "未设置有效的 API_KEY，若需帮助，请联系管理员。",
      }
    });
    return;
  }

  if (question.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "问题不能为空。",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      // 输入给 GPT 模型的文本信息，用于启发模型生成相关的文本
      prompt: question,
      // 用于控制 GPT 模型生成文本的多样性，取值范围为 0-1，数值越大则生成的文本越多样化，数值越小则生成的文本越保守。
      temperature: 0.6,
      // 
      max_tokens: 200,
      n: 1
    });
    return { result: completion.data.choices[0].text };
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
