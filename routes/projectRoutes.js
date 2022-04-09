const Project = require("../model/Project");
const Buckets = require("../model/Buckets");
const User = require("../model/User");
const router = require("express").Router();

router.post("/add", async (req, res) => {
	if (!req.body.projectTitle)
		return res.status(400).send("Missing project title");

	const project = new Project({
		projectTitle: req.body.projectTitle,
		description: req.body.description,
		userList: [req.body.currentUser], //id of the current user
		buckets: null,
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
	Project.findByIdAndUpdate(
		{ _id: req.body.projectid },
		{
			projectTitle: req.body.projectTitle,
			projectDescription: req.body.projectDescription,
		},
		function (err, result) {
			if (err) {
				res.send(err);
			} else {
				res.send(result);
			}
		}
	);
});

//Add user to a project
router.post("/adduser", async (req, res) => {
	let workingProject = await Project.findOne({ _id: req.body.projectid });
	//adds the user to the project's userList
	req.body.user.forEach(async (userid) => {
		const workingUser = await User.findOne({ _id: userid });
		if (!workingProject.userList.includes(userid)) {
			workingProject.userList.push(userid);
		}
		//push the userid to the project userList
		if (!workingUser.projects.includes(req.body.projectid)) {
			workingUser.projects.push(req.body.projectid);
			await workingUser.save();
		}
	});
	const savedProject = await workingProject.save();
	res.send(savedProject);
});

//Bucket functionality
router.post("/addbucket", async (req, res) => {
	let workingProject = await Project.findOne({ _id: req.body.projectid });
	const newBucket = new Buckets({
		name: req.body.bucketName,
	});
	//buckets start at null, check if no buckets exist
	if (workingProject.buckets == null) {
		workingProject.buckets = [newBucket];
	} else {
		workingProject.buckets.push(newBucket);
	}
	const savedProject = await workingProject.save();
	res.send(savedProject);
});

router.post("/addtask", async (req, res) => {
	let workingProject = await Project.findOne({ _id: req.body.projectid });
	console.log(workingProject.buckets[0].name);
	if (workingProject.buckets == null) {
		res.status(500).send("Bucket must be created first");
	}
	let bucketExists = false;
	let bucketIndex = 0;
	workingProject.buckets.forEach(async (bucket, index) => {
		if (bucket.name == req.body.bucket) {
			bucketIndex = index;
			bucketExists = true;
			const newTask = {
				title: req.body.taskTitle,
				usersAssgn: req.body.assignedUser,
				status: req.body.status,
			};
			workingProject.buckets[bucketIndex].tasks.push(newTask);
			const savedProject = await workingProject.save();
			res.send(savedProject);
		}
	});
	if (!bucketExists) {
		res.status(500).send("Bucket does not exist");
	}
});

module.exports = router;
