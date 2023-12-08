<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { signIn } from '../auth';
import Campaign from './Campaign.vue';

defineProps<{ msg: string }>()

const count = ref(0)
const authenticated = ref(false);
const storagePath = ref('');

onMounted(async () => {
  const response = await fetch("/editor/firebase_token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }); 
  const body = await response.json();
  console.log({ body });
  const {
    campaign,
    token,
  } = body;
  const { jwt } = token;
  storagePath.value = campaign.storage_path;

  const authInfo = await signIn({
      token: jwt,
  });
  authenticated.value = true;
  console.log({ authInfo });
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
  <Campaign
    v-if="authenticated"
    :storage-path="storagePath"
  ></Campaign>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
