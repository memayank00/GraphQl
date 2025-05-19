class RestController {
    getUsers(req, res) {
        res.json({ users: [{ id: 1, name: "John Doe" }] });
    }

    createUser(req, res) {
        const { name } = req.body;
        res.status(201).json({ message: `User ${name} created successfully.` });
    }
}

module.exports = RestController;
