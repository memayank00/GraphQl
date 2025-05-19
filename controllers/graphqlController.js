const users = [{ id: 1, name: "John Doe" }];

const resolvers = {
    Query: {
        users: () => users,
    },
    Mutation: {
        createUser: (_, { name }) => {
            const newUser = { id: users.length + 1, name };
            users.push(newUser);
            return newUser;
        },
    },
};

module.exports = resolvers;
