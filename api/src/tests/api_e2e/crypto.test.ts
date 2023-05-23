import Crypto from '../../crypto'

const passphrase = 'supersecret'
const original = 'testvalue'
const encrypted =
    'jA0EBwMCiwr1cCWJid//0j8B7rMbB+DT6lGsQpCerFKIeYNbe3YWcTKsvr+3fwAVwnJvxRbBAILR+9maT6rm56oC740ypydEHXQ7YVgyAIQ='

const crypto = new Crypto(passphrase)

test('encrypt value', async () => {
    const result = await crypto.encryptValue(original)
    expect(result).toBe(encrypted)
})

// describe('encryption tests', () => {
//     it('works if correct passphrase', async () => {
//         const result = await crypto.encryptValue(original)
//         expect(result).toBe(encrypted)
//         // const response = await request(baseURL)
//         //     .post('/api/anchor')
//         //     .send({ email: 'test', password: 'test' })
//         // expect(response.statusCode).toBe(403)
//         // expect(response.text).toContain('Invalid')
//     })
// })

// def test_encrypted_value(self):
//     self.assertEqual(decrypt_json(json_encrypted, passphrase), original)

// def test_wrong_passphrase(self):
//     self.assertNotEqual(decrypt_json(
//         json_encrypted, "wrongpassphrase"), original)

// def test_unecrypted_value_is_untouched(self):
//     json = '{"testkey": "testvalue"}'
//     self.assertEqual(decrypt_json(json, passphrase)
//                      ["testkey"], "testvalue")

// def test_unencrypted_url(self):
//     # apparently the url can be base64-encoded and the gpg fails without an error msg, just an empty string
//     json = '{"APPLE_AUTOMATION_ENDPOINT": "https://apple-automation.somedomain.com/endpoint"}'
//     self.assertEqual(decrypt_json(json, passphrase)
//                      ["APPLE_AUTOMATION_ENDPOINT"], "https://apple-automation.somedomain.com/endpoint")
