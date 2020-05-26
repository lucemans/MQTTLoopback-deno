import { Client } from 'https://denopkg.com/jdiamond/MQTT.ts/mod.ts';
import { BaseClientOptions } from 'https://raw.githubusercontent.com/jdiamond/MQTT.ts/master/client/base.ts';

export interface MQTTLoopbackMapping {
    route: string | RegExp;
    callback: MQTTLoopbackCallback
}

export interface MQTTLoopbackCallback { (topic: string, payload: any): void };

export class MQTTLoopback {

    instance: Client | null;
    mappings: MQTTLoopbackMapping[] = [];
    production: boolean = false;

    constructor(production: boolean, options: BaseClientOptions | undefined = undefined) {
        this.production = production;
        if (production) {
            this.instance = new Client(options);
        } else {
            this.instance = null;
        }
    }

    async connect() {
        if (this.production) {
            await this.instance?.connect();
            await this.instance?.subscribe('#');

            this.instance?.on('message', (topic: string, payload: any) => {
                this.incommingMsg(topic, payload)
            });
        }
    }

    private async incommingMsg(topic: string, payload: any) {
        for (const endpoint of this.mappings) {
            if (topic.match(endpoint.route)) {
                endpoint.callback(topic, payload);
            }
        }
    }

    async publish(topic: string, input: any) {
        if (this.production) {
            this.instance?.publish(topic, input);
        } else {
            this.incommingMsg(topic, input);
        }
    }

    async subscribe(topic: string | RegExp, callback: MQTTLoopbackCallback) {
        this.mappings.push({
            route: topic,
            callback
        });
    }
}