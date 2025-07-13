import { Status, setStatus } from "./status";

export type setData<T = any> = (data: T) => void;
export type setContext<T = any> = (data: T, status: Status) => void;
export type classType<T = any> = { update: setData<T>; status: Status; on: setStatus, set: setContext } & T;
