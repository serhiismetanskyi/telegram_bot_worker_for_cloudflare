export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'POST') {
      if (url.pathname === '/webhook') {
        try {
          const data = await request.json();

          const chatId = data.message?.chat?.id;
          const userName = data.message?.from?.username || data.message?.from?.first_name || 'No Name';
          const text = data.message?.text;

          const externalPayload = {
            chat_id: chatId,
            username: userName,
            text: text
          };

          console.log(`Received message from Telegram: chatId = ${chatId}, userName = ${userName}, text = ${text}`);

          const externalApiUrl = await env.SECRET_STORE.get("N8N");
          console.log(`Calling external API URL: ${externalApiUrl}`);
          
          const response = await fetch(externalApiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(externalPayload)
          });

          if (!response.ok) {
            console.error(`External API call failed with status: ${response.status}`);
          } else {
            console.log('External API call successful');
          }

          return new Response("OK", { status: 200 });
        } catch (err) {
          console.error('Error processing request:', err);
          return new Response("Error", { status: 500 });
        }
      }

      if (url.pathname === '/send-message') {
        const chatId = url.searchParams.get('chat_id');
        const message = url.searchParams.get('message');

        if (chatId && message) {
          const token = await env.SECRET_STORE.get("TOKEN");
          console.log(`Using Telegram token: ${token}`);
          
          const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;
          console.log(`Sending message to Telegram URL: ${telegramUrl}`);
          
          const payload = {
            chat_id: chatId,
            text: message
          };

          const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            console.error(`Failed to send message with status: ${response.status}`);
          } else {
            console.log(`Message sent to chat_id ${chatId}: ${message}`);
          }

          return new Response('Message sent', { status: 200 });
        } else {
          console.error('Missing chat_id or message');
          return new Response('Missing chat_id or message', { status: 400 });
        }
      }
    }

    console.error('Method Not Allowed');
    return new Response('Method Not Allowed', { status: 405 });
  }
}
