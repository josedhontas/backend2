import { Request, Response, NextFunction } from "express";
import { User, userModel } from "../models/users";
import { badRequest, internalServerError, notFound, ok } from "../services/error";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const secret = "secretteste1"

const registerUser = (req: Request, res: Response) => {
	const { name, email, password } = req.body
	if (!name)
		return badRequest(res, 'Nome invalido')
	if (!email)
		return badRequest(res, 'Email invalido')
	if (!password)
		return badRequest(res, 'Senha invalida')


	// const salt = await bcrypt.genSalt(10)
	const hashedPassword = bcrypt.hashSync(password, 10)

	return userModel.insertUser(name, email, hashedPassword)
		.then(user => {
			res.json(user)
		})
		.catch(err => internalServerError(res, err))
}


const loginUser = async (req: Request, res: Response) => {
	const { email, password } = req.body
	const user = await userModel.getUser(email)
	const isValidPassword = bcrypt.compareSync(password, user.password)
	if (user.email === email && isValidPassword) {
		const token = jwt.sign({ name: user.name }, secret, { expiresIn: "24h" })
		return res.status(200).json({
			message: 'Login successful',
			data: { token }
		})
	}
	else {
		return badRequest(res, "Email ou senha invalidos!")
	}
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	const tokenHeader = req.headers["authorization"]
	const token = tokenHeader && tokenHeader.split(" ")[1]

	next()
	/*
	if (!token) {
		return res.status(401).json({
			statusCode: 401,
			message: "Acesso negado!"
		})
	}

	try {
		jwt.verify(token, secret)
		next()
	} catch (error) {
		console.error(error)
		res.status(500).json({
			statusCode: 500,
			message: "Credencial invalida!"
		})
	}*/
}

export const userController = {
	registerUser,
	loginUser,
	verifyToken
}