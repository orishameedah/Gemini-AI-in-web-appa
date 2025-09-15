<script setup>
const props = defineProps(['userAnswers'])
const emit = defineEmits(['restart-quiz'])
import { computed } from 'vue';

const correctAnswersCount = computed(() => {
    return props.userAnswers.filter(answer => answer.userAnswer === answer.question.correct_answer).length
})

</script>

<template>
    <section class="result-screen container">
        <h1 v-if="correctAnswersCount == userAnswers.length"> &#122881; Congratulations!</h1> <!--it will show if the user answer correctly-->
        <h1>You have answered {{ correctAnswersCount }} out of {{ props.userAnswers.length }} questions correctly</h1>

        <ul>
            <li
                v-for="(answer, index) in props.userAnswers"
                :key="index"
                :class="answer.question.correct_answer == answer.userAnswer ? 'correct' : 'incorrect'">
                
                <p v-html="answer.question.correct_answer == answer.userAnswer ? '&#9989;' : '&#10060;'"></p>
                <b>{{ answer.question.question }}</b>
                <p>Your answer: {{ answer.userAnswer }}</p>
                <p>Correct answer: {{ answer.question.correct_answer }}</p>
            </li>
        </ul>

        <button @click="emit('restart-quiz')">Create a New Quiz</button>
    </section>
</template>