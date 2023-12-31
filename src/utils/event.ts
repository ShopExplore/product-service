// import axios from "axios";
import amqplib from "amqplib";

import appConfig from "../configs";

// export const publishCustomerEvent = async (payload: { [key: string]: any }) => {
//   const { data } = await axios.post("http://localhost:9001/v1/customer-event", {
//     payload,
//   });

//   return data;
// };

const { MESSAGE_BROKER_URL, EXCHANGE_NAME } = appConfig;

/*----------------- Message broker ------------------- */
//create channel
export const createChannel = async () => {
  try {
    console.log("creating channel from  product service......");
    const connection = await amqplib.connect(MESSAGE_BROKER_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, "direct");

    return channel;
  } catch (error) {
    throw error;
  }
};

//publish message
export const publishMessage = async (
  channel: amqplib.Channel,
  binding_key: string,
  message: string
) => {
  try {
    console.log("product service publish a message....");
    return channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
  } catch (error) {
    throw error;
  }
};

//subscribe channel
export const subscribeMessage = async (
  channel: amqplib.Channel,
  //   service,
  binding_key: string
) => {
  try {
    const appQueue = await channel.assertQueue("QUEUE_NAME");

    channel.bindQueue(appQueue.queue, EXCHANGE_NAME, binding_key);

    channel.consume(appQueue.queue, (data) => {
      console.log("product service subscribe some data..............");

      console.log(data.content.toString());
      channel.ack(data);
    });
  } catch (error) {
    throw error;
  }
};
