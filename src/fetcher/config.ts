export type AxiosResponse<DataType> = {
  data: DataType
}

interface AxiosError<DataType> extends Error {
  response: AxiosResponse<DataType>
}

export type ResponseSuccess<DataType> = {
  status: 'success'
  data: DataType
}
export type ResponseError = {
  status: 'error'
  message: string
}

function axiosInstance<T>(response: ResponseSuccess<T>) {
  return new Promise<AxiosResponse<ResponseSuccess<T>>>((resolve) => {
    return setTimeout(() => {
      resolve({ data: response })
    }, 500)
  })
}

export default axiosInstance

/**
 * axios with try-catch wrapper.
 *
 * Example:
 * ```
 * const { data, error } = await tryTo(axios.get('/path'))
 * ```
 */
export async function tryTo<TSuccess, TError = ResponseError>(promise: Promise<AxiosResponse<TSuccess>>) {
  try {
    // 這邊拿到的會是 axios interceptors 處理過的值
    const data = await promise
    return { data }
  } catch (err) {
    const axiosError = err as AxiosError<TError>
    return { error: axiosError.response }
  }
}
