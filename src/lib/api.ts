import { genSignEndPoint } from '@/app/utils'
import { cookies } from 'next/headers'
import queryString from 'query-string'

export const sendRequest = async <T>(props: IRequest) => {
  let { url, method, body, queryParams = {}, useCredentials = false, headers = {}, nextOption = {} } = props
  let options: any
  const cookie = await cookies()
  const { nonce, sign, stime, version } = genSignEndPoint()
  const id_user_guest = cookie.get('id_user_guest')?.value
  const id_user_number = cookie.get('id_user_number')?.value
  const access_token = cookie.get('access_token')?.value
  const refresh_token = cookie.get('refresh_token')?.value

  if (access_token && refresh_token) {
    options = {
      method: method,
      headers: new Headers({
        'content-type': 'application/json',
        // 'x-at-tk': `Bearer ${access_token}`,
        // 'x-rf-tk': `Bearer ${refresh_token}`,
        'x-cl-id': id_user_guest,
        nonce,
        sign,
        stime,
        version,
        ...headers
      }),
      body: body ? JSON.stringify(body) : null,
      ...nextOption
    }
  }

  if (!access_token && !access_token) {
    options = {
      method: method,
      headers: new Headers({
        'content-type': 'application/json',
        ...headers,
        'x-cl-id': id_user_guest,
        'id-user-number': id_user_number,
        nonce,
        sign,
        stime,
        version,
      }),
      body: body ? JSON.stringify(body) : null,
      ...nextOption
    }
  }

  if (useCredentials) options.credentials = 'include'

  if (queryParams) {
    url = `${url}?${buildQueryString(queryParams)}`
  }
  console.log("🚀 ~ returnfetch ~ url:", url)
  return fetch(url, options).then(async (res: any) => {
    if (res.ok) {
      return res.json() as T
    } else {
      return res.json().then(async function (json: any) {
        return {
          statusCode: res.status,
          message: json?.message ?? '',
          error: json?.error ?? '',
          code: json?.code ?? ''
        } as T
      })
    }
  })
}

export const sendRequestFile = async <T>(props: IRequest) => {
  let { url, method, body, queryParams = {}, useCredentials = false, headers = {}, nextOption = {} } = props

  const options: any = {
    method: method,
    headers: new Headers({ ...headers }),
    body: body ? body : null,
    ...nextOption
  }
  if (useCredentials) options.credentials = 'include'

  if (queryParams) {
    url = `${url}?${queryString.stringify(queryParams)}`
  }

  return fetch(url, options).then((res) => {
    if (res.ok) {
      return res.json() as T //generic
    } else {
      return res.json().then(function (json) {
        // to be able to access error status when you catch the error
        return {
          statusCode: res.status,
          message: json?.message ?? '',
          error: json?.error ?? '',
          code: json?.code ?? ''
        } as T
      })
    }
  })
}

const buildQueryString = (params: any) => {
  console.log("🚀 ~ buildQueryString ~ params:", params)
  const result: any = {}

  Object.keys(params).forEach((key) => {
    if (params[key] !== null && typeof params[key] === 'object' && !Array.isArray(params[key])) {
      // Xử lý đối tượng sâu
      Object.keys(params[key]).forEach((subKey: any) => {
        if (typeof params[key][subKey] === 'object') {
          // Xử lý đối tượng lồng vào trong
          Object.keys(params[key][subKey]).forEach((innerKey: any) => {
            result[`${key}[${subKey}][${innerKey}]`] = params[key][subKey][innerKey]
          })
        } else {
          result[`${key}[${subKey}]`] = params[key][subKey]
        }
      })
    } else {
      result[key] = params[key]
    }
  })

  return queryString.stringify(result)
}
