import Echo from 'laravel-echo';
import _ from 'lodash';
import Pusher from 'pusher-js';

if (typeof window !== 'undefined') {
    // @ts-ignore
    window.Pusher = Pusher;

    //window.Echo = Echo;
}
