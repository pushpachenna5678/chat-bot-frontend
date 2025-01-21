const fqsApiUrl = "https://99703dmix9.execute-api.ap-south-1.amazonaws.com/dev";

const API_KEY = "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";
const groqApiUrl = "https://api.groq.com/openai/v1/chat/completions";

// **Do not edit the below code** //

const faqListContainer = document.getElementById("faqListContainer");
const chatContainer = document.getElementById("chatContainer");

let chatList = [
  {
    request: "Hi, I need help preparing for my interview!",
    response:
      "Hello! I'm here to help you prepare for your interview. Feel free to ask me about any specific topics or practice questions you'd like to cover.",
  },
];

async function displayFaqs() {
  const response = await fetch(fqsApiUrl);
  const faqList = await response.json();

  faqListContainer.innerHTML = "";
  faqList.forEach((topic) => {
    const topicSection = document.createElement("div");
    topicSection.className = "topic-section";

    const topicHeader = document.createElement("div");
    topicHeader.className = "topic-header";

    topicHeader.appendChild(document.createTextNode(topic.topic));

    const questionsList = document.createElement("div");
    topic.questions.forEach((question) => {
      const questionItem = document.createElement("div");
      questionItem.className = "question-item";

      const content = document.createElement("div");
      content.className = "question-content";

      const text = document.createElement("p");
      text.className = "question-text";
      text.textContent = question.text;

      content.appendChild(text);
      questionItem.appendChild(content);
      questionsList.appendChild(questionItem);
    });

    topicSection.appendChild(topicHeader);
    topicSection.appendChild(questionsList);
    faqListContainer.appendChild(topicSection);
  });
}

function createUserMessage(message) {
  const messageDiv = document.createElement("div");
  messageDiv.className = "message user-message";

  const textDiv = document.createElement("div");
  textDiv.className = "message-content";

  const paragraph = document.createElement("p");
  paragraph.textContent = message;

  const icon = document.createElement("i");
  icon.className = "fas fa-user user-icon";

  messageDiv.appendChild(icon);
  textDiv.appendChild(paragraph);
  messageDiv.appendChild(textDiv);

  return messageDiv;
}

function createAIResponse(message) {
  const messageDiv = document.createElement("div");
  messageDiv.className = "message ai-message";

  const icon = document.createElement("i");
  icon.className = "fas fa-robot robot-icon";

  const textDiv = document.createElement("div");
  textDiv.className = "message-content";

  const paragraph = document.createElement("p");
  paragraph.textContent = message;

  const speakBtn = document.createElement("button");
  speakBtn.className = "speak-btn";
  const speakIcon = document.createElement("i");
  speakIcon.className = "fas fa-volume-up";
  speakBtn.appendChild(speakIcon);

  speakBtn.addEventListener("click", () => {
    const utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
  });

  textDiv.appendChild(paragraph);
  textDiv.appendChild(speakBtn);
  messageDiv.appendChild(icon);
  messageDiv.appendChild(textDiv);

  return messageDiv;
}

function displayChatList() {
  chatContainer.innerHTML = "";
  for (const chat of chatList) {
    const userMessage = createUserMessage(chat.request);
    const aiResponse = createAIResponse(chat.response);
    chatContainer.appendChild(userMessage);
    chatContainer.appendChild(aiResponse);
  }
}

async function getChatResponse() {
  const input = document.getElementById("messageInput");
  const userInput = input.value;

  if (userInput) {
    try {
      const response = await fetch(groqApiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mixtral-8x7b-32768",
          messages: [
            {
              role: "user",
              content: userInput,
            },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });
      const data = await response.json();
      const messageContent = data.choices[0].message.content;
      chatList.push({
        request: userInput,
        response: messageContent,
      });
    } catch (error) {
      console.error("Error fetching response:", error);
      chatList.push({
        request: userInput,
        response:
          "I apologize, but I'm having trouble connecting to the server. Please try again later.",
      });
    }

    input.value = "";
    displayChatList();
  }
}

document
  .getElementById("sendButton")
  .addEventListener("click", getChatResponse);
document.getElementById("messageInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") getChatResponse();
});

displayFaqs();
displayChatList();

