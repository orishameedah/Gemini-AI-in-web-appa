<script setup>

import { GoogleGenAI, Type } from "@google/genai";
import StartScreen from './components/StartScreen.vue'
import Quiz from "./components/Quiz.vue";
import Loader from "./components/Loader.vue"
import Result from "./components/Result.vue";
import { ref } from "vue";

const questions = ref('');
const status = ref('start');
const userAnswers = ref([]);
const errorMessage = ref('');

const restartQuiz = () => {
  questions.value = '';
  status.value = 'start';
  userAnswers.value = [];
  errorMessage.value = '';
}

const storeAnswer = (answer) => {
  userAnswers.value.push(answer);
}

const startQuiz = async (topic) => {
  // alert(`Quiz started with topic ${topic}`);
  // question.value = "Loading question..."
  // const ai = new GoogleGenAI({apiKey: "AIzaSyDUt_F3kAMvVQmY_ANgG4P6MQRf_k4k_Pw"});
  //   const response = await ai.models.generateContent({
  //   model: "gemini-2.5-flash",
  //   contents: `Create a multi-choice quiz question about ${topic}`
  // });
  // console.log(response.text);
  // question.value = response.text

  // question.value = "Loading question..."
  status.value = 'loading'
try {
    const ai = new GoogleGenAI({apiKey: import.meta.env.VITE_GEMINI_API_KEY});
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents:
        `Create 5 multiple-choice quiz question about ${topic} in this JSON format:
        Difficulty: Easy to Medium
        Type: Multiple Choice
        `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            response_code: { type: Type.NUMBER },
            results: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  category: { type: Type.STRING },
                  question: { type: Type.STRING },
                  correct_answer: { type: Type.STRING },
                  incorrect_answers: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                propertyOrdering: [
                  "type",
                  "difficulty",
                  "category",
                  "question",
                  "correct_answer",
                  "incorrect_answers"
                ]
              }
            }
          },
          propertyOrdering: ["response_code", "results"]
        }
      }
    });

    questions.value = JSON.parse(response.text); //this will convert it to a javascript format
    status.value = 'ready';
  } catch (error) {
    // console.error("Error fetching quiz questions:", error);
    errorMessage.value = error
    status.value = 'start';
  }
}
</script>

<template>
  <div id="app">

    <header>
      <div class="container">
        <img src="./assets/vue.svg" alt="Alt Logo" class="logo"/>
        <h1>Quiz Generator</h1>
      </div>
    </header>

    <StartScreen v-if="status == 'start'" :errorMessage="errorMessage" @start-quiz="startQuiz"/>  <!--v-if indicate that it should start screen if the status is start-->
    <Loader v-if="status == 'loading'"/>
    <Quiz v-if="status == 'ready'" @end-quiz="status = 'finished'" @store-answer="storeAnswer" :questions="questions.results" />
    <Result v-if="status === 'finished'" @restart-quiz="restartQuiz" :userAnswers="userAnswers"/>
    <!-- <p>{{ question }}</p> -->
  </div>
</template>

