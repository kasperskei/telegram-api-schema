export interface TgUserApiRequestResponseSuccess<Data = unknown> {
  success: true
  data: Data
  error: undefined
}

export interface TgUserApiRequestResponseError {
  success: false
  data: undefined
  error: unknown
}

export type TgUserApiRequestResponse<Data = unknown> = TgUserApiRequestResponseSuccess<Data> | TgUserApiRequestResponseError

export interface TgUserApiRequest {
  (method: string, params: unknown, ...args: unknown[]): Promise<unknown>
}

export interface TgUserApiDependencies {
  request: TgUserApiRequest
}

export const tgUserApiRequest = (dependencies: TgUserApiDependencies) => async <Data = unknown>(method: string, params: unknown, ...args: unknown[]): Promise<TgUserApiRequestResponse<Data>> => dependencies.request(method, params, ...args)
  .then((data: unknown) => ({
    success: true,
    data,
    error: undefined,
  } as TgUserApiRequestResponseSuccess<Data>))
  .catch((error) => {
    error.message = `tgUserApiRequest: ${error.message} ${JSON.stringify(params)}`

    return {
      success: false,
      data: undefined,
      error,
    }
  })
