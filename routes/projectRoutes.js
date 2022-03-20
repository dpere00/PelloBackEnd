const Project = require('../model/Project');
const router = require('express').Router();

router.post('/add', async (req,res) => {


    if(!req.body.projectTitle) return res.status(400).send('Missing project title');


    const project = new Project({
        projectTitle: req.body.projectTitle,
        description: req.body.description,
        userList: [req.body.currentUser],       //FIX
    });
    try{
        const savedProject = await project.save();
        res.send(savedProject);
    }catch(err){
        res.status(400).send(err);
        console.log(err);
    }
});

module.exports = router;