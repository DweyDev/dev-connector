import { Profile } from '.'
import { User } from '../user'

let user, profile

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  profile = await Profile.create({ user, company: 'test', website: 'test', location: 'test', status: 'test', skills: 'test', bio: 'test', githubusername: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = profile.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(profile.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.company).toBe(profile.company)
    expect(view.website).toBe(profile.website)
    expect(view.location).toBe(profile.location)
    expect(view.status).toBe(profile.status)
    expect(view.skills).toBe(profile.skills)
    expect(view.bio).toBe(profile.bio)
    expect(view.githubusername).toBe(profile.githubusername)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = profile.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(profile.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.company).toBe(profile.company)
    expect(view.website).toBe(profile.website)
    expect(view.location).toBe(profile.location)
    expect(view.status).toBe(profile.status)
    expect(view.skills).toBe(profile.skills)
    expect(view.bio).toBe(profile.bio)
    expect(view.githubusername).toBe(profile.githubusername)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
