import { Client, BaseClientOptions } from 'https://denopkg.com/jdiamond/MQTT.ts/mod.ts';

export interface MQTTLoopbackMapping {
    route: string | RegExp;
    callback: MQTTLoopbackCallback
}

export interface MQTTLoopbackCallback { (payload: any): void };

export default class MQTTLoopback {

    instance: Client | null;
    mappings: MQTTLoopbackMapping[] = [];
    development: boolean = false;

    constructor(development: boolean, options: BaseClientOptions | null = null) {
        this.development = development;
        if (!development) {
            this.instance = new Client(options);
        } else {
            this.instance = null;
        }
    }

    async connect() {
        if (!this.development) {
            await this.instance?.connect();
            await this.instance?.subscribe('#');

            this.instance?.on('message', this.incommingMsg);
        }
    }

    async incommingMsg(topic: any, payload: any) {
        for (const endpoint of this.mappings) {
            if (topic.match(endpoint.route)) {
                endpoint.callback(payload);
            }
        }
    }

    async publish(topic: string, input: any) {
        if (!this.development) {
            this.instance?.publish(topic, input);
        } else {
            this.incommingMsg(topic, input);
        }
    }

    async subscribe(topic: string | RegExp, callback: (payload: any) => void) {
        this.mappings.push({
            route: topic,
            callback
        });
    }
}