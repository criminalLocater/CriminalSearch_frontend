
// Base URL
export const BASE_URL = "http://127.0.0.1:3000";

// Endpoints
export const endpoint = {
    auth : {
        registration : 'api/user/register',
        login : 'api/user/login',
        Profile : 'api/user/edit',
        edit : 'api/user/edit/:id',
        updateProfile : 'api/user/update/:id',
        delete: 'api/user/delete/:id',
        showall: 'api/user/allUser',
    },
    criminal:{
        create : 'api/criminals',
        showall : 'api/criminals',
        edit : 'api/criminals/:id',
        update : 'api/criminals/:id',
        delete : 'api/criminals/:id',
        geo: 'api/criminals/geo/nearby',
    },
    station:{
        create : 'api/station/create-station',
        showall : 'api/station/all-stations',
        edit : 'api/station/edit/:id',
        update : 'api/station/update/:id',
        delete : 'api/station/delete/:id',
    }
    
}
