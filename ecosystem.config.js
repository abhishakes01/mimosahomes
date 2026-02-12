module.exports = {
    apps: [
        {
            name: "backend",
            cwd: "./backend",
            script: "src/app.js",
            env: {
                NODE_ENV: "production",
                PORT: 5022,
            },
        },
        {
            name: "frontend",
            cwd: "./frontend",
            script: "npm",
            args: "start",
            env: {
                NODE_ENV: "production",
                PORT: 3707,
            },
        },
    ],
};
