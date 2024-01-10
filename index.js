console.log("hi")
import request from "request"
import fs from "fs"
import TelegramBot from "node-telegram-bot-api"
import express from "express"
const bot = new TelegramBot("6954342408:AAFLUF3FCWfOYSkBRQIm0DWNCLuTVDWEuOI", {
    polling: true
})

//CRAET NEW ID---------
let red = fs.readFileSync("./ids.json")
let toJson = JSON.parse(red)
bot.on("message", (msg) => {
    if (toJson.id.indexOf(msg.chat.id) == -1) {
        bot.sendMessage(msg.chat.id, "craet you now to bot")
        toJson.id.push(msg.chat.id)
        fs.writeFileSync("./ids.json", JSON.stringify(toJson))
    }
})


const app = express()
app.get('/', (req, res) => {
    res.send('hello world!')
})
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`this app   http://localhost:${port}`)
})


const command = [
    {
        command: "start",
        description: "start now",
        regexp: /\/start/
    },
    {
        command: "follow",
        description: "F قم بمتابعة المطور",
        regexp: /\/follow/
    },
    {
        command: "athan",
        description: "A مواعيد الصلاوات",
        regexp: /\/athan/
    },
    {
        command: "admin",
        description: "admins",
        regexp: /\/admin/
    }
]


bot.onText(command[3].regexp, (msg) => {
    const arr = [5358365084, 6203364714]
    if (arr.indexOf(msg.chat.id) != -1) {
        bot.sendMessage(msg.chat.id, `ok admin, Participants number !( ${toJson.id.length} )`)
    } else {
        bot.sendMessage(msg.chat.id, `sorry ${msg.from.first_name} you not admin, admins this bot @bashar1_x  @Amjad_kh1`)
    }
})




//FOLLOW ME ----------
bot.onText(command[1].regexp, (msg) => {
    bot.sendMessage(msg.chat.id, "تستطيع متابعة المطور على..🎯", {
        'reply_markup': {
            "inline_keyboard": [
                [
                    { text: "telegram", url: "https://t.me/bashar1_x" },
                    { text: "instagram", url: "https://instagram.com/bashar1_x" },
                    { text: "facebook", url: "https://facebook.com/bashar1.x" },
                    { text: "whatsapp", url: "https://wa.me/0938768556" }
                ]
            ]
        }
    })
})


//ALAATHKAR -------


// SEND START-----------
bot.on("message", (msg) => {
    if (msg.text != '/start' && msg.text != '/follow' && msg.text != '/admin' && msg.text != '/athan' && !msg.location) {

        bot.sendMessage(msg.chat.id, 'أضغط /start', {
            "reply_markup": {
                keyboard: [
                    [{ text: '/start' }]
                ],
                resize_keyboard: true,
                one_time_keyboard: true,
            }
        })
    }
})


//MSG DESCRIPTION AND SEND READER--------
bot.onText(command[0].regexp, (msg) => {
    const text =
        `
مرحبا ${msg.chat.first_name}

أضغط على الزر في الأسفل للحصول على قوائم القرائ

ثم قم بأختيار القارئ
للحصول على السور التي قام بتلاوتها

بعدها اختر السورة

    🎁💛
`
    bot.sendMessage(msg.chat.id, text, {
        "reply_markup": {
            "inline_keyboard": [
                [{ text: 'أضغط هنا', callback_data: 'cl_reader' }]
            ]
        }
    })
})


//GET READER-----
bot.on("callback_query", (query) => {

    if (query.data == 'cl_reader') {
        bot.sendMessage(query.message.chat.id, `سيتم أرسال قوائم القرائ الأن...📑`)
        request(`https://mp3quran.net/api/v3/reciters?language=ar`, async (error, response, body) => {
            const data = await JSON.parse(body)

            let opject = {
                txt: [],
                nomb: 0
            }
            let x;

            for (let i = 0; i < data.reciters.length; i++) {
                opject.nomb++
                let nameLest = { text: data.reciters[i].name, callback_data: 'r' + data.reciters[i].id }

                opject.txt.push(nameLest)

                if (opject.nomb == 4) {
                    x = i
                    bot.sendMessage(query.message.chat.id, "!", {
                        'reply_markup': {
                            'inline_keyboard': [
                                opject.txt
                            ]
                        }
                    })
                    //console.log(opject.txt)
                    opject.txt = []
                    opject.nomb = 0
                }
            }

            for (let o = x; o < data.reciters.length; o++) {
                bot.sendMessage(query.message.chat.id, "!", {
                    'reply_markup': {
                        'inline_keyboard': [
                            [{ text: data.reciters[o].name, callback_data: 'r' + data.reciters[o].id }]
                        ]
                    }
                })
            }

        })

    }

})



