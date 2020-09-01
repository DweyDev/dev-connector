import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy, showMe } from './controller'
import { schema } from './model'
export Profile, { schema } from './model'

const router = new Router()
const {
  company,
  website,
  location,
  status,
  skills,
  bio,
  githubusername,
  experience,
  education,
  social
} = schema.tree

/**
 * @api {post} /profiles Create profile
 * @apiName CreateProfile
 * @apiGroup Profile
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam company Profile's company.
 * @apiParam website Profile's website.
 * @apiParam location Profile's location.
 * @apiParam status Profile's status.
 * @apiParam skills Profile's skills.
 * @apiParam bio Profile's bio.
 * @apiParam githubusername Profile's githubusername.
 * @apiSuccess {Object} profile Profile's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Profile not found.
 * @apiError 401 user access only.
 */
router.post('/', token({ required: true }), create)

/**
 * @api {get} /profiles Retrieve profiles
 * @apiName RetrieveProfiles
 * @apiGroup Profile
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} profiles List of profiles.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/', token({ required: true }), query(), index)

/**
 * @api {get} /profiles/me Retrieve my profile
 * @apiName RetrieveProfiles
 * @apiGroup Profile
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} profiles List of profiles.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/me', token({ required: true }), query(), showMe)

/**
 * @api {get} /profiles/:id Retrieve profile
 * @apiName RetrieveProfile
 * @apiGroup Profile
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} profile Profile's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Profile not found.
 * @apiError 401 user access only.
 */
router.get('/:id', token({ required: true }), show)

/**
 * @api {put} /profiles/:id Update profile
 * @apiName UpdateProfile
 * @apiGroup Profile
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam company Profile's company.
 * @apiParam website Profile's website.
 * @apiParam location Profile's location.
 * @apiParam status Profile's status.
 * @apiParam skills Profile's skills.
 * @apiParam bio Profile's bio.
 * @apiParam githubusername Profile's githubusername.
 * @apiSuccess {Object} profile Profile's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Profile not found.
 * @apiError 401 user access only.
 */
router.put(
  '/:id',
  token({ required: true }),
  body({ company, website, location, status, skills, bio, githubusername }),
  update
)

/**
 * @api {delete} /profiles/:id Delete profile
 * @apiName DeleteProfile
 * @apiGroup Profile
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Profile not found.
 * @apiError 401 user access only.
 */
router.delete('/:id', token({ required: true }), destroy)

export default router
