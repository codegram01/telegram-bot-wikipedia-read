import BaseBot from "./baseBot.js";
import messageBot from "./messageBot.js"
import BaseWiki from "./wikipedia.js"
import { getToday, parseLangContent } from "./modules.js"

export default class Bot extends BaseBot {
    baseWiki;
    constructor(env){
        super(env)

        this.baseWiki = new BaseWiki(env)
    }

    async onUpdate(update) {
        const inline = update.inline_query;
        if(inline) {
            await this.onInlineQuery(inline.id, inline.query)
            return
        }

        const message = update.message
        const chatId = message.chat.id;
        const text = message.text;

        // check is result from inline 
        if(message.via_bot && message.via_bot.id == 7308389858) {
            return
        }

    
        if (text.startsWith("/")) {
          const {command, param} = this.parseCommand(text)
          await this.onCommand(chatId, command, param)
          return
        }

        await this.onMessage(chatId, text)
    }

    async onInlineQuery(inline_query_id, query) {
        if(!query) {
            return
        }
        let {lang, content } = parseLangContent(query)
        if(!lang) {
            lang = "en"
        }
        const pages = await this.baseWiki.searchTitle(lang, content, 6)
        const results = []
        for(const page of pages) {
            const titlePage = page.title
            const urlPage = this.baseWiki.linkPage(lang, page.key)
            const descPage = page.description ? page.description : ""
            const thumbnail = page.thumbnail ? "https:" + page.thumbnail.url : ""
            console.log(titlePage, urlPage, descPage, thumbnail)
            
            results.push({
                type: 'article',
                id: page.key,
                title: titlePage,
                url: urlPage,
                hide_url: true,
                description: descPage,
                thumbnail_url: thumbnail,
                input_message_content: {
                    message_text: `[${titlePage}](${urlPage})\n${descPage}`,
                    parse_mode: "Markdown",
                    link_preview_options: {
                        // is_disabled: true,
                        url: urlPage,
                        prefer_small_media: true
                    },
                },
                // reply_markup: {
                //     inline_keyboard:[[
                //         {
                //             text: `Open ${titlePage}`, 
                //             url: urlPage
                //         }
                //     ]]
                // },
            })
        }

        await this.makeRequest("answerInlineQuery", {
            inline_query_id: inline_query_id,
            results: results
        })
    }

    async onMessage(chatId, text){
        let {lang, content } = parseLangContent(text)
        if(!lang) {
            lang = "en"
        }
        const pages = await this.baseWiki.searchTitle(lang, content, 3)
        for(const page of pages) {
            const titlePage = page.title
            const urlPage = this.baseWiki.linkPage(lang, page.key)
            const descPage = page.description ? page.description : ""

            await this.makeRequest("sendMessage", {
                chat_id: chatId,
                text: `[${titlePage}](${urlPage})\n${descPage}`,
                link_preview_options: {
                    // is_disabled: true,
                    url: urlPage,
                    prefer_small_media: true
                },
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard:[[
                        {
                            text: `Open ${titlePage}`, 
                            web_app: {
                                "url": urlPage
                            }
                        }
                    ]]
                },
                disable_notification: true
            })
        }
    }

    async onCommand(chatId, command, param) {
        const {YYYY, MM, DD} = getToday()
        switch (command) {
        case "start":
            await this.sendMessge(chatId, messageBot.start)
            break;
        case "help":
            await this.sendMessge(chatId, messageBot.start)
            break;
        case "info":
            await this.sendMessge(chatId, messageBot.info)
            break;
        case "onthisday":
            const selecteds = (await this.baseWiki.onThisDay("en", "selected", MM, DD)).selected
            let message = ""
            message += `*${YYYY}-${MM}-${DD}*\n\n`
            for(const selected of selecteds.slice(0, 3)) {
                message += `*[${selected.year}] ${selected.text}*\n`
                message += "\n"

                for(const page of selected.pages.slice(0, 3)) {
                    const urlPage = this.baseWiki.linkPage("en", page.title)

                    message += `- [${page.normalizedtitle}](${urlPage}): ${page.description} \n`
                }
                message += "\n"
            }
            await this.sendMessge(chatId, message)
            break;
        case "featured":
            await this.sendTyping(chatId)
            const featured = await this.baseWiki.featuredContent("en", YYYY, MM, DD)
            {
                const tfa = featured.tfa
                const urlPage = this.baseWiki.linkPage("en", tfa.title)

                let message = ""
                message += "*Today's featured article*\n\n"
                message += `[${tfa.normalizedtitle}](${urlPage})\n`
                message += `${tfa.extract}`

                this.makeRequest("sendMessage", {
                    chat_id: chatId,
                    text: message,
                    parse_mode: "Markdown",
                    reply_markup: {
                        inline_keyboard:[[
                            {
                                text: `Open ${tfa.normalizedtitle}`, 
                                web_app: {
                                    "url": urlPage
                                }
                            }
                        ]]
                    },
                })
            }
            {
                const tImg = featured.image

                const urlImg = tImg.thumbnail.source
                const descImg = tImg.description.text

                let message = "*Picture of the day*\n\n"
                message += descImg
                
                await this.sendPhoto(chatId, message, urlImg)
            }


            break;
        }
    }
}
