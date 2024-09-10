# WikipediaRead

WikipediaRead is Telegram bot run in Cloudflare Worker.
It help search Wikipedia inside Telegram

[Video when i create](https://youtu.be/mMCXSbXBUe0?si=XhtMpGITWRmazdr_)

## Feature
- Search Wikipedia
- Get top, feature, today of Wikipedia

## Usage
- access bot at [t.me/WikipediaReadBot](https://t.me/WikipediaReadBot)

## Install
- create cloudflare worker
Setting environment value of worker
```
API	                    https://api.telegram.org/bot
API_WIKIPEDIA           https://api.wikimedia.org
TOKEN                   your_bot_token
WEBHOOK_PATH            /telegram
WEBHOOK_SECRET          your_web_hook_secret
WIKIPEDIA_ACCESS_TOKEN	your_wikipedia_access_token
WIKIPEDIA_CLIENT_ID	    your_wikipedia_client_id
WIKIPEDIA_CLIENT_SECRET your_wikipedia_client_secret
```

- add this code to your worker
- config telegram bot point to your worker 

## Contribute
- fork, update, merge, open issue is happy
- [Subscribe my Youtube](https://www.youtube.com/@WingramOrg)