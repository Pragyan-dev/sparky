/**
 * Mock Data Service for Demo Presentation
 * Simulates API responses for empty shelf alerts and product metrics
 */

// Mock employees available for dispatch
export const mockEmployees = [
    { id: 1, name: 'John Smith', status: 'available' },
    { id: 2, name: 'Sarah Johnson', status: 'available' },
    { id: 3, name: 'Mike Davis', status: 'available' },
    { id: 4, name: 'Emily Brown', status: 'busy', assignedTo: 'Aisle 7' },
    { id: 5, name: 'Chris Wilson', status: 'available' },
];

// Mock empty shelf alerts
let mockAlerts = [
    {
        id: 1,
        aisle: 'Aisle 3',
        section: 'Dairy',
        product: 'Milk (Whole)',
        priority: 'high',
        timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
        reportedBy: 'Customer via App',
        status: 'pending',
    },
    {
        id: 2,
        aisle: 'Aisle 12',
        section: 'Snacks',
        product: 'Potato Chips',
        priority: 'medium',
        timestamp: new Date(Date.now() - 8 * 60000), // 8 minutes ago
        reportedBy: 'Store Associate',
        status: 'pending',
    },
];

// Mock popular products based on depletion rate
export const mockPopularProducts = [
    { product: 'Milk (Whole)', category: 'Dairy', depletionRate: 95, stockStatus: 'critical' },
    { product: 'Bread (White)', category: 'Bakery', depletionRate: 88, stockStatus: 'low' },
    { product: 'Potato Chips', category: 'Snacks', depletionRate: 82, stockStatus: 'low' },
    { product: 'Coca Cola', category: 'Beverages', depletionRate: 75, stockStatus: 'medium' },
    { product: 'Bananas', category: 'Produce', depletionRate: 70, stockStatus: 'medium' },
    { product: 'Chicken Breast', category: 'Meat', depletionRate: 65, stockStatus: 'good' },
];

// Counter for generating new alert IDs
let nextAlertId = 3;

/**
 * Get all current empty shelf alerts
 */
export const getEmptyShelfAlerts = () => {
    return [...mockAlerts].sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
};

/**
 * Get popular products data
 */
export const getPopularProducts = () => {
    return [...mockPopularProducts];
};

/**
 * Get available employees
 */
export const getEmployees = () => {
    return [...mockEmployees];
};

/**
 * Simulate adding a new empty shelf alert (for demo trigger)
 */
export const addEmptyShelfAlert = (alertData) => {
    const newAlert = {
        id: nextAlertId++,
        aisle: alertData.aisle || `Aisle ${Math.floor(Math.random() * 15) + 1}`,
        section: alertData.section || 'Unknown',
        product: alertData.product || 'Unknown Product',
        priority: alertData.priority || 'medium',
        timestamp: new Date(),
        reportedBy: alertData.reportedBy || 'Customer via App',
        status: 'pending',
    };

    mockAlerts.unshift(newAlert);
    return newAlert;
};

/**
 * Dispatch employee to handle an alert
 */
export const dispatchEmployee = (alertId, employeeId) => {
    const alert = mockAlerts.find(a => a.id === alertId);
    const employee = mockEmployees.find(e => e.id === employeeId);

    if (alert && employee) {
        alert.status = 'in-progress';
        alert.assignedTo = employee.name;
        employee.status = 'busy';
        employee.assignedTo = alert.aisle;

        return { success: true, alert, employee };
    }

    return { success: false };
};

/**
 * Mark alert as resolved
 */
export const resolveAlert = (alertId) => {
    const alertIndex = mockAlerts.findIndex(a => a.id === alertId);

    if (alertIndex !== -1) {
        const alert = mockAlerts[alertIndex];

        // Free up the employee
        if (alert.assignedTo) {
            const employee = mockEmployees.find(e => e.name === alert.assignedTo);
            if (employee) {
                employee.status = 'available';
                employee.assignedTo = null;
            }
        }

        // Remove the alert
        mockAlerts.splice(alertIndex, 1);
        return { success: true };
    }

    return { success: false };
};

/**
 * Get dashboard summary statistics
 */
export const getDashboardStats = () => {
    const totalAlerts = mockAlerts.length;
    const highPriorityAlerts = mockAlerts.filter(a => a.priority === 'high').length;
    const availableEmployees = mockEmployees.filter(e => e.status === 'available').length;
    const criticalProducts = mockPopularProducts.filter(p => p.stockStatus === 'critical').length;

    return {
        totalAlerts,
        highPriorityAlerts,
        availableEmployees,
        criticalProducts,
    };
};
