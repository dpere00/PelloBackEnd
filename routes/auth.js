const router = require("express").Router();
const User = require("../model/User");
const Validation = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
	const { error } = Validation.registerValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	//checking user already exists
	const emailExist = await User.findOne({ email: req.body.email });
	if (emailExist) return res.status(400).send("EMAIL EXISTS");

	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(req.body.password, salt);

	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: hashPassword,
	});
	try {
		const savedUser = await user.save();
		res.send(savedUser);
	} catch (err) {
		res.status(400).send(err);
		console.log(err);
	}
});

router.post("/login", async (req, res) => {
	const { error } = Validation.loginValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const user = await User.findOne({ email: req.body.email });
	if (!user) return res.status(400).send("EMAIL IS INCORRECT");

	const validPass = await bcrypt.compare(req.body.password, user.password);
	if (!validPass) return res.status(400).send("PASSWORD IS INCORRECT");

	//res.send('Logged in !!@!@!$#@$!%');

	//create/assign token
	const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
	res.header("auth-token", token).send(token);
});

module.exports = router;
