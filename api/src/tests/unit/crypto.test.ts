import Crypto from '../../Crypto'

const passphrase = 'supersecret'
const original = 'testvalue'
const encrypted =
    'jA0EBwMCiwr1cCWJid//0j8B7rMbB+DT6lGsQpCerFKIeYNbe3YWcTKsvr+3fwAVwnJvxRbBAILR+9maT6rm56oC740ypydEHXQ7YVgyAIQ='

const crypto = new Crypto(passphrase)

test('encrypt value', async () => {
    const result = await crypto.encryptValue(original)
    expect(result).toBeTruthy()
    expect(result).not.toBe(original)

    const decrypted = await crypto.decryptValue(result)
    expect(decrypted).toBe(original)
})

test('decrypt value', async () => {
    const result = await crypto.decryptValue(encrypted)
    // as we might have some newlines in the encrypted string, we need to trim it
    expect(result?.trim()).toBe(original)
})

test('decrypt value with wrong passphrase throws an error', async () => {
    const wrongCrypto = new Crypto('wrongpassphrase')
    await expect(wrongCrypto.decryptValue(encrypted)).rejects.toThrow()
})

test('not valid string throws an error', async () => {
    await expect(crypto.decryptValue('notvalid')).rejects.toThrow()
})

test('weird string throws an error', async () => {
    await expect(
        // in the python lib this value was considered as a valid base64 string
        // so to be on the safe side, we check it in the node lib as well
        crypto.decryptValue('https://apple-automation.somedomain.com/endpoint')
    ).rejects.toThrow()
})
