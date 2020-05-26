# MQTTLoopback-deno
Microservices are cool, personally I had an issue with the sharing of data between microservices, pertaining to live data that we couldnt just put in a database and wait for a cache to expire. This library aims to ease the usage during testing/development.

## Why?
My aim with this was to provide a reliable way for microservices to communicate within the same microservice-type as such to stay updated on what is currently going on through MQTT yet still be able to provide a reliable system for in a development invoirnment.

## What can it do?
This deno library mittigates the need for an MQTT server on the development end and instead allows for very simple replacement api to be able to loopback.