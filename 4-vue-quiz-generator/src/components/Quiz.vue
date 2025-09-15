<script setup>

const props = defineProps(['questions'])
// console.log(props.questions)
const emit = defineEmits(['store-answer', 'end-quiz'])
import { ref, computed } from 'vue';

const currentQuestion = ref(0); //the initial value will be index 0 which is the first question
const selectedOption = ref(null);

const shuffleOptions = computed(() => {
    let options = [...props.questions[currentQuestion.value].incorrect_answers]
    // options.splice(0,0,props.questions[currentQuestion.value].correct_answer) //the first 0 allows the correct answer to always be place at the first, then followed by the incorrect answers
    options.splice(Math.round((Math.random() * options.length)),0,props.questions[currentQuestion.value].correct_answer)
    return options
}) 

const submitAnswer = () => {
    emit('store-answer', {
        question: props.questions[currentQuestion.value],
        userAnswer: selectedOption.value
    })
    selectedOption.value = null;

    if(currentQuestion.value === props.questions.length - 1) {
        currentQuestion.value = 0;
        emit('end-quiz')
    } else {
        currentQuestion.value += 1;
    }

    // currentQuestion.value += 1;
}
</script>

<template>
    <section class="quiz container">

        <div class="header">
            <h2>Quiz</h2>
            <p>Question {{ currentQuestion + 1 }} of {{ props.questions.length }}</p>
        </div>
        <progress max="100" :value="( currentQuestion + 1 ) / props.questions.length * 100"/>
        <h2>Quiz Component</h2>

        <div class="question">
            <h3>
                {{ props.questions[currentQuestion].question }} 
            </h3>
        </div>

        <div class="answers">
            <button class="answer" :class="{active: answer === selectedOption}" v-for="answer in shuffleOptions"
            :key="answer" @click="selectedOption = answer">
                {{ answer }}
            </button>
        </div>

        <button v-if="selectedOption" @click="submitAnswer">Send</button> <!--the v-if indicate that it should only show the send button if an answer was selected-->
        <!-- <p>{{ selectedOption }}</p> -->
    </section>
</template>