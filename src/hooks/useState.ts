import { classType } from "@/types/state";
import { Status } from "@/types/status";
import React from "react";
import useStatus from "./useStatus";

export default function useClass<T = any>(ini: T, iniStatus: Status): classType<T> {
    const [data, setData] = React.useState<T>(ini);
    const [status, setStatus] = useStatus(iniStatus);

    return {
        update: (data: T) => setData(data),
        status: status,
        on: setStatus,
        set: (data: T, status: Status) => {
            setData(data);
            setStatus(status);
        },
        ...data,
    };
}
