import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyDUt_F3kAMvVQmY_ANgG4P6MQRf_k4k_Pw"

const businessInfo = `
     
General Business Information:
Website: www.yourbusiness.com

Return Policy:
Customers can return products within 30 days of purchase with the original receipt.
Items must be unused and in their original packaging.
Refunds will be processed to the original payment method.

Support Email: support@yourbusiness.com

Madrid Location:
Address: Calle Mayor 123, 28013 Madrid, Spain
Phone: +34 91 123 4567
Email: madrid@yourbusiness.com
Opening Hours:
Monday to Friday: 10:00 AM to 8:00 PM
Saturday: 10:00 AM to 6:00 PM
Sunday: 10:00 AM to 1:00 PM

New York Location:
Address: 456 Broadway, New York, NY 10012, USA
Phone: +1 212-123-4567
Email: newyork@yourbusiness.com
Opening Hours:
Monday to Friday: 9:00 AM to 7:00 PM
Saturday: 10:00 AM to 5:00 PM
Sunday: Closed

FAQs:
General:
What is your return policy?

You can return items within 30 days with the original receipt and packaging. Refunds are processed to the original payment method.
Do you ship internationally?

Yes, we ship to most countries. Shipping rates and delivery times vary by location.
How can I track my order?

You will receive a tracking number via email once your order is shipped.
Can I cancel or modify my order?

Orders can be modified or canceled within 24 hours. Please contact support@yourbusiness.com.
Madrid Location:
What are your opening hours in Madrid?

Monday to Friday: 10:00 AM to 8:00 PM
Saturday: 10:00 AM to 6:00 PM
Sunday: Closed
Is parking available at the Madrid store?

Yes, we offer parking nearby. Contact us for details.
How can I contact the Madrid store?

You can call us at +34 91 123 4567 or email madrid@yourbusiness.com.
New York Location:
What are your opening hours in New York?

Monday to Friday: 9:00 AM to 7:00 PM
Saturday: 10:00 AM to 5:00 PM
Sunday: Closed
Do you host events at the New York location?

Yes, we host regular workshops and community events. Check our website for updates.
How can I contact the New York store?

You can call us at +1 212-123-4567 or email newyork@yourbusiness.com.

Tone Instructions:
Conciseness: Respond in short, informative sentences. But be nice and add relevant information, like an address if someone asks for a specific store location.
Formality: Use polite language with slight formality (e.g., "Please let us know," "We are happy to assist").
Clarity: Avoid technical jargon unless necessary.
Consistency: Ensure responses are aligned in tone and style across all queries.
Example: "Thank you for reaching out! Please let us know if you need further assistance."
`
// const ai = new GoogleGenAI({ apiKey: API_KEY });
// Instantiate the GoogleGenerativeAI client with your API key.
const genAI = new GoogleGenerativeAI(API_KEY);
// Get the generative model to use for the chat (gemini-2.0-flash is lightweight and fast).
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: businessInfo,
});

let messages = {
    // model: "gemini-2.0-flash",
    history: [],
}

async function sendMessage() {

    console.log(messages);
    const userMessage = document.querySelector(".chat-window input").value
    // if (userMessage.length) { // check if the input is not empty, even a space is considered a character so if the user types a space it will send the message, but if it is empty it will not send the message
    //     alert("Message sent: " + userMessage);
    // }

    if (userMessage.length) {
        try {
            document.querySelector(".chat-window input").value = "" // clear the input field after sending the message
            // add the user message to the chat window the beforeend method is used to add the message at the end of the chat window
            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend", `
            <div class="user">
            <p>${userMessage}</p>
            </div>
            `)

            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend", `
            <div class="loader"></div>
            `)

            // AI model response
            const chat = model.startChat(messages);

            let result = await chat.sendMessageStream(userMessage)

            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend", `
              <div class="model">
                <p></p>
              </div>
             `)

            for await (const chunk of result.stream) {
                const chunkText = chunk.text()
                // console.log(chunkText) // or append to a UI element
                let modelMessages = document.querySelectorAll(".chat-window .chat div.model")
                modelMessages[modelMessages.length - 1].querySelector("p").insertAdjacentHTML("beforeend", `
                ${chunkText}    
             `)
            }
            // const chat = response.startChat(messages)
            // const AiResponse = await chat.sendMessage({
            //     message: userMessage,
            // });
            // const AiResponse = await chat.sendMessage(userMessage);
            // // add the AI response to the chat window
            // document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend", `
            // <div class="model">
            // <p>${AiResponse.response.text()}</p>
            // </div>
            // `)

            // // add the user message and AI response to the history
            // messages.history.push({
            //     role: "user",
            //     parts: [{ text: userMessage }],
            // });

            // messages.history.push({
            //     role: "model",
            //     parts: [{ text: AiResponse.response.text() }],
            // });
            // // console.log(AiResponse.text);

        } catch (error) {
            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend", `
            <div class="error">
               <p>This message could not be sent. Please try again.</p>
            </div>
            `)

        }

        document.querySelector(".chat-window .chat .loader").remove() // remove the loader after the AI response is received

    }
}

// we have to write this because we are using type="module" which does not allow inline event handlers
// we can see that writing the sendMessage function inside the button onclick attribute does not work in html
// so we have to add the event listener in the js file due to the module system
document.querySelector(".chat-window .input-area button").addEventListener("click", () => sendMessage())