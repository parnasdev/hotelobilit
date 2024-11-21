import { Injectable } from '@angular/core';
import * as Pusher from 'pusher-js';
// import {Pusher} from 'pusher-js';

@Injectable({
  providedIn: 'root'
})
export class PusherService {
  // @ts-ignore
  private pusher: Pusher;

  constructor() {
    // @ts-ignore
    this.pusher = new Pusher('mytfuvbxlcrbqn0qeiq7', {
      cluster: '', // Optional if using custom host
      wsHost: 'socket.hotelobilit.com',
      secret: "b2gme0qq22rzosvvefbz",
      wsPort: 80, // WebSocket port (commonly used in custom setups)
      enabledTransports: ['ws'], // Specify allowed transports
      forceTLS: false,


    });
  }
  subscribeToChannel(channelName: string, eventName: string, callback: (data: any) => void) {
    const channel = this.pusher.subscribe(channelName);
    channel.bind(eventName, callback);
  }
}
