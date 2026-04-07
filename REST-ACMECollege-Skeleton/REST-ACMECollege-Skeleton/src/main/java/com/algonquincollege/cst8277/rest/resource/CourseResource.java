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
import com.algonquincollege.cst8277.entity.Course;

@Path("/courses")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class CourseResource {

    @SuppressWarnings("unused")
    private static final Logger LOG = LogManager.getLogger();

    @EJB
    protected ACMECollegeService service;

   
    @GET
    @RolesAllowed({ADMIN_ROLE})
    public Response getCourses() {
        List<Course> courses = service.getAllCourses();
        return Response.ok(courses).build();
    }

   
    @GET
    @Path("/{id}")
    @RolesAllowed({ADMIN_ROLE, USER_ROLE})
    public Response getCourseById(@PathParam("id") int id) {
        Course course = service.getCourseById(id);
        return Response.ok(course).build();
    }


    @POST
    @RolesAllowed({ADMIN_ROLE})
    public Response addCourse(Course course) {
        Course newCourse = service.persistCourse(course);
        return Response.ok(newCourse).build();
    }


    @PUT
    @Path("/{id}")
    @RolesAllowed({ADMIN_ROLE})
    public Response updateCourse(@PathParam("id") int id, Course updates) {
        Course updated = service.updateCourseById(id, updates);
        return Response.ok(updated).build();
    }


    @DELETE
    @Path("/{id}")
    @RolesAllowed({ADMIN_ROLE})
    public Response deleteCourse(@PathParam("id") int id) {
        Course deleted = service.deleteCourseById(id);
        return Response.ok(deleted).build();
    }
}