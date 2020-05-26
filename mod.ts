import { Client } from 'https://denopkg.com/jdiamond/MQTT.ts/mod.ts';
import { BaseClientOptions } from 'https://raw.githubusercontent.com/jdiamond/MQTT.ts/master/client/base.ts';

export interface MQTTLoopbackMapping {
    route: string | RegExp;
    callback: MQTTLoopbackCallback
}

export interface MQTTLoopbackCallback { (payload: any): void };

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

            this.instance?.on('message', this.incommingMsg);
        }
    }

    private async incommingMsg(topic: any, payload: any) {
        for (const endpoint of this.mappings) {
            if (topic.match(endpoint.route)) {
                endpoint.callback(payload);
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

    async subscribe(topic: string | RegExp, callback: (payload: any) => void) {
        this.mappings.push({
            route: topic,
            callback
        });
    }
}