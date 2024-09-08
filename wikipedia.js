export default class BaseWiki {
    API;
    TOKEN;
    constructor(env) {
        this.API = env.API_WIKIPEDIA
        this.TOKEN = env.WIKIPEDIA_ACCESS_TOKEN
    }

    /*
        Sample:
        - new feed: https://api.wikimedia.org/feed/v1/wikipedia/en/featured/2024/06/24
        - search title: https://api.wikimedia.org/core/v1/wikipedia/en/search/title?q=earth&limit=5 
    */

    async makeRequest(path) {
        const res = await fetch(
            this.API + path, {
            headers: {
              "content-type": "application/json;charset=UTF-8",
              "Authorization": "Bearer " + this.TOKEN
            },
            cf: {
                cacheTtl: 12000,
                cacheEverything: true,
            }
        })

        const data = await res.json()
    
        if(res.ok) {
            return data
        } else {
            console.log("------> error ", data)
            throw new Error(data)
        }
    }

    async searchTitle(lang, query, limit) {
        return (await this.makeRequest(`/core/v1/wikipedia/${lang}/search/title?q=${query}&limit=${limit}`)).pages
    }

    async searchContent(lang, query, limit) {
        return await this.makeRequest(`/core/v1/wikipedia/${lang}/search/page?q=${query}&limit=${limit}`)
    }

    linkPage(lang, key) {
        return 'https://' + lang + '.wikipedia.org/wiki/' + key
    }
    /*
    Type of event:
        all: Returns all types
        selected: Curated set of events that occurred on the given date
        births: Notable people born on the given date
        deaths: Notable people who died on the given date
        holidays: Fixed holidays celebrated on the given date
        events: Events that occurred on the given date that are not included in another type
    */
    async onThisDay(lang, type, MM, DD) {
        // https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/selected/06/20
        const url = `/feed/v1/wikipedia/${lang}/onthisday/${type}/${MM}/${DD}`
        return await this.makeRequest(url)
    }

    async featuredContent(lang, YYYY, MM, DD) {
        return await this.makeRequest(`/feed/v1/wikipedia/${lang}/featured/${YYYY}/${MM}/${DD}`)
    }
}
