/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */


import React from "react";
import TaskForm from "../taskform";


const Addtask = ({setActivePage}) => {


    return (

        <>
            <TaskForm 
                accessToken="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2ODY0NTIyNTksIm5iZiI6MTY4NjQ1MjI1OSwianRpIjoiNGVmNGMzZDktMmJkYS00NDg5LWIxZTgtYWM4NWI4NzBhN2Q2IiwiaWRlbnRpdHkiOnsibmFtZSI6IlNhcmF2YW5hbiBDIiwiZW1haWwiOiJzbWl0aHdpbGxzMTk4OUBnbWFpbC5jb20iLCJ1c2VyX2lkIjoidXNlcl84YzJmZjIxMjhlNzA0OTNmYTRjZWRkMmNhYjk3YzQ5MiIsImljb24iOiJodHRwOi8vd3d3LmdyYXZhdGFyLmNvbS9hdmF0YXIvY2Y5NGI3NGJkNDFiNDY2YmIxODViZDRkNjc0ZjAzMmI_ZGVmYXVsdD1odHRwcyUzQSUyRiUyRnMzLnNsb292aS5jb20lMkZhdmF0YXItZGVmYXVsdC1pY29uLnBuZyIsImJ5X2RlZmF1bHQiOiJvdXRyZWFjaCJ9LCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MifQ.-YW6d9QvX03DzyrbQGrVLd0uCXETRQ-HjykjpSkuZ5k"
                companyId="company_0f8d040401d14916bc2430480d7aa0f8"
                leadId="your-lead-id"
                setActivePage={setActivePage}
            />
        </>
    );
};
export default Addtask