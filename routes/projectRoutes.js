const Project = require("../model/Project");
const router = require("express").Router();

router.post("/add", async (req, res) => {
	if (!req.body.projectTitle)
		return res.status(400).send("Missing project title");

	const project = new Project({
		projectTitle: req.body.projectTitle,
		description: req.body.description,
		userList: [req.body.currentUser],
	});
	try {
		const savedProject = await project.save();
		res.send(savedProject);
	} catch (err) {
		res.status(400).send(err);
		console.log(err);
	}
});

router.get("/get", async (req, res) => {
	//query param for the project id
	let projectid = req.query.projectid;
	const projectExist = await Project.findOne({ _id: projectid });
	if (!projectExist) return res.status(400).send("Project does not exist");

	res.send(projectExist);
});

router.put("/editproject", async (req, res) => {
	let savedProject = Project.findOne({ _id: req.body.projectid });
	savedProject.projectTitle = req.body.projectTitle;
	savedProject.projectDescription = req.body.projectDescription;
	await savedProject.save();
	res.send(savedProject);
});

router.post("/adduser", async (req, res) => {
	let workingProject = await Project.findOne({ _id: projectid });
	req.body.user.forEach((userid) => {
		workingProject.userList = workingProject.userList.push(userid);
	});
	await workingProject.save();
	res.send(workingProject);
});

module.exports = router;
