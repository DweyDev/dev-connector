import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Profile } from '.'
import { User } from '../user'
import { ERROR_MESSAGES } from '../../constants'

export const create = async (req, res, next) => {
  await Profile.findOne({})
  const {
    company,
    website,
    location,
    status,
    skills,
    bio,
    githubusername,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin,
    experience,
    education,
    social
  } = req.body

  // build profile objects
  const profileFileds = {}
  profileFileds.user = req.user.id
  if (company) profileFileds.company = company
  if (website) profileFileds.website = website
  if (location) profileFileds.location = location
  if (bio) profileFileds.bio = bio
  if (status) profileFileds.status = status
  if (githubusername) profileFileds.githubusername = githubusername
  if (skills) {
    profileFileds.skills = skills.split(',').map((skill) => skill.trim())
  }
  if (experience) {
    profileFileds.experience = experience
  }
  if (education) {
    profileFileds.education = education
  }

  profileFileds.social = {}
  if (youtube) profileFileds.social.youtube = youtube
  if (twitter) profileFileds.social.twitter = twitter
  if (facebook) profileFileds.social.facebook = facebook
  if (linkedin) profileFileds.social.linkedin = linkedin
  if (instagram) profileFileds.social.instagram = instagram

  try {
    let profile = await Profile.findOne({ user: req.user.id })

    if (profile) {
      // update, not create
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFileds },
        { new: true }
      )

      res.status(200).json({
        valid: true,
        profile
      })
      return null
    } else {
      // create
      profile = new Profile(profileFileds)

      await profile.save()
      res.status(201).json({
        valid: true,
        profile
      })
      return null
    }
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      valid: false,
      message: ERROR_MESSAGES.SOMETHING_WRONG
    })
  }
}

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Profile.find(query, select, cursor)
    .populate('user', ['name', 'avatar'])
    .then((profiles) => profiles.map((profile) => profile.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Profile.findById(params.id)
    .populate('user', ['name', 'picture'])
    .then(notFound(res))
    .then((profile) => (profile ? profile.view() : null))
    .then(success(res))
    .catch(next)

export const showMe = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'picture'])

    if (!profile) {
      res.status(400).json({
        valid: false,
        message: ERROR_MESSAGES.NO_PROFILE
      })
      return null
    } else {
      res.status(200).json({
        valid: true,
        profile
      })
      return null
    }
  } catch (error) {
    next(error)
  }
}

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Profile.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then((profile) => (profile ? Object.assign(profile, body).save() : null))
    .then((profile) => (profile ? profile.view(true) : null))
    .then(success(res))
    .catch(next)

export const destroy = async (req, res, next) => {
  try {
    // @todo: remove users posts
    await Profile.findOneAndRemove({ user: req.user.id })

    await User.findOneAndRemove({ _id: req.user.id })

    res.status(200).json({
      valid: true,
      message: 'profile and user deleted'
    })
  } catch (error) {
    next(error)
  }
}
