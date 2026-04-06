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
import com.algonquincollege.cst8277.entity.StudentClub;

@Path("/clubs")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class StudentClubResource {

    @SuppressWarnings("unused")
    private static final Logger LOG = LogManager.getLogger();

    @EJB
    protected ACMECollegeService service;

    //  ANY USER can view clubs
    @GET
    @RolesAllowed({ADMIN_ROLE, USER_ROLE})
    public Response getClubs() {
        List<StudentClub> clubs = service.getAllClubs();
        return Response.ok(clubs).build();
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({ADMIN_ROLE, USER_ROLE})
    public Response getClubById(@PathParam("id") int id) {
        StudentClub club = service.getClubById(id);
        return Response.ok(club).build();
    }

   
    @POST
    @RolesAllowed({ADMIN_ROLE})
    public Response addClub(StudentClub club) {
        StudentClub newClub = service.persistClub(club);
        return Response.ok(newClub).build();
    }

   
    @PUT
    @Path("/{id}")
    @RolesAllowed({ADMIN_ROLE})
    public Response updateClub(@PathParam("id") int id, StudentClub updates) {
        StudentClub updated = service.updateClubById(id, updates);
        return Response.ok(updated).build();
    }


    @DELETE
    @Path("/{id}")
    @RolesAllowed({ADMIN_ROLE})
    public Response deleteClub(@PathParam("id") int id) {
        StudentClub deleted = service.deleteClubById(id);
        return Response.ok(deleted).build();
    }
}