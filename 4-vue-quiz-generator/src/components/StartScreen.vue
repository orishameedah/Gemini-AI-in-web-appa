
<script setup>

import { ref } from 'vue'; // Importing ref for potential future use 
const emit = defineEmits(['start-quiz']); // Defining the emit event to communicate with parent component
const props = defineProps(['errorMessage'])
const topic = ref(''); // Reactive variable for topic input''; it will ensure that all the pages that use this will change its changes

</script>

<template>
    
    <section class="start-screen container">
        <h2>Choose a topic to start testing your knowledge</h2>
        <input v-model="topic" type="text" placeholder="Enter your topic..."/>
        <button @click="emit('start-quiz', topic)" :disabled="!topic">Start Quiz</button>
        <small class="error" v-if="errorMessage">There was an error, please try again later</small>
    </section>

</template>