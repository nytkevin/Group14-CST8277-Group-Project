package com.algonquincollege.cst8277.rest.resource;

import static com.algonquincollege.cst8277.utility.MyConstants.ADMIN_ROLE;
import static com.algonquincollege.cst8277.utility.MyConstants.USER_ROLE;
import static com.algonquincollege.cst8277.utility.MyConstants.COURSE_RESOURCE_NAME;
import static com.algonquincollege.cst8277.utility.MyConstants.RESOURCE_PATH_ID_ELEMENT;
import static com.algonquincollege.cst8277.utility.MyConstants.RESOURCE_PATH_ID_PATH;

import java.util.List;

import jakarta.annotation.security.RolesAllowed;
import jakarta.ejb.EJB;
import jakarta.inject.Inject;
import jakarta.security.enterprise.SecurityContext;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.glassfish.soteria.WrappingCallerPrincipal;

import com.algonquincollege.cst8277.ejb.ACMECollegeService;
import com.algonquincollege.cst8277.entity.Course;
import com.algonquincollege.cst8277.entity.SecurityUser;
import com.algonquincollege.cst8277.entity.Student;

@Path(COURSE_RESOURCE_NAME)
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class CourseResource {

    private static final Logger LOG = LogManager.getLogger();

    @EJB
    protected ACMECollegeService service;

    @Inject
    protected SecurityContext sc;

    @GET
    @RolesAllowed({ ADMIN_ROLE })
    public Response getCourses() {
        LOG.debug("retrieving all courses...");
        List<Course> courses = service.getAllCourses();
        return Response.ok(courses).build();
    }

    @GET
    @Path(RESOURCE_PATH_ID_PATH)
    @RolesAllowed({ ADMIN_ROLE, USER_ROLE })
    public Response getCourseById(@PathParam(RESOURCE_PATH_ID_ELEMENT) int id) {
        LOG.debug("try to retrieve specific course " + id);
        Response response = null;
        if (sc.isCallerInRole(ADMIN_ROLE)) {
            Course course = service.getCourseById(id);
            response = Response.status(course == null ? Status.NOT_FOUND : Status.OK)
                               .entity(course).build();
        } else if (sc.isCallerInRole(USER_ROLE)) {
            WrappingCallerPrincipal wCallerPrincipal = (WrappingCallerPrincipal) sc.getCallerPrincipal();
            SecurityUser sUser = (SecurityUser) wCallerPrincipal.getWrapped();
            Student student = sUser.getStudent();
            if (student != null) {
                // Check if student is registered in this course
                boolean enrolled = student.getCourseRegistrations().stream()
                    .anyMatch(cr -> cr.getCourse() != null && cr.getCourse().getId() == id);
                if (enrolled) {
                    Course course = service.getCourseById(id);
                    response = Response.status(Status.OK).entity(course).build();
                } else {
                    throw new ForbiddenException("User trying to access resource it does not own (wrong courseid)");
                }
            } else {
                throw new ForbiddenException("User trying to access resource it does not own (no linked student)");
            }
        } else {
            response = Response.status(Status.BAD_REQUEST).build();
        }
        return response;
    }

    @POST
    @RolesAllowed({ ADMIN_ROLE })
    public Response addCourse(Course course) {
        Course newCourse = service.persistCourse(course);
        return Response.status(Response.Status.CREATED).entity(newCourse).build();
    }

    @PUT
    @Path(RESOURCE_PATH_ID_PATH)
    @RolesAllowed({ ADMIN_ROLE })
    public Response updateCourse(@PathParam(RESOURCE_PATH_ID_ELEMENT) int id, Course updates) {
        Course updated = service.updateCourseById(id, updates);
        if (updated == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(updated).build();
    }

    @DELETE
    @Path(RESOURCE_PATH_ID_PATH)
    @RolesAllowed({ ADMIN_ROLE })
    public Response deleteCourse(@PathParam(RESOURCE_PATH_ID_ELEMENT) int id) {
        Course deleted = service.deleteCourseById(id);
        if (deleted == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(deleted).build();
    }
}