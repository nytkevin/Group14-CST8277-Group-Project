package com.algonquincollege.cst8277.rest.resource;

import static com.algonquincollege.cst8277.utility.MyConstants.ADMIN_ROLE;
import static com.algonquincollege.cst8277.utility.MyConstants.USER_ROLE;
import static com.algonquincollege.cst8277.utility.MyConstants.PROFESSOR_RESOURCE_NAME;
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
import com.algonquincollege.cst8277.entity.Professor;
import com.algonquincollege.cst8277.entity.SecurityUser;
import com.algonquincollege.cst8277.entity.Student;

@Path(PROFESSOR_RESOURCE_NAME)
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ProfessorResource {

    private static final Logger LOG = LogManager.getLogger();

    @EJB
    protected ACMECollegeService service;

    @Inject
    protected SecurityContext sc;

    // Only a user with the SecurityRole ‘ADMIN_ROLE’ can get the list of all
    // professors.
    @GET
    @RolesAllowed({ ADMIN_ROLE })
    public Response getProfessors() {
        LOG.debug("retrieving all professors...");
        List<Professor> professors = service.getAllProfessors();
        return Response.ok(professors).build();
    }

    @GET
    @Path("/degree")
    @RolesAllowed({ ADMIN_ROLE, USER_ROLE })
    public Response getDegrees() {
        List<String> degrees = service.getAllDegrees();
        return Response.ok(degrees).build();
    }

    @GET
    @Path(RESOURCE_PATH_ID_PATH)
    @RolesAllowed({ ADMIN_ROLE, USER_ROLE })
    public Response getProfessorById(@PathParam(RESOURCE_PATH_ID_ELEMENT) int id) {
        LOG.debug("try to retrieve specific professor " + id);
        Response response = null;
        if (sc.isCallerInRole(ADMIN_ROLE)) {
            Professor professor = service.getProfessorById(id);
            response = Response.status(professor == null ? Status.NOT_FOUND : Status.OK)
                    .entity(professor).build();
        } else if (sc.isCallerInRole(USER_ROLE)) {
            WrappingCallerPrincipal wCallerPrincipal = (WrappingCallerPrincipal) sc.getCallerPrincipal();
            SecurityUser sUser = (SecurityUser) wCallerPrincipal.getWrapped();
            Student student = sUser.getStudent();
            if (student != null) {
                // Check if any of the user's course registrations reference this professor
                boolean hasProfessor = student.getCourseRegistrations().stream()
                        .anyMatch(cr -> cr.getProfessor() != null && cr.getProfessor().getId() == id);
                if (hasProfessor) {
                    Professor professor = service.getProfessorById(id);
                    response = Response.status(Status.OK).entity(professor).build();
                } else {
                    throw new ForbiddenException("User trying to access resource it does not own (wrong professorid)");
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
    public Response addProfessor(Professor professor) {
        Professor newProf = service.persistProfessor(professor);
        return Response.status(Response.Status.CREATED).entity(newProf).build();
    }

    @PUT
    @Path(RESOURCE_PATH_ID_PATH)
    @RolesAllowed({ ADMIN_ROLE })
    public Response updateProfessor(@PathParam(RESOURCE_PATH_ID_ELEMENT) int id, Professor profUpdates) {
        Professor updated = service.updateProfessorById(id, profUpdates);
        if (updated == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(updated).build();
    }

    @DELETE
    @Path(RESOURCE_PATH_ID_PATH)
    @RolesAllowed({ ADMIN_ROLE })
    public Response deleteProfessor(@PathParam(RESOURCE_PATH_ID_ELEMENT) int id) {
        Professor deleted = service.deleteProfessorById(id);
        if (deleted == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(deleted).build();
    }
}