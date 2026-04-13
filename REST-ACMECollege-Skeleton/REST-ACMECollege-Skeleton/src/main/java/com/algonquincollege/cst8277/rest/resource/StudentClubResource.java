package com.algonquincollege.cst8277.rest.resource;

import static com.algonquincollege.cst8277.utility.MyConstants.ADMIN_ROLE;
import static com.algonquincollege.cst8277.utility.MyConstants.RESOURCE_PATH_ID_ELEMENT;
import static com.algonquincollege.cst8277.utility.MyConstants.RESOURCE_PATH_ID_PATH;
import static com.algonquincollege.cst8277.utility.MyConstants.STUDENT_CLUB_RESOURCE_NAME;
import static com.algonquincollege.cst8277.utility.MyConstants.USER_ROLE;

import com.algonquincollege.cst8277.ejb.ACMECollegeService;
import com.algonquincollege.cst8277.entity.Student;
import com.algonquincollege.cst8277.entity.StudentClub;
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

@Path(STUDENT_CLUB_RESOURCE_NAME)
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class StudentClubResource {

    @SuppressWarnings("unused")
    private static final Logger LOG = LogManager.getLogger();

    @EJB
    protected ACMECollegeService service;

    @Inject
    protected SecurityContext sc;

    @GET
    @RolesAllowed({ ADMIN_ROLE, USER_ROLE })
    public Response getClubs() {
        List<StudentClub> clubs = service.getAllClubs();
        return Response.ok(clubs).build();
    }

    @GET
    @Path(RESOURCE_PATH_ID_PATH)
    @RolesAllowed({ ADMIN_ROLE, USER_ROLE })
    public Response getClubById(@PathParam(RESOURCE_PATH_ID_ELEMENT) int id) {
        StudentClub club = service.getClubById(id);
        if (club == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(club).build();
    }

    @POST
    @RolesAllowed({ ADMIN_ROLE })
    public Response addClub(StudentClub club) {
        StudentClub newClub = service.persistClub(club);
        return Response.status(Response.Status.CREATED).entity(newClub).build();
    }

    @POST
    @Path("/{id}/member")
    @RolesAllowed({ ADMIN_ROLE })
    public Response addStudentToClub(
        @PathParam(RESOURCE_PATH_ID_ELEMENT) int clubId,
        Student student
    ) {
        if (student == null || student.getId() == 0) {
            return Response.status(Response.Status.BAD_REQUEST)
                           .entity("Registration failed: Missing valid student payload")
                           .build();
        }

        StudentClub updatedClub = service.addStudentToClub(
            clubId,
            student.getId()
        );

        if (updatedClub == null) {
            return Response.status(Response.Status.NOT_FOUND)
                           .entity("Club or student not found")
                           .build();
        }
        return Response.ok(updatedClub).build();
    }

    @PUT
    @Path(RESOURCE_PATH_ID_PATH)
    @RolesAllowed({ ADMIN_ROLE })
    public Response updateClub(
        @PathParam(RESOURCE_PATH_ID_ELEMENT) int id,
        StudentClub updates
    ) {
        StudentClub updated = service.updateClubById(id, updates);
        if (updated == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(updated).build();
    }

    @DELETE
    @Path(RESOURCE_PATH_ID_PATH)
    @RolesAllowed({ ADMIN_ROLE })
    public Response deleteClub(@PathParam(RESOURCE_PATH_ID_ELEMENT) int id) {
        StudentClub deleted = service.deleteClubById(id);
        if (deleted == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(deleted).build();
    }
}
