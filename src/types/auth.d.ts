import type {
  QueryActionCreatorResult,
  QueryDefinition,
} from "@reduxjs/toolkit/query";
import type { IUser } from "./user";
import type { AxiosRequestConfig } from "axios";

export interface ISession {
  data?: IUser;
  isLoading: boolean;
  error?: any;
  refetch?: () => QueryActionCreatorResult<
    QueryDefinition<
      any,
      BaseQueryFn<
        {
          url: string;
          method?: AxiosRequestConfig["method"];
          data?: AxiosRequestConfig["data"];
          params?: AxiosRequestConfig["params"];
          headers?: AxiosRequestConfig["headers"];
        },
        unknown,
        unknown
      >,
      never,
      any,
      "api",
      any
    >
  >;
}
