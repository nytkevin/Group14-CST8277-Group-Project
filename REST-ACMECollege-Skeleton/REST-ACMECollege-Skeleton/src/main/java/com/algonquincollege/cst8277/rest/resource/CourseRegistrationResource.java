package com.algonquincollege.cst8277.rest.resource;

import static com.algonquincollege.cst8277.utility.MyConstants.ADMIN_ROLE;
import static com.algonquincollege.cst8277.utility.MyConstants.COURSE_REGISTRATION_RESOURCE_NAME;
import static com.algonquincollege.cst8277.utility.MyConstants.USER_ROLE;

import com.algonquincollege.cst8277.ejb.ACMECollegeService;
import com.algonquincollege.cst8277.entity.CourseRegistration;
import com.algonquincollege.cst8277.entity.Professor;
import com.algonquincollege.cst8277.entity.SecurityUser;
import com.algonquincollege.cst8277.entity.Student;
import jakarta.annotation.security.RolesAllowed;
import jakarta.ejb.EJB;
import jakarta.inject.Inject;
import jakarta.security.enterprise.SecurityContext;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.glassfish.soteria.WrappingCallerPrincipal;

@Path(COURSE_REGISTRATION_RESOURCE_NAME)
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class CourseRegistrationResource {

    @SuppressWarnings("unused")
    private static final Logger LOG = LogManager.getLogger();

    @EJB
    protected ACMECollegeService service;

    @Inject
    protected SecurityContext sc;

    // GET all course registrations
    @GET
    @RolesAllowed({ ADMIN_ROLE })
    public Response getCourseRegistrations() {
        List<CourseRegistration> registrations =
            service.getAllCourseRegistrations();
        return Response.ok(registrations).build();
    }

    // GET registrations for the current user (USER_ROLE)
    @GET
    @Path("/my")
    @RolesAllowed({ USER_ROLE })
    public Response getMyRegistrations() {
        WrappingCallerPrincipal wCallerPrincipal =
            (WrappingCallerPrincipal) sc.getCallerPrincipal();
        SecurityUser sUser = (SecurityUser) wCallerPrincipal.getWrapped();
        Student student = sUser.getStudent();
        if (student != null) {
            List<CourseRegistration> myCRs = service.getRegistrationsForStudent(
                student.getId()
            );
            return Response.ok(myCRs).build();
        }
        return Response.ok(List.of()).build();
    }

    // GET all valid letter grades (from letter_grade table)
    @GET
    @Path("/lettergrade")
    @RolesAllowed({ ADMIN_ROLE, USER_ROLE })
    public Response getLetterGrades() {
        List<String> grades = service.getAllLetterGrades();
        return Response.ok(grades).build();
    }

    // GET all valid semesters (from semester table)
    @GET
    @Path("/semester")
    @RolesAllowed({ ADMIN_ROLE, USER_ROLE })
    public Response getSemesters() {
        List<String> semesters = service.getAllSemesters();
        return Response.ok(semesters).build();
    }

    // POST a new course registration (JSON body with nested student/course)
    @POST
    @RolesAllowed({ ADMIN_ROLE })
    public Response addCourseRegistration(CourseRegistration cr) {
        if (cr == null || cr.getStudent() == null || cr.getCourse() == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                           .entity("Registration failed: Missing valid student or course id in payload")
                           .build();
        }
        
        try {
            CourseRegistration newCR = service.persistCourseRegistration(cr);
            return Response.status(Response.Status.CREATED).entity(newCR).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                           .entity("Registration failed: " + e.getMessage())
                           .build();
        }
    }

    // PUT — Assign a professor to a course registration
    @PUT
    @Path("/student/{studentId}/course/{courseId}/professor")
    @Consumes(MediaType.APPLICATION_JSON)
    @RolesAllowed({ ADMIN_ROLE })
    public Response assignProfessor(
        @PathParam("studentId") int studentId,
        @PathParam("courseId") int courseId,
        Professor professor
    ) {
        CourseRegistration updated =
            service.assignProfessorToCourseRegistration(
                studentId,
                courseId,
                professor
            );
        if (updated == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity("Course registration not found")
                .build();
        }
        return Response.ok(updated).build();
    }

    // PUT — Assign a letter grade to a course registration
    @PUT
    @Path("/student/{studentId}/course/{courseId}/grade")
    @Consumes(MediaType.TEXT_PLAIN)
    @RolesAllowed({ ADMIN_ROLE })
    public Response assignGrade(
        @PathParam("studentId") int studentId,
        @PathParam("courseId") int courseId,
        String letterGrade
    ) {
        CourseRegistration updated = service.assignGradeToCourseRegistration(
            studentId,
            courseId,
            letterGrade
        );
        if (updated == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity("Course registration not found")
                .build();
        }
        return Response.ok(updated).build();
    }

    // DELETE — Remove a course registration
    @DELETE
    @Path("/student/{studentId}/course/{courseId}")
    @RolesAllowed({ ADMIN_ROLE })
    public Response deleteCourseRegistration(
        @PathParam("studentId") int studentId,
        @PathParam("courseId") int courseId
    ) {
        CourseRegistration deleted = service.deleteCourseRegistration(
            studentId,
            courseId
        );
        if (deleted == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity("Course registration not found")
                .build();
        }
        return Response.ok(deleted).build();
    }
}
