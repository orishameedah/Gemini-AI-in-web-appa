import { GoogleGenAI } from "@google/genai";
import { useState, useEffect } from "react";
import Loader from "./Loader";

function Summary({ file }) {

    console.log(file);

    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GENAI_API_KEY });
    const [summary, setSummary] = useState(" ");
    const [status, setStatus] = useState("idle");

    async function getSummary() {
        setStatus('loading');
        try {
            const contents = [
                { text: "Summarize this document" },
                {
                    inlineData: {
                        mimeType: file.type,
                        data: file.file
                    }
                },
                `
                Summarize the content of this document in a concise manner.
                In one short paragraph, provide the key points and main ideas.
                Use simple and clear language, with no markdowns or html tags.
                `
            ];

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: contents
            });
            setStatus('success')
            setSummary(response.text);
        } catch (error) {
            setStatus('error')
            console.error("Error generating summary:", error);
        }
    }

    useEffect(() => {
        if (status === 'idle') {
            getSummary();

        }
    }, [status]); // <-- Called only once when component mounts

    // console.log(response.text);
    return (
        <section className="summary">
            <img src={file.imageURL} alt="Preview Image" />
            <h2>Summary</h2>
            {
                status === 'loading' ? <Loader /> : status === 'success' ? <p>{summary}</p> : status === 'error' ? <p>Error getting the summary</p> : ''
            }
        </section>
    )
}

export default Summary;