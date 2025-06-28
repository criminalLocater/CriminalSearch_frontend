// Base URL
export const BASE_URL = "http://127.0.0.1:3000";

// Endpoints
export const endpoint = {
    auth: {
        registration: "api/user/register",
        login: "api/user/login",
        Profile: "api/user/edit",
        edit: "api/user/edit/:id",
        updateProfile: "api/user/update/",
        delete: "api/user/delete/",
        showall: "api/user/allUser",
        forgotPassword: "api/user/forgotpassword",
        updatePassword: "api/user/update-password/",
        changePassword: "api/user/change-password/",
    },
    criminal: {
        create: "api/criminals/create",
        showall: "api/criminals/list",
        edit: (id) => `/api/criminals/edit/${id}`,
        update: (id) => `/api/criminals/update/${id}`,
        delete: (id) => `/api/criminals/delete/${id}`,
        geo: "api/criminals/geo/nearby",
    },
    station: {
        create: "/api/station/create-station",
        showall: "/api/station/all-stations",
        edit: (id) => `/api/station/edit/${id}`,
        update: (id) => `/api/station/update/${id}`,
        delete: (id) => `/api/station/delete/${id}`,
    },
    contact:{
        create: "api/contact/create",
        showall: "api/contact/list",
        edit: "/api/contact/edit/",
        update: (id) => `/api/contact/update/${id}`,
        delete: "/api/contact/delete/",
    }
};
