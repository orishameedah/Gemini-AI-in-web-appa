import { GoogleGenAI } from "@google/genai";
import "./Chat.css";
import { useState } from "react";

function Chat({ file }) {

    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GENAI_API_KEY });
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    // console.log(input)

    async function handleSendMessage() {
        if (input.length) { //if we have an input
            let chatMessages = [...messages, { role: 'user', text: input }, { role: "loader", text: "" }];
            setMessages(chatMessages);
            setInput(""); //clear input field

            try {
                const contents = [
                    {
                        inlineData: {
                            mimeType: file.type,
                            data: file.file
                        }
                    },
                    `
                Answer the question based on the content of the document: ${input}.
                If you don't know the answer, just say that you don't know, don't try to make up an answer.
                Ensure you answer as a chatbot with a friendly tone, short sentences, no bullet points, text only (no markdowns, tags or symbol).
                Chat history: ${JSON.stringify(messages)}
                `
                ];

                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: contents
                });
                chatMessages = [...chatMessages.filter((msg) => msg.role != 'loader'), { role: 'model', text: response.text }];
                setMessages(chatMessages);

            } catch (error) {
                chatMessages = [...chatMessages.filter((msg) => msg.role != 'loader'), { role: 'error', text: "Error sending messages, please try again later" }];
                setMessages(chatMessages);
                console.error(error);
            }
        }
    }

    return (
        <section className="chat-window">
            <h2>Chat </h2>
            {
                messages.length ?
                    <div className="chat">
                        {
                            messages.map((msg) => (
                                <div className={msg.role} key={msg.text}>
                                    <p>{msg.text}</p>
                                </div>
                            ))
                        }
                    </div> :
                    ''
            }
            <div className="input-area">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    type="text"
                    placeholder="Ask any question the uploaded document"
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </section>
    )
}

export default Chat