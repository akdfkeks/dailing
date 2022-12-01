module.exports = {
  apps: [
    {
      name: 'dailing',
      script: './dist/main',
      instances: 1,
      exec_mode: 'cluster',
      max_memory_restart: '200M',
      watch: ['src'],
      ignore_watch: ['node_modules', 'uploads'],
    },
  ],
};
