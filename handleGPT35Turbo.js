import https from 'https';

async function chat(question, API_KEY) {

  const url = 'https://api.openai.com/v1/chat/completions';

  question = {
    model: "gpt-3.5-turbo",
    messages: [
      // {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "苏州技师学院怎么样？"},
      // {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
      // {"role": "user", "content": "Where was it played?"}
    ],
    // temperature: 1, // 默认 1，范围0-2 越高答题思路越宽
    // top_p: 1, // 默认1，范围 0-2，不要和 temperature 一起修改
    // n: 1, // number | optional | 1 | 最多返回几份答案
    // stream: boolean | optional | false | 像官网一样流式传输结果
    // stop: string or array | optional | null | 终止流式传输的字符
    max_tokens: 512, // int | optional | infinite | 最高 2048，太低没用 | 每次最多使用多少 token 
    // presence_penalty: number | optional | 0 | -2 to 2 | 正值允许创新，负值防止跑题
    // frequency_penalty: number | optional | 0 | -2 to 2 | 正值防止逐字重复同一行
    // logit_bias: map | optional | null 没看懂
    // user: string | optional 用户标识符
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    }
  };

  const req = https.request(url, options, (res) => {
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
  
    res.on('end', () => {
      const data = JSON.parse(body);
      console.log(data.choices[0]);
    });
  });

  req.write(JSON.stringify(question));
  req.end();

  // console.log(req.data.choices[0]);

  return data;
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