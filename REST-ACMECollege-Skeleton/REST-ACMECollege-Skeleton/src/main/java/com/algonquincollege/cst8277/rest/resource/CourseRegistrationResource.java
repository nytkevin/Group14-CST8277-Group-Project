package com.algonquincollege.cst8277.rest.resource;

import static com.algonquincollege.cst8277.utility.MyConstants.ADMIN_ROLE;
import static com.algonquincollege.cst8277.utility.MyConstants.USER_ROLE;

import java.util.List;

import jakarta.annotation.security.RolesAllowed;
import jakarta.ejb.EJB;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.algonquincollege.cst8277.ejb.ACMECollegeService;
import com.algonquincollege.cst8277.entity.CourseRegistration;

@Path("/courseregistrations")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class CourseRegistrationResource {

    @SuppressWarnings("unused")
    private static final Logger LOG = LogManager.getLogger();

    @EJB
    protected ACMECollegeService service;

    
    @GET
    @RolesAllowed({ADMIN_ROLE})
    public Response getCourseRegistrations() {
        List<CourseRegistration> registrations = service.getAllCourseRegistrations();
        return Response.ok(registrations).build();
    }

  
    @GET
    @Path("/{id}")
    @RolesAllowed({ADMIN_ROLE, USER_ROLE})
    public Response getCourseRegistrationById(@PathParam("id") int id) {
        CourseRegistration cr = service.getCourseRegistrationById(id);
        return Response.ok(cr).build();
    }

  
    @POST
    @RolesAllowed({ADMIN_ROLE})
    public Response addCourseRegistration(CourseRegistration cr) {
        CourseRegistration newCR = service.persistCourseRegistration(cr);
        return Response.ok(newCR).build();
    }
    @PUT
    @Path("/{id}")
    @RolesAllowed({ADMIN_ROLE})
    public Response updateCourseRegistration(@PathParam("id") int id, CourseRegistration updates) {
        CourseRegistration updated = service.updateCourseRegistrationById(id, updates);
        return Response.ok(updated).build();
    }


    @DELETE
    @Path("/{id}")
    @RolesAllowed({ADMIN_ROLE})
    public Response deleteCourseRegistration(@PathParam("id") int id) {
        CourseRegistration deleted = service.deleteCourseRegistrationById(id);
        return Response.ok(deleted).build();
    }
}