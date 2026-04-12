package com.algonquincollege.cst8277.rest;

import java.io.IOException;

import jakarta.annotation.Priority;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.container.PreMatching;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;

/**
 * Filter that appends Cross-Origin Resource Sharing (CORS) headers to every API response.
 * This prevents the browser from blocking requests made from a local dev server (e.g. React/Vue on localhost:3000).
 *
 * Also handles preflight OPTIONS requests by short-circuiting them with a 200 response
 * before any security or routing logic runs.
 */
@Provider
@PreMatching
@Priority(Priorities.AUTHENTICATION - 1)
public class CorsFilter implements ContainerRequestFilter, ContainerResponseFilter {

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        // If this is a preflight OPTIONS request, abort early with 200 + CORS headers.
        // This prevents security filters from rejecting the preflight.
        if ("OPTIONS".equalsIgnoreCase(requestContext.getMethod())) {
            requestContext.abortWith(
                Response.ok()
                    .header("Access-Control-Allow-Origin", "*")
                    .header("Access-Control-Allow-Credentials", "true")
                    .header("Access-Control-Allow-Headers", "origin, content-type, accept, authorization")
                    .header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD")
                    .header("Access-Control-Max-Age", "1209600")
                    .build()
            );
        }
    }

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) throws IOException {

        // Skip if CORS headers were already set (e.g. by the preflight OPTIONS handler above)
        if (responseContext.getHeaders().containsKey("Access-Control-Allow-Origin")) {
            return;
        }

        // Allow requests from any origin (e.g. http://localhost:3000, http://localhost:5173, etc)
        // For production, this should ideally be locked down to the specific frontend domain.
        responseContext.getHeaders().add("Access-Control-Allow-Origin", "*");

        // Allow credentials (like HTTP Basic Auth headers) to be passed across origins
        responseContext.getHeaders().add("Access-Control-Allow-Credentials", "true");

        // Specify which headers the frontend is allowed to send
        responseContext.getHeaders().add("Access-Control-Allow-Headers", "origin, content-type, accept, authorization");

        // Specify which HTTP methods are allowed
        responseContext.getHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
    }
}
