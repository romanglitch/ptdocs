module.exports = {
    apps: [{
        name: 'ptdocs-backend',
        script: './dist/main.js',
        instances: 2,
        exec_mode: 'cluster',
        env: {
            NODE_ENV: 'production',
        },
        error_file: './logs/err.log',
        out_file: './logs/out.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        max_memory_restart: '500M',
    }],
};