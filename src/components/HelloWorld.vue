<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { signIn } from '../auth';

defineProps<{ msg: string }>()

const count = ref(0)

onMounted(async () => {
  const response = await fetch("/editor/firebase_token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }); 
  const body = await response.json();
  console.log({ body });
  const {
    token,
  } = body;
  const { jwt } = token;

  try {
    const authInfo = await signIn({
      token: jwt,
    });
    console.log({ authInfo });
  } catch (err) {
    console.error({ err }); // We seem to always end up here, chief
  }
})

</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test hot-reloading
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
