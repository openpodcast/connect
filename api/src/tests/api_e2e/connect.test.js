const request = require('supertest')
const baseURL = 'http://localhost:8080'

describe('connect api', () => {
  it('fails if no payload is specified', async () => {
    const response = await request(baseURL).post('/connect/anchor')
    expect(response.statusCode).toBe(400)
    expect(response.text).toContain('Missing')
  })
  it('fails if email is specified but password is empty', async () => {
    const response = await request(baseURL).post('/connect/anchor').send({ email: 'test@test.com', password: '' })
    expect(response.statusCode).toBe(400)
    expect(response.text).toContain('Missing')
  })
  it('fails if no connector is specified', async () => {
    const response = await request(baseURL).post('/connect')
    expect(response.statusCode).toBe(404)
  })
  it('fails if random credentials are specified', async () => {
    const response = await request(baseURL).post('/connect/anchor').send({ email: 'test', password: 'test' })
    expect(response.statusCode).toBe(403)
    expect(response.text).toContain('Invalid')
  })
})