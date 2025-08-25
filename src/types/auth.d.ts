import type {
  QueryActionCreatorResult,
  QueryDefinition,
} from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig } from "axios";
import type { IUser } from ".";

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
