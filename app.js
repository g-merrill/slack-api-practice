const messageJSONBody = require('./messageJSONBody.json');
const webhookJSON = require('./webhookJSON.json');
const axios = require('axios');
const dotenv = require('dotenv');

// access to workspace
  // need workspace credentials, including workspace URL, email address, password
// create slack app in workspace:
// in Oath & permissions, activate channel:read, chat:write as Bot Token Scopes
// reinstall app for workspace
// get app token
// using app token, get channel list
// get id's of specific channels for app to use for its post requests

// Upon webhook receipt:
// from webhook input, set channel for post request
// generate message body dynamically using webhook info
// using app token, do post request



dotenv.config();

async function getChannelData () {
  const results = await axios.get(`https://slack.com/api/conversations.list?types=private_channel&token=${process.env.SLACK_API_KEY}`);
  return results.data.channels;
}

async function sendMessage () {

  const channels = await getChannelData();
  let channelLookup = {};
  channels.forEach(channel => {
    if (channel.name === 'sales-uk' || channel.name === 'sales-eu' || channel.name === 'sales-us') {
      channelLookup[channel.name] = channel.id;
    }
  });

  let region = `sales-${webhookJSON.country.toLowerCase()}`;

  messageJSONBody['channel'] = channelLookup[region];
  messageJSONBody['text'] =  'hello0o0o0o0o0o';

  const response = await axios({
    method: 'post',
    url: 'https://slack.com/api/chat.postMessage',
    data: messageJSONBody,
    headers: {
      'Authorization': `Bearer ${process.env.SLACK_API_KEY}`,
      'Content-Type': 'application/json; charset=utf-8'
    },
  });
  console.log(response);
}

sendMessage();

