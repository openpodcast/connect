import axios from 'axios'
import { RawAxiosResponseHeaders, AxiosResponseHeaders } from 'axios'
import { AuthError } from '../types/api'
import setCookie from 'set-cookie-parser'

class AnchorConnect {
    baseURL: string = 'https://podcasters.spotify.com/pod/api/'
    logger: any

    constructor(logger: any) {
        this.logger = logger
    }

    async getSessionData(email: string, password: string): Promise<any> {
        // login first and get session cookie
        // then fetch web station id and return eveything in an object
        try {
            const sessionCookie = await this.getSession(email, password)
            const webStationId = await this.getWebStationId(sessionCookie)
            return {
                anchorpw_s: sessionCookie,
                webStationId: webStationId,
            }
        } catch (err) {
            this.logger.error(err)
            if (err instanceof AuthError && err.status) {
                throw err
            } else {
                throw new Error('Failed to get session data')
            }
        }
    }

    private getSetCookie(
        headers: RawAxiosResponseHeaders | AxiosResponseHeaders,
        name: string,
        path?: string
    ): string | undefined {
        const cookies = setCookie.parse(headers['set-cookie'] || [])
        const cookie = cookies.find(
            (cookie) =>
                cookie.name === name &&
                (path === undefined || cookie.path === path)
        )
        return cookie?.value
    }

    private async getSession(email: string, password: string): Promise<string> {
        // request crsf token from json body and anchorpw_S cookie from https://podcasters.spotify.com/pod/api/csrf
        const response = await axios.get(this.baseURL + 'csrf')
        const csrfToken = response.data.csrfToken || undefined
        const anchorpw_s = this.getSetCookie(
            response.headers,
            'anchorpw_s',
            '/'
        )

        if (csrfToken === undefined || anchorpw_s === undefined) {
            throw new Error('Failed to get csrf token or anchorpw_s cookie')
        }
        this.logger.debug(
            `Successfully got csrfToken: ${csrfToken} email ${email} password ${password} anchorpw_s ${anchorpw_s}`
        )
        // login using username, password, csrf token, and anchorpw_s cookie
        // send all three as json payload
        const loginResponse = await axios.post(
            this.baseURL + 'login',
            {
                email: email,
                password: password,
                _csrf: csrfToken,
            },
            {
                headers: {
                    Cookie: `anchorpw_s=${anchorpw_s}`,
                },
                // do not fail on errors
                validateStatus: (status) => true,
            }
        )
        // if return status code is 200, we can consider this cookie/session as logged in
        if (loginResponse.status === 200) {
            const cookie = this.getSetCookie(
                loginResponse.headers,
                'anchorpw_s'
            )
            if (cookie === undefined) {
                throw new Error('Failed to login and get session cookie')
            }
            return cookie
        } else if (loginResponse.status === 403) {
            const err = new AuthError('Invalid credentials while logging in')
            err.status = 403
            throw err
        } else {
            throw new Error(
                `Login failed with status code ${loginResponse.status} and message ${loginResponse.statusText}`
            )
        }
    }

    // fetch the web station id (=podcast id) from endpoint podcast/metadata
    private async getWebStationId(
        sessionCookie: string
    ): Promise<string | undefined> {
        const response = await axios.get(this.baseURL + 'podcast/metadata', {
            headers: {
                Cookie: `anchorpw_s=${sessionCookie}`,
            },
        })
        const webStationId = response.data.webStationId || undefined
        return webStationId
    }
}

export { AnchorConnect }
