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
import com.algonquincollege.cst8277.entity.CourseRegistrationPK;

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
    public Response getCourseRegistrationById(
        @PathParam("studentId") int studentId,
        @PathParam("courseId") int courseId) {
        CourseRegistrationPK pk = new CourseRegistrationPK(studentId, courseId);
        CourseRegistration cr = service.getCourseRegistrationById(pk);
        if (cr == null) return Response.status(Response.Status.NOT_FOUND).build();
        return Response.ok(cr).build();
    }

  
    @POST
    @RolesAllowed({ADMIN_ROLE})
    public Response addCourseRegistration(CourseRegistration cr) {
        CourseRegistration newCR = service.persistCourseRegistration(cr);
        return Response.ok(newCR).build();
    }
    
        @PUT
    @Path("/{studentId}/{courseId}")
    @RolesAllowed({ADMIN_ROLE})
    public Response updateCourseRegistration(
        @PathParam("studentId") int studentId,
        @PathParam("courseId") int courseId,
        CourseRegistration updates
    ) {
        CourseRegistrationPK pk = new CourseRegistrationPK(studentId, courseId);
        CourseRegistration updated = service.updateCourseRegistrationById(pk, updates);
        if (updated == null) return Response.status(Response.Status.NOT_FOUND).build();
        return Response.ok(updated).build();
    }


    @DELETE
    @Path("/{studentId}/{courseId}")
    @RolesAllowed({ADMIN_ROLE})
    public Response deleteCourseRegistration(
        @PathParam("studentId") int studentId,
        @PathParam("courseId") int courseId
    ) {
        CourseRegistrationPK pk = new CourseRegistrationPK(studentId, courseId);
        CourseRegistration deleted = service.deleteCourseRegistrationById(pk);
        if (deleted == null) return Response.status(Response.Status.NOT_FOUND).build();
        return Response.ok(deleted).build();
    }
}