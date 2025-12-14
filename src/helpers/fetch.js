/* eslint-disable no-debugger */
const baseUrl = import.meta.env.VITE_APP_API_URL;
const baseUrlAdmin = import.meta.env.VITE_APP_API_URL_ADMIN;


 export const fetchWithoutToken = ( endpoint, data, method = "GET" ) => {
    const url = `${ baseUrl }/${ endpoint }`
    if (method === "GET") {
        return fetch( url )
    } else {
        return fetch( url, {
            method,
            headers: {
                // ...corsHeaders,  
                'content-type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    }
}

 export const fetchWithToken = ( endpoint, data, method = "GET" ) => {
    const url = `${ baseUrl }/${ endpoint }`
    const token = localStorage.getItem('token') || '';

    if (method === "GET") {
        return fetch( url,  {
            method,
            headers: {
                // ...corsHeaders, 
                'x-token': token
            }
        })
    } else {
        return fetch( url, {
            method,
            headers: {
                // ...corsHeaders, 
                'content-type': 'application/json',
                'x-token': token
            },
            body: JSON.stringify(data)
        })
    }
}

export const fetchWithoutTokenAdmin = ( endpoint, data, method = "GET" ) => {
    const url = `${ baseUrlAdmin }/${ endpoint }`

    if (method === "GET") {
        return fetch( url )
    } else {
        return fetch( url, {
            method,
            headers: {
                // ...corsHeaders,  
                'content-type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    }
}

export const fetchWithTokenAdmin = ( endpoint, data, method = "GET" ) => {
    const url = `${ baseUrlAdmin }/${ endpoint }`
    const token = localStorage.getItem('token') || '';
    if (method === "GET") {
        return fetch( url,  {
            method,
            headers: {
                // ...corsHeaders, 
                'x-token': token
            }
        })
    } else {
        return fetch( url, {
            method,
            headers: {
                // ...corsHeaders, 
                'content-type': 'application/json',
                'x-token': token
            },
            body: JSON.stringify(data)
        })
    }
}

