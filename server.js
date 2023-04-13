const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const authRouter = require('./Router/auth')
const passRouter = require('./Router/passRouter')
const cookieParse = require('cookie-parser')

app.use(express.json());
app.use(cors())
app.use(cookieParse())

app.use('/auth/', authRouter)
app.use('/pass/', passRouter)

app.listen(process.env.PORT, async () => {
	try {
		await mongoose.connect(process.env.URI);
		console.log(`Server Running on PORT ${process.env.PORT}`)
	} catch (error) {
		console.log(error)
	}
})
