type AxiosResponse<DataType> = {
  data: DataType
}

interface AxiosError<DataType> extends Error {
  response: AxiosResponse<DataType>
}

type ResponseSuccess<DataType> = {
  status: 'success'
  data: DataType
}
type ResponseError = {
  status: 'error'
  message: string
}

function axiosInstance<DataType>(response: ResponseSuccess<DataType>) {
  return new Promise<AxiosResponse<ResponseSuccess<DataType>>>((resolve) => {
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
    const data = await promise
    return { data }
  } catch (err) {
    const axiosError = err as AxiosError<TError>
    return { error: axiosError.response }
  }
}
