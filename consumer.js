var axios = require('axios');
var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    Offset = kafka.Offset,
    Client = kafka.KafkaClient,
    topico = process.env.TOPICO,
    broker = process.env.HOST + ":" + process.env.PORTA,
    client = new Client({ kafaHost: broker });
    // ignorer certificado (proxy issues)
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    console.log("Servidor broker: " + broker);

    consumer = new Consumer(client,
        [{ topic: topico, partition: 0, offset: 'latest'}],
        { autoCommit: false, fromOffset: true }
    );


consumer.on('message', function (message) {
    console.log(message);
    postMSG_lida_para_o_slack(message.value)
});

consumer.on('error', function (err) {
    console.log('Error:',err);
})

consumer.on('offsetOutOfRange', function (topic) {
    // Codigo : https://github.com/SOHU-Co/kafka-node/blob/master/example/consumer.js
    topic.maxNum = 2;
    offset.fetch([topic], function (err, offsets) {
        if (err) {
            return console.error(err);
        }
    var min = Math.min.apply(null, offsets[topic.topic][topic.partition]);
    consumer.setOffset(topic.topic, topic.partition, min);
  });
});

function postMSG_lida_para_o_slack(msg){
    // format payload for slack
    var sdata = formatForSlack(msg)
    var url = 'https://hooks.slack.com/services/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'
    axios.post(url, sdata)
    .then((response) => {
      console.log('SUCCEEDED: Sent slack webhook: \n', response.data);
      //resolve(response.data);
    })
    .catch((error) => {
      console.log('FAILED: Send slack webhook', error);
      reject(new Error('FAILED: Send slack webhook'));
    });
}

function formatForSlack(msg){
  var payload ={
    "channel":'#async',
    "username":'app_mvinicius_v2_kafka_consumer',
    "text": msg,
    "icon_emoji":':taxi:'
  };
  // return json string of payload
  return JSON.stringify(payload)
}

