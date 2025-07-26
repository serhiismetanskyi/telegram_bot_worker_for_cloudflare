# Telegram Bot Worker for Cloudflare

This repository contains an implementation of a Telegram bot running on [**Cloudflare Workers**](https://workers.cloudflare.com/). It enables serverless processing of Telegram messages via the API.

The project is suitable for creating lightweight, efficient bots that do not require a traditional server environment. Ideal for automation, notifications, or integrations with other web services.

In this case, the bot is specifically designed for integration with **[n8n](https://n8n.io/)** — a workflow automation tool — allowing Telegram messages to trigger and interact with n8n workflows.

## Usage

1. Create a Telegram bot via [@BotFather](https://t.me/BotFather).
2. Configure environment variables using Cloudflare KV Storage for your worker.
3. Set up your `wrangler.toml` configuration file for deployment.
4. Deploy the code to Cloudflare Workers.
5. Set the webhook for your Telegram bot to point to your deployed Cloudflare Worker.

Once configured, messages sent to your bot will be automatically forwarded to n8n.
