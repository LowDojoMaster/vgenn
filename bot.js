const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();

const cooldowns = new Map();

const randomMessages = fs.readFileSync('./hesap.txt', 'utf8').split('\n').filter(Boolean); // elleşme 

client.on('ready', async () => {
    console.log('Bot is ready!');
});

client.on('message', async (message) => {
    if (message.content.toLowerCase() === '!vgen') {
        const randomIndex = Math.floor(Math.random() * randomMessages.length);
        const selectedMessage = randomMessages[randomIndex];

        const gifFilePath = './furina.gif'; // gif dosyası adı neyse aynısı yazılıyor

        // Komutun cooldown süresi (örneğin 15 dakika)
        const cooldownTime = 15 * 60 * 1000; // milisaniye cinsinden elleme

        // Kullanıcı ID'sini ve komutun son kullanım zamanını kontrol et
        if (cooldowns.has(message.author.id)) {
            const lastUsage = cooldowns.get(message.author.id);
            const elapsedTime = Date.now() - lastUsage;

            if (elapsedTime < cooldownTime) {
                const remainingTime = (cooldownTime - elapsedTime) / 1000; // zaman
                message.reply(`Bu komutu tekrar kullanabilmek için ${remainingTime.toFixed(0)} saniye beklemelisin.`); // bunu elleme
                return;
            }
        }

        // Komutun son kullanım zamanını güncelle
        cooldowns.set(message.author.id, Date.now());

        const attachment = new Discord.MessageAttachment(gifFilePath, 'animated.gif');

        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Valorant Hesap Kullanıcı Adı ve Şifre') // Başlık
            .attachFiles([attachment])
            .setImage('attachment://animated.gif') //Dokunmuyorsun
            .setDescription(selectedMessage);

        // Kullanıcının DM'ine özel mesajı embed olarak gönder
        try {
            await message.author.send(embed);
            message.reply('Özel mesajını kontrol et!');// komudu kullandıktan sonra dm bakması için uyarır
        } catch (error) {
            console.error('Özel mesaj gönderilemedi:', error);
            message.reply('Özel mesaj gönderilemedi. DM (özel mesajlar) ayarlarını kontrol et!');
        }
    }
});

client.login('token'); // Token