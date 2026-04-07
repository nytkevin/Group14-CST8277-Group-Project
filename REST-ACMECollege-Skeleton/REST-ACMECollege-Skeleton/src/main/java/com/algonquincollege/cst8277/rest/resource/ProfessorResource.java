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
import com.algonquincollege.cst8277.entity.Professor;

@Path("/professors")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ProfessorResource {

    private static final Logger LOG = LogManager.getLogger();

    @EJB
    protected ACMECollegeService service;

    //Only a user with the SecurityRole ‘ADMIN_ROLE’ can get the list of all professors.
    @GET
    @RolesAllowed({ADMIN_ROLE})
    public Response getProfessors() {
        LOG.debug("retrieving all professors...");
        List<Professor> professors = service.getAllProfessors();
        return Response.ok(professors).build();
    }

  
    @GET
    @Path("/{id}")
    @RolesAllowed({ADMIN_ROLE, USER_ROLE})
    public Response getProfessorById(@PathParam("id") int id) {
        Professor professor = service.getProfessorById(id);
        return Response.ok(professor).build();
    }

   
    @POST
    @RolesAllowed({ADMIN_ROLE})
    public Response addProfessor(Professor professor) {
        Professor newProf = service.persistProfessor(professor);
        return Response.ok(newProf).build();
    }

  
    @PUT
    @Path("/{id}")
    @RolesAllowed({ADMIN_ROLE})
    public Response updateProfessor(@PathParam("id") int id, Professor profUpdates) {
        Professor updated = service.updateProfessorById(id, profUpdates);
        return Response.ok(updated).build();
    }


    @DELETE
    @Path("/{id}")
    @RolesAllowed({ADMIN_ROLE})
    public Response deleteProfessor(@PathParam("id") int id) {
        Professor deleted = service.deleteProfessorById(id);
        return Response.ok(deleted).build();
    }
}