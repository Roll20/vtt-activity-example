import { DiscordSDK } from '@discord-external/activity-iframe-sdk';

export const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

export default discordSdk;
