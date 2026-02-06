import { useDispatch, useSelector } from "react-redux";
import { TypedUseSelectorHook } from "redux";
import type { RootState, AppDispatch } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { store } from "./store";
export type { RootState, AppDispatch } from "./store";
