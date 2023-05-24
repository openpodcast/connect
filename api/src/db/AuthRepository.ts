import { v4 as uuidv4 } from 'uuid'
import { default as Crypto } from '../Crypto'

class AuthRepository {
    pool
    crypto

    constructor(pool: any, crypto: Crypto) {
        this.pool = pool
        this.crypto = crypto
    }

    // Session data is stored in the podcastConnectWaitlist table
    // All values are encrypted using GPG except for the connectType
    // which is 'anchor', 'spotify' etc.
    async storeSessionData(
        sessionData: Object,
        connectType: string
    ): Promise<any> {
        const insertStmt = `INSERT INTO podcastConnectWaitlist (
            env_name,
            env_value,
            value_encrypted,
            session_id
            ) VALUES
            (?,?,?,?)`

        const sessionUUID = uuidv4() // Generates a new UUID

        return await Promise.all([
            this.pool.query(insertStmt, [
                'connectType',
                connectType,
                false,
                sessionUUID,
            ]),
            ...Object.entries(sessionData).map(
                async ([key, value]: [string, string]): Promise<any> => {
                    const encryptedValue = await this.crypto.encryptValue(value)
                    return await this.pool.query(insertStmt, [
                        key,
                        encryptedValue,
                        true,
                        sessionUUID,
                    ])
                }
            ),
        ])
    }
}

export { AuthRepository }
