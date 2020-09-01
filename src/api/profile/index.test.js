import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Profile } from '.'

const app = () => express(apiRoot, routes)

let userSession, anotherSession, profile

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  profile = await Profile.create({ user })
})

test('POST /profiles 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, company: 'test', website: 'test', location: 'test', status: 'test', skills: 'test', bio: 'test', githubusername: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.company).toEqual('test')
  expect(body.website).toEqual('test')
  expect(body.location).toEqual('test')
  expect(body.status).toEqual('test')
  expect(body.skills).toEqual('test')
  expect(body.bio).toEqual('test')
  expect(body.githubusername).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('POST /profiles 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /profiles 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(typeof body[0].user).toEqual('object')
})

test('GET /profiles 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /profiles/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${profile.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(profile.id)
  expect(typeof body.user).toEqual('object')
})

test('GET /profiles/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${profile.id}`)
  expect(status).toBe(401)
})

test('GET /profiles/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /profiles/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${profile.id}`)
    .send({ access_token: userSession, company: 'test', website: 'test', location: 'test', status: 'test', skills: 'test', bio: 'test', githubusername: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(profile.id)
  expect(body.company).toEqual('test')
  expect(body.website).toEqual('test')
  expect(body.location).toEqual('test')
  expect(body.status).toEqual('test')
  expect(body.skills).toEqual('test')
  expect(body.bio).toEqual('test')
  expect(body.githubusername).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('PUT /profiles/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${profile.id}`)
    .send({ access_token: anotherSession, company: 'test', website: 'test', location: 'test', status: 'test', skills: 'test', bio: 'test', githubusername: 'test' })
  expect(status).toBe(401)
})

test('PUT /profiles/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${profile.id}`)
  expect(status).toBe(401)
})

test('PUT /profiles/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: anotherSession, company: 'test', website: 'test', location: 'test', status: 'test', skills: 'test', bio: 'test', githubusername: 'test' })
  expect(status).toBe(404)
})

test('DELETE /profiles/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${profile.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /profiles/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${profile.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /profiles/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${profile.id}`)
  expect(status).toBe(401)
})

test('DELETE /profiles/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
