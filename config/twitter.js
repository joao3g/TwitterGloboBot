const Twitter = require('twitter')
const util = require('util')

var cliente = new Twitter({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token_key: process.env.access_token_key,
    access_token_secret: process.env.access_token_secret
})

var post_promise = util.promisify(
    (options, data, cb) => cliente.post(
      options,
      data,
      (err, ...results) => cb(err, results)
    )
)

const tweet_crafter = async (array, id) => { 
    for(let i = 1; i < array.length; i++){
      let content = await post_promise('statuses/update', { status: array[i], in_reply_to_status_id: id });
      id = content[0].id_str;
    };
};

const tweet = (first, subsequent) => { 
post_promise('statuses/update', { status: `${first}` })
    .then((top_tweet) => {
        console.log(`Twittado!`);
        let starting_id = top_tweet[0].id_str; // Get top-line tweet ID...
        tweet_crafter(subsequent, starting_id);
    })
    .catch(err => console.log(err));
};


cliente.thread = function Tweet(message){
    
    console.log('Tweetando ...\n')
    
    var messageArray = [message]
    
    var caracteres = message.length
    
    if(caracteres > 280){
        
        var quantTweets, particionedTweet = [], arrayMessage = message.split('\n');

        (caracteres / 280) % 1  == 0 ? quantTweets = parseInt(caracteres / 280) : quantTweets =  parseInt(caracteres / 280) + 1

        for(i = 0; i < quantTweets; i++){
            
            let slice = arrayMessage.slice(
                arrayMessage.length / quantTweets * i,
                arrayMessage.length / quantTweets * (i + 1) 
            );
            
            (i > 0) ? slice.unshift('Continuação: ') : null

            particionedTweet.push(slice)
            
        }
        
        for(i in particionedTweet){
            
            particionedTweet[i] = particionedTweet[i].filter(index => {
                
                if(index.length != 0){
                    
                    return index;
                    
                }
                
            });

            particionedTweet[i][0] = particionedTweet[i][0] + '\n';
            
            particionedTweet[i] = particionedTweet[i].join('\n')
            
            if( particionedTweet[i].length > 280 ){

                var atual = particionedTweet[i];
                
                caracteres = atual.length;
                (caracteres / 280) % 1  == 0 ? quantTweets = parseInt(caracteres / 280) : quantTweets =  parseInt(caracteres / 280) + 1
                
                atual = atual.split('\n')
                var newAtual = []
                
                for(i = 0; i < quantTweets; i++){
                    
                    let slice = atual.slice(
                        atual.length / quantTweets * i,
                        atual.length / quantTweets * (i + 1) 
                        );
                        
                        (i > 0) ? slice.unshift('Continuação: ') : null;
                        
                        
                    newAtual.push(slice);
                    
                    newAtual[i] = newAtual[i].filter(index => {
                        
                        if(index.length != 0){
                            
                            return index;
                            
                        }
                        
                    });
                    
                }
                
                for(i in newAtual){
                    
                    newAtual[i][0] = newAtual[i][0] + '\n';
                    newAtual[i] = newAtual[i].join('\n') 
                    
                }
                
                particionedTweet.splice(i,1)
                particionedTweet = particionedTweet.concat(newAtual)
            }
        }
    }
    tweet(particionedTweet[0],particionedTweet)
}

module.exports = cliente;