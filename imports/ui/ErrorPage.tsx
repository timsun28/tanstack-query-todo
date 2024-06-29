import React from "react";
import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

export const ErrorPage = () => {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        return (
            <div className="flex h-svh flex-col items-center justify-center">
                <h1 className="text-4xl">Sorry</h1>
                <h2>{error.status}</h2>
                <p>{error.statusText}</p>
                {error.data?.message && <p>{error.data.message}</p>}
                <Link className="text-blue-600 underline" to="/">
                    Return Home
                </Link>
            </div>
        );
    } else {
        return (
            <div className="flex h-svh flex-col items-center justify-center">
                <h1 className="text-4xl">Sorry</h1>
                <p>Unexpected error occured</p>
                <Link className="text-blue-600 underline" to="/">
                    Return Home
                </Link>
            </div>
        );
    }
};