//GET INFORMTION-------
let server_0 = 'https://server6.mp3quran.net/jaman/'
let name_0 = ''
bot.on("callback_query", (query) => {
    if (query.data[0] == 'r') {

        request(`https://mp3quran.net/api/v3/reciters?language=ar&reciter=${query.data.slice(1)}`, async (error, response, body) => {
            const data = await JSON.parse(body)
            let surah_1 = data.reciters[0].moshaf[0].surah_list
            surah_1 = surah_1.split(',')
            req2(surah_1)

            //server
            server_0 = data.reciters[0].moshaf[0].server
            name_0 = data.reciters[0].name

            bot.sendMessage(query.message.chat.id, `سيتم أرسال قوائم السور بصوت ${name_0}`)
        })
        // -   - - - - - -  -- - - -  -  - - - -
        function req2(surah_1) {
            request(`https://mp3quran.net/api/v3/suwar?language=ar`, async (error, response, body) => {
                bot.sendMessage(query.message.chat.id, "⏳")
                const data = await JSON.parse(body)
                let surah_2 = data.suwar
                let opject = {
                    txt: [],
                    nomb: 0
                }


                surah_1.forEach(surah => {
                    surah_2.forEach(surah_3 => {
                        if (surah_3.id == surah) {
                            opject.nomb++
                            let nameLest = { text: surah_3.name, callback_data: 's' + surah_3.id }
                            opject.txt.push(nameLest)
                            if (surah_1.length >= 5 && opject.nomb == 5 || surah_1.length < 5) {

                                bot.sendMessage(query.message.chat.id, "!", {
                                    'reply_markup': {
                                        'inline_keyboard': [
                                            opject.txt
                                        ]
                                    }
                                })
                                opject.txt = []
                                opject.nomb = 0
                            }
                        }
                    })
                })



                let str = JSON.stringify(surah_1.length)
                if (surah_1.length != 5 && surah_1.length != 0) {

                    for (let x = str[str.length - 1]; x != 5 && x != 0; x--) {
                        surah_2.forEach(surah_3 => {
                            if (surah_3.id == surah_1[x]) {
                                bot.sendMessage(query.message.chat.id, "!", {
                                    'reply_markup': {
                                        'inline_keyboard': [
                                            [{ text: surah_3.name, callback_data: 's' + surah_3.id }]
                                        ]
                                    }
                                })
                            }
                        })
                    }
                }

            })
        }
    }
})



//SEND SWRA------
bot.on("callback_query", (query) => {
    if (query.data[0] == 's') {
        bot.sendMessage(query.message.chat.id, `أتمنا لك حسن اللأستماع بسوط القارئ ${name_0}
        🔊☪..
        
        ما رأيك بدعم المطور
        أضغط هنا(/follow)`)

        let red_m = query.data.slice(1)
        let nomb = ''
        if (red_m >= 1 && red_m <= 9) {
            nomb = "00"
        } else if (red_m >= 10 && red_m <= 99) {
            nomb = "0"
        } else if (red_m >= 100) {
            nomb = ""
        }
        bot.sendAudio(query.message.chat.id, `${server_0}${nomb}${red_m}.mp3`)
        const arr = ["🍃", "❤", "🧡", "💛", "💚", "💙", "🤍", "💜", "🤎", "💖", "💝"]
        const random = Math.floor(Math.random() * arr.length - 1) + 1;
        bot.sendMessage(query.message.chat.id, arr[random])
    }
})


bot.onText(command[2].regexp, (msg) => {
    const text = 
    `
حسنا ${msg.chat.first_name}
للحصول على مواعيد الصلوات يجب الحصول على موقعك الحالي
        📌
    `
    bot.sendMessage(msg.chat.id, text, {
        "reply_markup": {
            "inline_keyboard": [
                [{ text: 'أضغط هنا', callback_data: 'getLocation' }]
            ]
        }
    })
})

bot.on("callback_query", (query) => {
    if (query.data == 'getLocation') {
        const opts = {
            reply_markup: JSON.stringify({
                keyboard: [
                    [{ text: 'أرسال الموقع', request_location: true }]
                ],
                resize_keyboard: true,
                one_time_keyboard: true,
            })
        };
        bot.sendMessage(query.message.chat.id, 'أضغط أرسال الموقع في الأسفل من  فضلك', opts);
    }
})


bot.on('location', (msg) => {
    bot.sendMessage(msg.chat.id, "⏳")
    request(`http://api.aladhan.com/v1/gToH`, async (error, response, body) => {
        const data0 = await JSON.parse(body)
        var time_hjr = Number(data0.data.hijri.day) - 1
        request(`http://api.aladhan.com/v1/hijriCalendar?latitude=${msg.location.latitude}&longitude=${msg.location.longitude}`, async (error, response, body) => {
            const data = await JSON.parse(body)
            const day = data.data[time_hjr].date.hijri.weekday.ar
            const { Fajr, Dhuhr, Asr, Maghrib, Isha } = data.data[time_hjr].timings

            let fajrH = Number(Fajr[0] + Fajr[1]); let fajrM = Fajr[3] + Fajr[4]
            let dhuhrH = Number(Dhuhr[0] + Dhuhr[1]); let dhuhrM = Dhuhr[3] + Dhuhr[4]
            let asrH = Number(Asr[0] + Asr[1]); let asrM = Asr[3] + Asr[4]
            let maghribH = Number(Maghrib[0] + Maghrib[1]); let maghribM = Maghrib[3] + Maghrib[4]
            let ishaH = Number(Isha[0] + Isha[1]); let ishaM = Isha[3] + Isha[4]
            //____________________TIMING___________________________
            var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

            let fajrTime = arr[fajrH - 1] + ":" + fajrM
            let dhuhrTime = arr[dhuhrH - 1] + ":" + dhuhrM
            let asrTime = arr[asrH - 1] + ":" + asrM
            let maghribTime = arr[maghribH - 1] + ":" + maghribM
            let ishaTime = arr[ishaH - 1] + ":" + ishaM

            const timings_sala =
            `
            "مواعيد الصلوات يوم ${day} 🗃"

            الفجر  ${fajrTime}

            الظهر  ${dhuhrTime}
        🕌💙
            العصر  ${asrTime}

            المغرب  ${maghribTime}

            العشاء  ${ishaTime}
            `
            bot.sendMessage(msg.chat.id, timings_sala)
        })
    })
});




bot.setMyCommands(command)
bot.on("polling_error", console.log)