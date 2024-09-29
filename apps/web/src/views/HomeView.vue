<script setup lang="ts">
import { computed, ref } from 'vue'
import { useFetch } from '@/composables/fetch'

type User = { email: string; number: string }

const email = ref('')
const number = ref('')

const { data, isPending, abort, execute } = useFetch<User>()

const user = computed(() => data.value)

async function submitForm() {
  execute(
    'http://localhost:3000/users?' +
      new URLSearchParams({
        email: email.value,
        number: number.value
      })
  )
}

function clear() {
  data.value = undefined
}
</script>

<template>
  <main>
    <form @submit.prevent="submitForm">
      <input v-model="email" placeholder="Email" />
      <input v-model="number" placeholder="number" />
      <button type="submit">Submit</button>
      <button v-if="user" @click.prevent="clear">Clear</button>
      <button v-if="isPending" @click.prevent="abort">Abort</button>
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
