import { GoogleGenAI, Type } from "@google/genai";
const API_KEY = 'AIzaSyDUt_F3kAMvVQmY_ANgG4P6MQRf_k4k_Pw';

const ai = new GoogleGenAI({ apiKey: API_KEY });

// const prompt = `Write an interesting science fact in 3lines or less.
// Choose randomly from the following list:
// - Music
// - Astrophysics
// - Biology`
const Schema = {
    description: "List of science categories",
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            categoryName: {
                type: Type.STRING,
                description: "Name of the science category",
            },
            // category: {
            //     type: Type.ARRAY,
            //     items: {
            //         type: Type.STRING,
            //     },
            // },
        },
        // propertyOrdering: ["categoryName"],
        required: ["categoryName"],
    },
}

async function main() {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Give me 5 random science categories people would be interested in knoiwing about.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: Schema,
        },
    });
    const text = response.text;
    // console.log(JSON.parse(response.text));
    // const categories = JSON.parse(text);
    // categories.forEach((category) => {
    //     let btn = document.createElement("button");
    //     btn.textContent = category.categoryName;
    // })
    return text;
}


await main().then((text) => {
    document.querySelector("body").classList.add("loading"); // Add the loading class to body element when content is loaded

    // document.querySelector("main h1").innerText = text;
    const categories = JSON.parse(text);
    categories.forEach((category) => {
        let btn = document.createElement("button");
        btn.textContent = category.categoryName;
        btn.addEventListener("click", (e) => {
            // console.log(e.target.textContent)
            fetchScienceFacts(e.target.textContent);
        })
        document.querySelector(".categories").appendChild(btn)
        document.querySelector("body").classList.remove("loading"); // Remove loading class after content is loaded
    })

}).catch((error) => {
    console.error("Error:", error);
});

async function fetchScienceFacts(category) {
    document.querySelector("body").classList.add("loading"); // Add the loading class to body element when content is loaded
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Generate a science fact about ${category} in 3 lines or less about.
        Don't use markdown, only a plain text paragraph.
        Add an emoji if necessary.`,
        // config: {
        //     responseMimeType: "text/plain",
        // },
    });
    const text = response.text;
    // console.log(text);
    // let fact = document.createElement("p");
    // fact.textContent = text;
    document.querySelector("main p").innerText = `Here's your science fact about ${category}:`; //before the content is loaded it changes the inner text of the p tag to this for better visual
    document.querySelector("main h1").innerText = text;
    document.querySelector("main").classList.add("done"); // Add done class to main element when content is loaded
    document.querySelector("body").classList.remove("loading"); // Remove loading class after content is loaded
}

