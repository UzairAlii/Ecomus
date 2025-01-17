import express from 'express'
import contactEmail from '../controllers/contactEmail.js'
import Authuser from "../middleware/Auth.js";

const ContactEmailRouter = express.Router()

ContactEmailRouter.post("/contactEmail", Authuser, contactEmail)

export default ContactEmailRouter