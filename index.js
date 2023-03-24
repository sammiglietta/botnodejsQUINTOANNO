const telegraf = require("telegraf");
const dotenv = require("dotenv");
const path = require("path");
const { Certificate } = require("crypto");
const telegramBot = require("node-telegram-bot-api");
const { response } = require("express");
dotenv.config({
    path: "./.env"
})

const bot = new telegraf.Telegraf(process.env.BOT_TOKEN);
const bot2 = new telegramBot(process.env.BOT_TOKEN);

bot.start(async(ctx) => {
    await ctx.reply("Ciao "+ ctx.message.chat.first_name +", benvenuto ner bot di magisa ")
    await ctx.reply("/help per visualizzare la lista dei comandi")
})

bot.command("help", async(ctx) =>{
    await ctx.reply("LISTA DEI COMANDI : ")
    await ctx.reply("/start - Avvia Bot")
    await ctx.reply("/cercaprodotto - Ricerca su principali ECommerce ")
    await ctx.reply("/mandafoto - manda una parola e avvia la ricerca di un immagine")
    await ctx.reply("Scrivendo 'ciao' il bot avviarà una mini conversazione con noi")

})


bot.command("cercaprodotto", async(ctx) => {
    
    const argsPrdt = ctx.message.text.split(" ")
    argsPrdt.shift()

    const status = argsPrdt[0]
    if (!status) {
        await ctx.reply("Inserisci cosa cercare subito dopo /cercaprodotto es: /cercaprodotto pasta")
        return
    }

    try {
       // await ctx.reply(cercaPrdt(argsPrdt))
        await ctx.replyWithMarkdownV2(cercaEbay(argsPrdt))
        await ctx.replyWithMarkdownV2(cercaAmazon(argsPrdt))
        await ctx.replyWithMarkdownV2(cercaSubito(argsPrdt))
    } catch (err) {
        await ctx.reply("Errore...Non è stato possibile ricavare un risultato")
    }
})



function CercaImg(msg)
{
    var base= "https://www.google.it/search?q="
    var keyword =msg;
    var coda ="&hl=it&tbm=isch&source=hp&biw=1680&bih=865&ei=WygzY6CJGcSJ9u8P7POA6A4&iflsig=AJiK0e8AAAAAYzM2a78XddC-ZpDgZ0p-9hkKazcvAHTe&ved=0ahUKEwjgorPUtbX6AhXEhP0HHew5AO0Q4dUDCAc&uact=5&oq=ciao&gs_lcp=CgNpbWcQAzIICAAQgAQQsQMyCwgAEIAEELEDEIMBMgsIABCABBCxAxCDATILCAAQgAQQsQMQgwEyCAgAEIAEELEDMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQ6CAgAELEDEIMBOgQIABATULADWPsUYOAVaANwAHgBgAHjAYgBygWSAQU5LjAuMZgBAKABAaoBC2d3cy13aXotaW1nsAEA&sclient=img"

    return base+keyword+coda;
}

function cercaAmazon(msg){
    var strAmz = "https://www.amazon.it/s?k=" + msg;
    return '[Amazon]('+strAmz+')';

}
function cercaEbay(msg){
    var strEbay = "https://www.ebay.it/sch/i.html?_from=R40&_trksid=p2334524.m570.l1313&_nkw="+msg;
    return '[Ebay]('+strEbay+')';
}
function cercaSubito(msg){
    var strSubito = "https://www.subito.it/annunci-italia/vendita/usato/?q="+msg;
    return '[Subito]('+strSubito+')';
}



bot.command("mandafoto" , async (ctx) =>{
    const axios = require("axios");
    const argsImg = ctx.message.text.split(" ")
        argsImg.shift()

        const status = argsImg[0]
        if (!status) {
            ctx.reply("Inserisci cosa cercare subito dopo /mandafoto es: /mandafoto casa")
            return
        }
    const json = axios.get("https://api.serpdog.io/images?api_key=6335cde98c917f3a3d169a30&q="+argsImg+"&gl=it")
    .then(function(response){
        var parsedRespose = {} 
        var vet = [];
        var str = "";
        var strFin;
        parsedRespose = response.data;
        vet.push(Object.values(parsedRespose.image_results[0].image));
        //console.log(vet
        for(let i=0;i<vet.length;i++)
        {
            str=str+vet[i]
        }
        strF=str.replaceAll(',', '');
        const chatId = ctx.chat.id


        

        try {
            bot2.sendPhoto(chatId , strF);
        } catch (err) {
            ctx.reply("Errore...Non è stato possibile ricavare un risultato")
        }

        
    })
})



bot.command("test", async(ctx) =>{
    await ctx.reply("prova")
})
var scritto=false;
bot.hears("ciao" , async(ctx) => {
    await ctx.reply("Ciao, come stai?");
    scritto=true;
})
bot.hears("bene" , async(ctx) => {
    if(scritto===true)
    {
        await ctx.reply("Sono contento per te");
        scritto=false;
    }
    
    
})
bot.hears("male" , async(ctx) => {
    if(scritto===true)
    {
        await ctx.reply("Mi dispiace");
        scritto=false;
    }
    
})



bot.launch()
console.log("bot launched!")