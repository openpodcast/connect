import * as openpgp from 'openpgp'

class Crypto {
    passphrase: string

    constructor(passphrase: string) {
        this.passphrase = passphrase
    }

    async decryptValue(text: string): Promise<string> {
        const message = await openpgp.readMessage({
            binaryMessage: Buffer.from(text, 'base64'),
        })
        const decrypted = await openpgp.decrypt({
            message: message,
            passwords: [this.passphrase],
        })
        return decrypted.data
    }

    async encryptValue(text: string): Promise<string> {
        const message = await openpgp.createMessage({ text })
        const encrypted = await openpgp.encrypt({
            message: message,
            passwords: [this.passphrase],
            format: 'binary',
        })

        const str = Buffer.from(encrypted).toString('base64')
        return str
    }
}

export default Crypto
