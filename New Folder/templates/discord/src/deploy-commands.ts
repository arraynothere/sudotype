import { REST, Routes, SlashCommandBuilder } from "discord.js";

try {
  process.loadEnvFile();
} catch {
  // .env is optional
}

const { DISCORD_TOKEN, CLIENT_ID } = process.env;
if (!DISCORD_TOKEN || !CLIENT_ID) {
  console.error("Missing DISCORD_TOKEN or CLIENT_ID in .env");
  process.exit(1);
}

const commands = [new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!").toJSON()];

const rest = new REST().setToken(DISCORD_TOKEN);
await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
console.log("Slash commands registered.");
