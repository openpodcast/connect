import openpgp from 'openpgp'

class AuthRepository {
    pool
    passphrase

    constructor(pool: any, passphrase: string) {
        this.pool = pool
        this.passphrase = passphrase
    }

    // encrypts a value using a GPG passphrase
    // and returns a base64 encoded string
    async encryptValue(text: string): Promise<string> {
        const message = await openpgp.createMessage({ text })
        const encrypted = await openpgp.encrypt({
            message: message,
            passwords: [this.passphrase],
            format: 'binary',
        })
        const encryptedMessage = await openpgp.readMessage({
            binaryMessage: encrypted,
        })
        const base64Encrypted = Buffer.from(
            encryptedMessage.packets.write()
        ).toString('base64')

        return base64Encrypted
    }

    // Session data is stored in the podcastConnectWaitlist table
    // All values are encrypted using GPG except for the connectType
    // which is 'anchor', 'spotify' etc.
    async storeSessionData(
        sessionData: Object,
        connectType: string
    ): Promise<any> {
        const sessionInsertStmt = `INSERT INTO podcastConnectWaitlist (
            env_name,
            env_value,
            value_encrypted,
            ) VALUES
            (?,?,?)`

        // Store the connectType in the database and get the session_id
        const session_id = await this.pool
            .query(sessionInsertStmt, ['connectType', connectType, false])
            .then((result: any) => {
                return result.insertId
            })

        const insertStmt = `INSERT INTO podcastConnectWaitlist (
            env_name,
            env_value,
            value_encrypted,
            session_id
            ) VALUES
            (?,?,?,?)`

        return await Promise.all(
            Object.entries(sessionData).map(
                async ([key, value]: [string, string]): Promise<any> => {
                    const encryptedValue = await this.encryptValue(value)
                    return await this.pool.query(insertStmt, [
                        key,
                        value,
                        encryptedValue,
                        session_id,
                    ])
                }
            )
        )
    }
}

export { AuthRepository }
