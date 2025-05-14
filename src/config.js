const config = {
    API_URL: 'http://localhost:3001',
    API: {
        AUTH: {
            LOGIN: '/admin/login',
            REFRESH: '/admin/refresh',
            LOGOUT: '/admin/logout'
        },
        USERS: {
            LIST: '/admin/users',
            GET: (id) => `/admin/users/${id}`,
            UPDATE: (id) => `/admin/users/${id}`,
            DELETE: (id) => `/admin/users/${id}`,
            VERIFY: (id) => `/admin/users/${id}/verify`,
            REJECT: (id) => `/admin/users/${id}/reject`
        },
        REPORTS: {
            LIST: '/admin/reports',
            GET: (id) => `/admin/reports/${id}`,
            RESOLVE: (id) => `/admin/reports/${id}/resolve`,
            DELETE: (id) => `/admin/reports/${id}`
        },
        STATS: {
            OVERVIEW: '/admin/stats/overview',
            USERS: '/admin/stats/users',
            MATCHES: '/admin/stats/matches',
            REPORTS: '/admin/stats/reports'
        }
    },
    ROUTES: {
        LOGIN: '/login',
        DASHBOARD: '/dashboard',
        USERS: '/users',
        WALLETS: '/users/wallets',
        REPORTS: '/reports',
        STATS: '/stats',
        SETTINGS: '/settings',
        VERIFICATION: '/verification',
        BAN: '/ban'
    },
    STORAGE_KEYS: {
        TOKEN: 'admin_token',
        REFRESH_TOKEN: 'admin_refresh_token',
        USER: 'admin_user'
    },
    PAGINATION: {
        DEFAULT_PAGE_SIZE: 10,
        PAGE_SIZES: [10, 20, 50, 100]
    }
};

export default config; 