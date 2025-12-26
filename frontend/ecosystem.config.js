module.exports = {
    apps: [{
        name: 'ptdocs-frontend',
        script: 'node_modules/next/dist/bin/next',
        args: 'start -p 3001',
        // instances: 2,
        // exec_mode: 'cluster',
        watch: false,
        // max_memory_restart: '500M',
        env: {
            NODE_ENV: 'production'
        },
        error_file: './logs/err.log',
        out_file: './logs/out.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        merge_logs: true
    }]
};