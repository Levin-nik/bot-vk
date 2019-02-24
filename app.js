'use strict';

const VKApi = require('node-vkapi');
var request = require('request');
var h2p = require('html2plaintext')
const vk = new VKApi({
    accessToken: "bb9c2055ddc81a51ace616141be0fa6f924cc55b492cd233b27d183ad5d90ace1ae853267e93e1ab7c4dd"
});
let keyboard = { 
    "one_time": false, 
    "buttons": [ 
    [{ 
        "action": { 
        "type": "text", 
        "payload": "{\"button\": \"Анекдот\"}", 
        "label": "Анекдот" 
        }, 
        "color": "positive" 
    }]
    ] 
} 
setInterval(() => {
    vk.call('messages.getDialogs',{
        out:0,
        count:10,
    }).then((res)=>{
        res.items.forEach(element => {
            
            if(element.message.out === 0 && element.message.body === 'Анекдот'){
                console.log(element.message)
                console.log('otpravka');
                
                request(
                    'http://umorili.herokuapp.com/api/random?num=50',
                    function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            function getRandomInt(min, max) {
                                return Math.floor(Math.random() * (max - min)) + min;
                            }
                            var a = JSON.parse(body)[getRandomInt(1,50)];
                            vk.call('messages.send',{
                                user_id: element.message.user_id,
                                message: h2p(a.elementPureHtml),
                                keyboard: JSON.stringify(keyboard)
                            });
                        }
                    }
                );
            }else if(element.message.out === 0){
                
                vk.call('messages.send',{
                    user_id: element.message.user_id,
                    message: 'Я нифига не знаю кроме команды "Анекдот"',
                    keyboard: JSON.stringify(keyboard)
                });
            }
        });
    }).catch((err)=>{
        console.log(err);
    })
}, 2000);