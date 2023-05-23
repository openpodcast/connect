import * as openpgp from 'openpgp'

class Crypto {
    passphrase: string

    constructor(passphrase: string) {
        this.passphrase = passphrase
    }

    async encryptValue(text: string): Promise<string | null> {
        const message = await openpgp.createMessage({ text })
        const encrypted = await openpgp.encrypt({
            message: message,
            passwords: [this.passphrase],
            format: 'binary',
        })
        // for await (const chunk of encrypted) {
        //     console.log('new chunk:', chunk) // Uint8Array
        // }
        // console.log(encrypted)
        const encryptedMessage = await openpgp.readMessage({
            binaryMessage: encrypted,
        })
        console.log(encryptedMessage.getText())

        // const data = encryptedMessage.getLiteralData()
        // console.log(data)
        return 'test'

        // const base64Encrypted = Buffer.from(
        //     encryptedMessage.packets.write()
        // ).toString('base64')

        // return base64Encrypted
    }
}

export default Crypto
