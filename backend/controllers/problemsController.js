const Problem = require('../model/Problem');

const getAllProblems = async (req, res) => {
    const problems = await Problem.find({}, '_id title difficulty tags codingScore');
    if (!problems) return res.status(204).json({ 'message': 'No problems found' });
    res.json(problems);
}

const deleteProblem = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'Problem ID required' });
    const problem = await Problem.findOne({ _id: req.params.id }).exec();
    if (!problem) {
        return res.status(204).json({ 'message': `Problem ID ${req.params.id} not found` });
    }
    const result = await Problem.deleteOne({ _id: req.params.id });
    res.json(result);
}

const getProblem = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'Problem ID required' });
    const problem = await Problem.findOne({ _id: req.params.id }).exec();
    if (!problem) {
        return res.status(204).json({ 'message': `Problem ID ${req.params.id} not found` });
    }
    res.json(problem);
}

module.exports = {
    getAllProblems,
    getProblem,
    deleteProblem
}