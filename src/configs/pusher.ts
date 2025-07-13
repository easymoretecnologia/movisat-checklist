import { EchoOptions } from "laravel-echo"

export default {
    broadcaster: 'pusher',
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? '',
    wsHost: process.env.NEXT_PUBLIC_PUSHER_HOST ?? '127.0.0.1',
    wsPort: process.env.NEXT_PUBLIC_PUSHER_PORT ?? 6001,
    wssPort: process.env.NEXT_PUBLIC_PUSHER_PORT ?? 6001,
    forceTLS: process.env.NEXT_PUBLIC_PUSHER_TLS ?? false,
    encrypted: true,
    disableStats: true,
    enabledTransports: (process.env.NEXT_PUBLIC_PUSHER_SCHEME ?? 'http') === 'https' ? ['ws', 'wss', 'websocket', 'polling', 'flashsocket'] : ['ws', 'websocket', 'polling', 'flashsocket'],
    authEndpoint: `${process.env.NEXT_PUBLIC_RAW_API_URL}/broadcasting/auth`,
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER ?? 'mt1',
} as EchoOptions<'pusher'>
