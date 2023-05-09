import axios from 'axios'
import { RawAxiosResponseHeaders, AxiosResponseHeaders } from 'axios'

class AnchorConnect {
    baseURL: string = 'https://podcasters.spotify.com/pod/api/'

    constructor() {}

    getSetCookie(
        headers: RawAxiosResponseHeaders | AxiosResponseHeaders,
        name: string
    ): string | undefined {
        const cookies = headers['set-cookie'] || undefined
        if (cookies !== undefined) {
            const matchingCookies = cookies
                .map((cookie: string) => {
                    const cookieString = cookie.split(';')[0]
                    const cookieName = cookieString.split('=')[0]
                    const cookieValue = cookieString.split('=')[1]
                    if (cookieName === name) {
                        return cookieValue
                    } else {
                        return undefined
                    }
                })
                .filter((cookie: string | undefined) => cookie !== undefined)
            return matchingCookies[0]
        }
        return undefined
    }

    async getSession(email: string, password: string): Promise<string> {
        // request crsf token from json body and anchorpw_S cookie from https://podcasters.spotify.com/pod/api/csrf
        const response = await axios.get(this.baseURL + 'csrf')
        const csrfToken = response.data.csrfToken || undefined
        const anchorpw_S = this.getSetCookie(response.headers, 'anchorpw_S')

        if (csrfToken === undefined || anchorpw_S === undefined) {
            throw new Error('Failed to get csrf token or anchorpw_S cookie')
        }

        // login using username, password, csrf token, and anchorpw_S cookie
        const loginResponse = await axios.post(
            this.baseURL + 'login',
            {
                email: email,
                password: password,
                _csrf: csrfToken,
            },
            {
                headers: {
                    Cookie: `anchorpw_S=${anchorpw_S}`,
                },
            }
        )
        // if return status code is 200, we can consider this cookie/session as logged in
        if (loginResponse.status === 200) {
            const cookie = this.getSetCookie(loginResponse.headers, 'anchor_S')
            if (cookie === undefined) {
                throw new Error('Failed to get cookie')
            }
            return cookie
        } else {
            throw new Error('Login failed')
        }
    }
}

export { AnchorConnect }
