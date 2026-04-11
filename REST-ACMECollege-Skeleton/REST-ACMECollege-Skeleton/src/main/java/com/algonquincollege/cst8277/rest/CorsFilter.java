package com.algonquincollege.cst8277.rest;

import java.io.IOException;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.ext.Provider;

/**
 * Filter that appends Cross-Origin Resource Sharing (CORS) headers to every API response.
 * This prevents the browser from blocking requests made from a local dev server (e.g. React/Vue on localhost:3000).
 */
@Provider
public class CorsFilter implements ContainerResponseFilter {

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) throws IOException {
        
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
