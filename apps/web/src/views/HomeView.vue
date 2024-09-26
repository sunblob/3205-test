<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const number = ref('')
const isPending = ref(false)
const user = ref<{ email: string; number: string }>()

async function submitForm() {
  try {
    isPending.value = true
    const response = await fetch(
      'http://localhost:3000/users?' +
        new URLSearchParams({
          email: email.value,
          number: number.value
        }),
      {
        method: 'GET'
      }
    )
    const data = await response.json()
    user.value = data
  } catch (err) {
    console.log(err)
  } finally {
    isPending.value = false
  }
}
</script>

<template>
  <main>
    <form @submit.prevent="submitForm">
      <input v-model="email" placeholder="Email" />
      <input v-model="number" placeholder="number" />
      <button type="submit">Submit</button>
    </form>
    <div>IsPending: {{ isPending }}</div>
    <div v-if="user">
      <div>User email: {{ user.email }}</div>
      <div>User number: {{ user.number }}</div>
    </div>
  </main>
</template>

<style>
form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
