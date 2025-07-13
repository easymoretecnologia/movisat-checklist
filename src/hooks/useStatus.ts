import { Status, setStatus } from "@/types/status";
import { useState } from "react";

export default (ini: Status): [Status, setStatus] => {
    const [status, setStatus] = useState<Status>(ini);

    return [status, (status: Status) => setStatus(status)];
}