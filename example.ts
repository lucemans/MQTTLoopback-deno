import { MQTTLoopback } from "https://raw.githubusercontent.com/lucemans/MQTTLoopback-deno/master/mod.ts";

console.log('hi');
const instance = new MQTTLoopback(true);
await instance.connect();
await instance.subscribe("luc/hello", (topic, payload) => {
    console.log('dropped ' + payload.toString());
});
await instance.publish("luc/hello", "hello luc!");
console.log('f');