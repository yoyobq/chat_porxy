import https from 'https';

async function chat(question, API_KEY) {
  return new Promise((resolve, reject) => {
    const url = 'https://api.openai.com/v1/chat/completions';

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    };

    const req = https.request(url, options, (res) => {
      // let body = ''; // 另一种方法
      let chunks = []


      // 服务器响应时，收录 body
      res.on('data', (chunk) => {
        // body += chunk; 另一种方法
        chunks.push(chunk);
      });
      
      // 响应完成后
      res.on('end', () => {
        // const data = JSON.parse(body); 另一种方法
        const data = Buffer.concat(chunks).toString();
        let response;

        try {
          response = JSON.parse(data);
        } catch (error) {
          console.error('Invalid JSON response:', data);
          reject(error);
        }
        console.log(response.choices[0]);
        // Promise 对象的返回
        resolve(response);
      });

      req.on('error', (error) => {
        console.error('Request error:', error);
        reject(error);
      });
    });

    req.write(JSON.stringify(question));
    req.end();
  });
}

export default chat;

// 返回 data 实例
// {
//   id: 'chatcmpl-6zJkLKceZjo4rB3x9DWQHYdMye2Lj',
//   object: 'chat.completion',
//   created: 1680071933,
//   model: 'gpt-3.5-turbo-0301',
//   usage: { prompt_tokens: 21, completion_tokens: 202, total_tokens: 223 },
//   choices: [ { message: [Object], finish_reason: 'stop', index: 0 } ]
// }

// 其中 choices[0]
// {
//   message: {
//     role: 'assistant',
//     content: '苏州技师学院'
//   },
//   finish_reason: 'stop',
//   index: 0
// }

// 创建 OpenAIapi 实例，向 Chat GPT 提交问题
// const configuration = new Configuration({
//   apiKey: API_KEY,
// });
// let openai = new OpenAIApi(configuration);

// console.log(question);
// // 获得响应
// const dialog = await openai.createChatCompletion(question);
// console.log(dialog.data.choices[0]);