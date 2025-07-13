import { Dispatch, SetStateAction } from 'react';
import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare module '*.jpg';
declare module '*.png';
declare module '*.jpeg';
declare module '*.webp';
declare module '*.avif';
declare module '*.gif';
declare module '*.json';
declare module '*.pdf';
declare module '*.mp3';
declare module '*.avi';
declare module '*.mp4';
declare module '*.wasm';
declare module '*.otf';
declare module '*.ttf';

declare global {
    interface Window {
        Pusher: Pusher;
        Echo: Echo;
    }
}

export type useStateType<T = any> = Dispatch<SetStateAction<T>>;