const Discord = require('discord.js')

function twit(twitter_client, twitter_params, client, config, debug, functiondate, functiontime, old_avatar, old_count, old_name, old_tweets){
    setInterval(function(){
        twitter_client.get('statuses/user_timeline', twitter_params, (err, tweets) => {
            if (err) client.shard.send(err);

            if (old_name && old_name === tweets[0].user.name) {
                if (debug === true) client.shard.send(`[DEBUG: ${functiondate()} - ${functiontime()}] display name not changed`)
            }
            if (old_name && old_name !== tweets[0].user.name){
                if (debug === true) client.shard.send(`[DEBUG: ${functiondate()} - ${functiontime()}] display name changed, setting in Discord...`)
                client.user.setUsername(tweets[0].user.name).catch(err=>{
                    if (debug === true) client.shard.send(err)
                    client.user.setUsername(tweets[0].user.screen_name)
                })
                old_name = tweets[0].user.name
            }
            if (!old_name){
                if (debug === true) client.shard.send(`[DEBUG: ${functiondate()} - ${functiontime()}] old_name not defined, setting var`)
                client.user.setUsername(tweets[0].user.name).catch(err=>{
                    client.shard.send(err)
                    client.user.setUsername(tweets[0].user.screen_name)
                })
                old_name = tweets[0].user.name
            }
        
            if (old_count && old_count === tweets[0].user.followers_count) {
                if (debug === true) client.shard.send(`[DEBUG: ${functiondate()} - ${functiontime()}] followers counter not changed`)
            }
            if (old_count && old_count !== tweets[0].user.followers_count){
                if (debug === true) client.shard.send(`[DEBUG: ${functiondate()} - ${functiontime()}] followers counter changed, setting in Discord...`)
                client.user.setActivity(`${tweets[0].user.followers_count} followers`, { type: 'WATCHING' })
                old_count = tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg")
            }
            if (!old_count){
                if (debug === true) client.shard.send(`[DEBUG: ${functiondate()} - ${functiontime()}] old_counts not defined, setting var`)
                client.user.setActivity(`${tweets[0].user.followers_count} followers`, { type: 'WATCHING' })
                old_count = tweets[0].user.followers_count
            }
        
            if (old_avatar && old_avatar === tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg")) {
                if (debug === true) client.shard.send(`[DEBUG: ${functiondate()} - ${functiontime()}] avatar not changed`)
            }
            if (old_avatar && old_avatar !== tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg")){
                if (debug === true) client.shard.send(`[DEBUG: ${functiondate()} - ${functiontime()}] avatar changed, setting in Discord...`)
                client.user.setAvatar(tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg")).catch(err=>{if (debug === true) client.shard.send(`[${functiondate()} - ${functiontime()}] ${err}`)})
                old_avatar = tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg")
            }
            if (!old_avatar){
                if (debug === true) client.shard.send(`[DEBUG: ${functiondate()} - ${functiontime()}] old_avatar not defined, setting var`)
                client.user.setAvatar(tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg")).catch(err=>{if (debug === true) client.shard.send(`[${functiondate()} - ${functiontime()}] ${err}`)})
                old_avatar = tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg")
            }
        

            if (old_tweets && old_tweets === tweets[0].id) {
                if (debug === true) client.shard.send(`[DEBUG: ${functiondate()} - ${functiontime()}] no new tweets`)
            }
            if (old_tweets && old_tweets !== tweets[0].id) {
                try{
                if (debug === true) client.shard.send(`[DEBUG: ${functiondate()} - ${functiontime()}] new tweet! sending in Discord...`)
                
                let embed = new Discord.RichEmbed

                tweets[0].text.replace('&amp;', '&')

                if (tweets[0].retweeted === true || tweets[0].text.startsWith('RT')) {
                    if (config.retweet === true){
                        if (debug === true) client.shard.send(`[DEBUG: ${functiondate()} - ${functiontime()}] Retweet from @${tweets[0].retweeted_status.user.screen_name}`)
                        embed   .setColor(`#${tweets[0].retweeted_status.user.profile_sidebar_border_color}`)
                                .setAuthor(`Retweet\n${tweets[0].retweeted_status.user.name} (@${tweets[0].retweeted_status.user.screen_name})`, tweets[0].retweeted_status.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"), `https://twitter.com/${tweets[0].user.screen_name}/status/${tweets[0].id_str}`)
                                .setDescription(tweets[0].retweeted_status.text)
                                .setTimestamp(tweets[0].retweeted_status.created_at)
                                .setThumbnail('https://img.icons8.com/color/96/000000/retweet.png')
                        if (tweets[0].retweeted_status.entities.media) embed.setImage(tweets[0].retweeted_status.entities.media[0].media_url_https)
                        if (client.channels.find(c=>c.id == config.channel_id)) client.channels.find(c=>c.id == config.channel_id).send(embed)
                    } else {
                        if (debug === true) client.shard.send(`[DEBUG: ${functiondate()} - ${functiontime()}] Retweet from @${tweets[0].retweeted_status.user.screen_name}, but retweet config is disabled`)
                    }
                } else if (tweets[0].retweeted === false || !tweets[0].text.startsWith('RT')) {
                    if (tweets[0].in_reply_to_status_id == null || tweets[0].in_reply_to_user_id == null) {
                        if (debug === true) client.shard.send(`[DEBUG: ${functiondate()} - ${functiontime()}] Simple tweet`)
                        embed   .setColor(`#${tweets[0].user.profile_sidebar_border_color}`)
                            .setAuthor(`${tweets[0].user.name} (@${tweets[0].user.screen_name})`, tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"), `https://twitter.com/${tweets[0].user.screen_name}/status/${tweets[0].id_str}`)
                            .setDescription(tweets[0].text)
                            .setTimestamp(tweets[0].created_at)
                            if (tweets[0].entities.media) embed.setImage(tweets[0].entities.media[0].media_url_https)
                            if (client.channels.find(c=>c.id == config.channel_id)) client.channels.find(c=>c.id == config.channel_id).send(embed)
                    } else if (tweets[0].in_reply_to_status_id != null || tweets[0].in_reply_to_user_id != null){
                        if (config.reply === false){
                            if (debug === true) client.shard.send(`[DEBUG: ${functiondate()} - ${functiontime()}] Reply to a tweet, but reply option is off`)
                        } else {
                            if (debug === true) client.shard.send(`[DEBUG: ${functiondate()} - ${functiontime()}] Reply to a tweet`)
                            embed.setColor(`#${tweets[0].user.profile_sidebar_border_color}`)
                            embed.setAuthor(`${tweets[0].user.name} (@${tweets[0].user.screen_name})\nReply to @${tweets[0].in_reply_to_screen_name}`, tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"), `https://twitter.com/${tweets[0].user.screen_name}/status/${tweets[0].id_str}`)
                            embed.setDescription(tweets[0].text.replace(`@${tweets[0].in_reply_to_screen_name}`, ""))
                            embed.setTimestamp(tweets[0].created_at)
                            embed.setThumbnail('https://cdn1.iconfinder.com/data/icons/messaging-3/48/Reply-512.png')
                            if (tweets[0].entities.media) embed.setImage(tweets[0].entities.media[0].media_url_https)
                            if (client.channels.find(c=>c.id == config.channel_id)) client.channels.find(c=>c.id == config.channel_id).send(embed)
                        }
                    }
                }
                old_tweets = tweets[0].id
                }catch(e){
                    client.channels.get(config.channel_id).send(`https://twitter.com/${tweets[0].user.screen_name}/status/${tweets[0].id_str}`)
                    .catch(err=>client.shard.send(err))
                    old_tweets = tweets[0].id
                    if (debug === true) client.shard.send(`[ERROR: ${functiondate()} - ${functiontime()} - Shard ${client.shard.id + 1} - guild ${g.id} ] ` + e)
                    if (debug === true) client.shard.send(tweets[0])
                }
            }
            if (!old_tweets) {
                if (debug === true) client.shard.send(`[DEBUG: ${functiondate()} - ${functiontime()}] old_tweets not defined, setting var`)
                old_tweets = tweets[0].id
            }
         });
    }, 5000)
}
module.exports = twit