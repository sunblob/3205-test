<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { vMaska } from 'maska/vue'

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      email: z.string().min(1).email(),
      number: z.string().optional()
    })
  )
})

const [email, emailAttrs] = defineField('email')
const [number, numberAttrs] = defineField('number')
const unmaskedNumber = ref('')

defineExpose({ unmaskedNumber })

import { useFetch } from '@/composables/fetch'

type User = { email: string; number: string }

const isLoading = ref(false)

const users = ref<User[]>()

const abortController = ref<AbortController>()

const canAbort = computed(() => abortController.value && isLoading.value)

const submitForm = handleSubmit(async (values) => {
  if (canAbort.value) {
    abortController.value?.abort()
    isLoading.value = false
  } else {
    isLoading.value = true
    abortController.value = new AbortController()

    const { data } = await useFetch<User[]>(
      'http://localhost:3000/users?' +
        new URLSearchParams({
          email: values.email ?? '',
          number: unmaskedNumber.value ?? ''
        }),
      {
        signal: abortController.value.signal
      }
    )

    if (data.value) {
      users.value = data.value
    }

    abortController.value = undefined
    isLoading.value = false
  }
})
</script>

<template>
  <main class="min-h-dvh bg-gray-800 p-10 flex flex-col gap-y-4">
    <form @submit.prevent="submitForm" class="flex flex-col gap-y-2">
      <input
        v-model="email"
        placeholder="Email"
        v-bind="emailAttrs"
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <div class="text-red-500">{{ errors.email }}</div>
      <input
        v-maska:unmaskedNumber.unmasked="'##-##-##'"
        v-model="number"
        placeholder="Number"
        v-bind="numberAttrs"
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <div class="text-red-500">{{ errors.number }}</div>
      <button
        type="submit"
        class="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md"
      >
        {{ canAbort ? 'Cancel' : 'Submit' }}
      </button>
    </form>
    <!-- <div class="text-muted">IsPending: {{ isLoading }}</div> -->
    <div v-if="users?.length" class="flex flex-col gap-y-2">
      <div v-for="(user, i) in users" :key="user.email" class="flex flex-col gap-y-1 text-muted">
        <h3 class="text-2xl">User № {{ i + 1 }}</h3>
        <div>User email: {{ user.email }}</div>
        <div>User number: {{ user.number }}</div>
      </div>
    </div>
  </main>
</template>
