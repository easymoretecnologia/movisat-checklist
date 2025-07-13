import { useStateType } from "@/types";
import { FilterProps } from "@/types/filter";
import { ChangeEvent } from "react";

export function onPage<Filter = FilterProps>(event: ChangeEvent<unknown>, page: number, setFilters: useStateType<Filter>): void {
  setFilters((prev: any) => ({ ...prev, page: page }));
}
