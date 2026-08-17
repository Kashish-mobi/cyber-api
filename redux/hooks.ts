import {
  useDispatch as reduxDispatch,
  useSelector as reduxSelector,
} from "react-redux";
import type { AppDispatch, RootState } from "./store";

export const useDispatch = () => reduxDispatch<AppDispatch>();

export const useSelector = <T,>(fn: (state: RootState) => T) =>
  reduxSelector(fn);
