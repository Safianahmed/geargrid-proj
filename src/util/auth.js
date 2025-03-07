export const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/login';
};

export const getCurrentUser = () => {
    return {
        token: localStorage.getItem('token'),
        username: localStorage.getItem('username')
    };
};