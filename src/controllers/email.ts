import { Request, Response } from "express";
import { emailModel } from "../models/email";
import { badRequest, internalServerError, notFound, ok} from "../services/error";

const listEmails = ({}: Request, res: Response) => {
  emailModel.listEmails()
    .then(emails => {
      res.json(emails)
    })
    .catch(err => internalServerError(res, err))
}

export const emailController = {
  listEmails
}