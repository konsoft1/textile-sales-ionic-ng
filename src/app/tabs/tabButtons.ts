export const tabButtons =
{
    '': [{
        'tab': 'login',
        'icon': 'lock-open',
        'label': 'Login',
    }],
    '/login': [{
        'tab': 'login',
        'icon': 'lock-open',
        'label': 'Login',
    }, {
        'tab': 'exit',
        'icon': 'log-out',
        'label': 'Exit App',
    }],
    '/logout': [{
        'tab': 'login',
        'icon': 'lock-open',
        'label': 'Login',
    }],
    '/dashboard': [{
        'tab': 'allorders',
        'icon': 'receipt',
        'label': 'All Orders',
    }, {
        'tab': 'logout',
        'icon': 'log-out',
        'label': 'Logout',
    }],
    '/backtoSales': [{
        'tab': 'allorders',
        'icon': 'receipt',
        'label': 'All Orders',
    }, {
        'tab': 'logout',
        'icon': 'log-out',
        'label': 'Logout',
    }],
    '/allorders': [{
        'tab': 'backtoSales',
        'icon': 'arrow-back',
        'label': 'Back',
    }, {
        'tab': 'details',
        'icon': 'apps',
        'label': 'Show Details',
    }],
    '/details': [{
        'tab': 'backtoOrders',
        'icon': 'arrow-back',
        'label': 'Back',
    }, {
        'tab': 'print',
        'icon': 'print',
        'label': 'Print',
    },],
    '/backtoOrders': [{
        'tab': 'backtoSales',
        'icon': 'arrow-back',
        'label': 'Back',
    }, {
        'tab': 'details',
        'icon': 'apps',
        'label': 'Show Details',
    }]
};