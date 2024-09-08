export default class BaseBot {
    urlApi;
    constructor(env){
        const API = env.API
        const TOKEN = env.TOKEN;

        this.urlApi = API + TOKEN
    }

    async makeRequest(methodBot, body) {
        let bodyJson;
        if(body){
            bodyJson = JSON.stringify(body)
        }
        const res = await (await fetch(this.urlApi + "/" + methodBot , {
            method: "POST",
            headers: {
                "content-type": "application/json;charset=UTF-8",
            },
            body: bodyJson
        })).json()
    
        if(res["ok"]) {
            return res
        }else {
            console.log("-----------> error request ", res)
            throw new Error(res["description"])
        }
    }

    parseCommand(text){
        const parts = text.split(" ", 2);
        const command = parts[0] ? parts[0].slice(1).toLowerCase() : "";
        const param = parts[1] || "";

        return {
            command,
            param
        }
    }

    async sendMessge(chatId, text){
        return await this.makeRequest("sendMessage", {
            chat_id: chatId,
            text: text,
            parse_mode: "Markdown"
        })
    }

    async sendPhoto(chatId, text, photo) {
        return await this.makeRequest("sendPhoto", {
            chat_id: chatId,
            caption: text,
            parse_mode: "Markdown",
            photo: photo
        })
    }

    async sendTyping(chatId) {
        return await this.makeRequest("sendChatAction", {
            chat_id: chatId,
            action: "typing"
        })
    }
}
