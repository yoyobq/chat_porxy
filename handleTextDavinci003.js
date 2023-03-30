import { Configuration, OpenAIApi } from "openai";
// 对应 comoplete 的 text-davinci-003 mode
async function handleTextDavinci003(question, API_KEY) {
  try {
    // 创建 OpenAIapi 实例，向 Chat GPT 提交问题
    const configuration = new Configuration({
      apiKey: API_KEY,
    });
    let openai = new OpenAIApi(configuration);
    
    // console.log(configuration);
    // console.log(question);
    // 获得响应
    const completion = await openai.createCompletion(question);

    // 关闭实例
    openai = null;
    // console.log(completion.data);
    // return { result: completion.data.choices[0].text };
    console.log(completion.data.choices[0]);
    return completion.data;
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      // res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      // res.status(500).json({
      //   error: {
      //     message: 'An error occurred during your request.',
      //   }
      // });
    }
  }
}

export default handleTextDavinci003;