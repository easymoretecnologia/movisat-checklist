import { Icon } from "@iconify/react";
import { Button } from "@mui/material";
import Link from "next/link";
import { memo } from "react";

export default memo(({ to }: { to: string }) => (
    <Button color="primary" LinkComponent={Link} href={to}>
        <Icon icon='solar:arrow-left-linear' fontSize={20} className="!mr-2" />
        Voltar
    </Button>
))