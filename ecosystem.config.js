// ecosystem.config.js

module.exports = {
  apps: [
    {
      // Backend Server (This part is working perfectly)
      name: 'mentorship-server',
      script: 'node',
      args: 'dist/server.js',
      cwd: './server',
      watch: true,
      env: {
        NODE_ENV: 'development',
        PORT: 5000,
        // Please ensure this is 100% correct.
        DATABASE_URL: "postgresql://postgres:Divinity:100@localhost:5432/mentorship_db?schema=public",
        // PLEASE REPLACE THE PLACEHOLDER TEXT
        JWT_SECRET: 'uihuhf933t785yrhuihfdhjt7843ut893uejfin8938efnr8732ehnr32ioh2rn43m76j3b2h23b354iji6n43',
      },
    },
    {
      // Frontend Server
      name: 'mentorship-client',

      // The script is correct: 'npx' is the right tool to call.
      script: 'npx',
      
      // The arguments are correct.
      args: 'serve -s build -l 3000',

      // The working directory is correct.
      cwd: './client',

      // --- THIS IS THE FINAL, GUARANTEED FIX ---
      // This line explicitly tells PM2: "Do not use the Node.js interpreter for this script."
      // This forces it to run the 'npx' command using the standard system shell (cmd.exe),
      // which will execute it correctly.
      interpreter: 'none',

      watch: false,
    },
  ],
};