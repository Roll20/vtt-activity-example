<script setup lang="ts">
import {
    defineProps,
    onMounted,
} from 'vue';
import { useCampaign } from '../composables/useCampaign';

const props = defineProps({
    storagePath: {
        type: String,
        required: true,
    },
})

const { getCampaign } = useCampaign(props.storagePath)

onMounted(() => {
    getCampaign().then((campaignData) => {
        console.log({ campaignData });
    })
})

</script>

<template>
    <div>Checks if Websocket/long-polling worked RE: Firebase</div>
</template>
