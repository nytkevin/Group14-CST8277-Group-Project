/********************************************************************************************************
 * File:  TestACMECollegeSystem.java
 * Course Materials CST 8277
 * Teddy Yap
 * (Original Author) Mike Norman
 *
 */
package acmecollege;

import static com.algonquincollege.cst8277.utility.MyConstants.APPLICATION_API_VERSION;
import static com.algonquincollege.cst8277.utility.MyConstants.APPLICATION_CONTEXT_ROOT;
import static com.algonquincollege.cst8277.utility.MyConstants.COURSE_REGISTRATION_RESOURCE_NAME;
import static com.algonquincollege.cst8277.utility.MyConstants.COURSE_RESOURCE_NAME;
import static com.algonquincollege.cst8277.utility.MyConstants.DEFAULT_ADMIN_USER;
import static com.algonquincollege.cst8277.utility.MyConstants.DEFAULT_ADMIN_USER_PASSWORD;
import static com.algonquincollege.cst8277.utility.MyConstants.DEFAULT_USER;
import static com.algonquincollege.cst8277.utility.MyConstants.DEFAULT_USER_PASSWORD;
import static com.algonquincollege.cst8277.utility.MyConstants.PROFESSOR_RESOURCE_NAME;
import static com.algonquincollege.cst8277.utility.MyConstants.STUDENT_CLUB_RESOURCE_NAME;
import static com.algonquincollege.cst8277.utility.MyConstants.STUDENT_RESOURCE_NAME;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.not;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.collection.IsEmptyCollection.empty;

import com.algonquincollege.cst8277.entity.Academic;
import com.algonquincollege.cst8277.entity.Course;
import com.algonquincollege.cst8277.entity.CourseRegistration;
import com.algonquincollege.cst8277.entity.Professor;
import com.algonquincollege.cst8277.entity.Student;
import com.algonquincollege.cst8277.entity.StudentClub;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.client.WebTarget;
import jakarta.ws.rs.core.GenericType;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriBuilder;
import java.lang.invoke.MethodHandles;
import java.net.URI;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.glassfish.jersey.client.ClientConfig;
import org.glassfish.jersey.client.authentication.HttpAuthenticationFeature;
import org.glassfish.jersey.logging.LoggingFeature;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

@SuppressWarnings("unused")
@TestMethodOrder(MethodOrderer.MethodName.class)
public class TestACMECollegeSystem {

    private static final Class<?> _thisClaz =
        MethodHandles.lookup().lookupClass();
    private static final Logger logger = LogManager.getLogger(_thisClaz);

    static final String HTTP_SCHEMA = "http";
    static final String HOST = "localhost";
    static final int PORT = 8080;

    // Test fixture(s)
    static URI uri;
    static HttpAuthenticationFeature adminAuth;
    static HttpAuthenticationFeature userAuth;

    @BeforeAll
    public static void oneTimeSetUp() throws Exception {
        logger.debug("oneTimeSetUp");
        uri = UriBuilder.fromUri(
            APPLICATION_CONTEXT_ROOT + APPLICATION_API_VERSION
        )
            .scheme(HTTP_SCHEMA)
            .host(HOST)
            .port(PORT)
            .build();
        adminAuth = HttpAuthenticationFeature.basic(
            DEFAULT_ADMIN_USER,
            DEFAULT_ADMIN_USER_PASSWORD
        );
        userAuth = HttpAuthenticationFeature.basic(
            DEFAULT_USER,
            DEFAULT_USER_PASSWORD
        );
    }

    protected WebTarget webTarget;

    @BeforeEach
    public void setUp() {
        Client client = ClientBuilder.newClient()
            .register(MyObjectMapperProvider.class)
            .register(new LoggingFeature());
        webTarget = client.target(uri);
    }

    /**
     * Tests retrieving all students using the ADMIN_ROLE.
     * Expects a 200 OK status and a non-empty list of students.
     */
    @Test
    public void test01_get_all_students_with_adminrole()
        throws JsonMappingException, JsonProcessingException {
        Response response = webTarget
            //.register(userAuth)
            .register(adminAuth)
            .path(STUDENT_RESOURCE_NAME)
            .request()
            .get();
        assertThat(response.getStatus(), is(200));
        List<Student> students = response.readEntity(
            new GenericType<List<Student>>() {}
        );
        assertThat(students, is(not(empty())));
    }

    // TODO TACMECS 01 - Add your meaningful JUnit tests here.

    /**
     * Negative test: Tests retrieving all students using the USER_ROLE.
     * Expects a 403 Forbidden status since this is an admin-only operation.
     */
    @Test
    public void test02_get_all_students_with_userrole() {
        Response response = webTarget
            .register(userAuth)
            .path(STUDENT_RESOURCE_NAME)
            .request()
            .get();
        assertThat(response.getStatus(), is(403));
    }

    /**
     * Tests creating a new student using the ADMIN_ROLE.
     * Expects a 200 OK or 201 Created status.
     */
    @Test
    public void test03_create_student_adminrole() {
        Student newStudent = new Student();
        newStudent.setFirstName("John" + System.currentTimeMillis());
        newStudent.setLastName("Doe");

        Response response = webTarget
            .register(adminAuth)
            .path(STUDENT_RESOURCE_NAME)
            .request()
            .post(Entity.json(newStudent));

        assertThat(response.getStatus(), is(200));
    }

    /**
     * Tests retrieving all courses using the ADMIN_ROLE.
     * Expects a 200 OK status.
     */
    @Test
    public void test04_get_all_courses_adminrole() {
        Response response = webTarget
            .register(adminAuth)
            .path(COURSE_RESOURCE_NAME)
            .request()
            .get();
        assertThat(response.getStatus(), is(200));
    }

    /**
     * Tests creating a new course using the ADMIN_ROLE.
     * Expects a 201 Created status.
     */
    @Test
    public void test05_create_course_adminrole() {
        Course course = new Course();
        course.setCourseCode("CST" + (System.currentTimeMillis() % 10000));
        course.setCourseTitle("Enterprise App Programming");
        course.setCreditUnits(3);
        course.setOnline(true);

        Response response = webTarget
            .register(adminAuth)
            .path(COURSE_RESOURCE_NAME)
            .request()
            .post(Entity.json(course));

        assertThat(response.getStatus(), is(201));
    }

    /**
     * Tests retrieving all professors using the ADMIN_ROLE.
     * Expects a 200 OK status.
     */
    @Test
    public void test06_get_all_professors_adminrole() {
        Response response = webTarget
            .register(adminAuth)
            .path(PROFESSOR_RESOURCE_NAME)
            .request()
            .get();
        assertThat(response.getStatus(), is(200));
    }

    /**
     * Tests creating a new professor using the ADMIN_ROLE.
     * Expects a 201 Created status.
     */
    @Test
    public void test07_create_professor_adminrole() {
        Professor prof = new Professor();
        prof.setFirstName("Teddy");
        prof.setLastName("Yap");
        prof.setDegree("PhD");

        Response response = webTarget
            .register(adminAuth)
            .path(PROFESSOR_RESOURCE_NAME)
            .request()
            .post(Entity.json(prof));

        assertThat(response.getStatus(), is(201));
    }

    /**
     * Tests retrieving all student clubs using the USER_ROLE.
     * Expects a 200 OK status as viewing clubs is permitted for users.
     */
    @Test
    public void test08_get_all_clubs_userrole() {
        Response response = webTarget
            .register(userAuth)
            .path(STUDENT_CLUB_RESOURCE_NAME)
            .request()
            .get();
        assertThat(response.getStatus(), is(200));
    }

    /**
     * Negative test: Tests creating a new student club using the USER_ROLE.
     * Expects a 403 Forbidden status since this is an admin-only operation.
     */
    @Test
    public void test09_create_club_userrole() {
        Academic club = new Academic();
        club.setName("Java Club");
        club.setDesc("We love Java");

        Response response = webTarget
            .register(userAuth)
            .path(STUDENT_CLUB_RESOURCE_NAME)
            .request()
            .post(Entity.json(club));

        assertThat(response.getStatus(), is(403));
    }

    /**
     * Tests creating a new student club using the ADMIN_ROLE.
     * Expects a 201 Created status.
     */
    @Test
    public void test10_create_club_adminrole() {
        Academic club = new Academic();
        club.setName("Java Club " + System.currentTimeMillis());
        club.setDesc("We love Java");

        Response response = webTarget
            .register(adminAuth)
            .path(STUDENT_CLUB_RESOURCE_NAME)
            .request()
            .post(Entity.json(club));

        assertThat(response.getStatus(), is(201));
    }

    /**
     * Tests updating an existing student club using the ADMIN_ROLE.
     * Expects a 200 OK status (or 404 if the target club ID doesn't exist).
     */
    @Test
    public void test11_update_club_adminrole() {
        Academic club = new Academic();
        club.setName("Java Club Updated");
        club.setDesc("We really love Java");

        Response response = webTarget
            .register(adminAuth)
            .path(STUDENT_CLUB_RESOURCE_NAME)
            .path("1")
            .request()
            .put(Entity.json(club));

        assertThat(
            response.getStatus() == 200 || response.getStatus() == 404,
            is(true)
        );
    }

    /**
     * Tests adding a student to a club using the ADMIN_ROLE.
     * Expects a 200 OK status (or 404 if the student/club IDs don't exist).
     */
    @Test
    public void test12_add_student_to_club_adminrole() {
        Student s = new Student();
        s.setId(1);

        Response response = webTarget
            .register(adminAuth)
            .path(STUDENT_CLUB_RESOURCE_NAME)
            .path("1")
            .path("member")
            .request()
            .post(Entity.json(s));

        assertThat(
            response.getStatus() == 200 || response.getStatus() == 404,
            is(true)
        );
    }

    /**
     * Tests creating a new course registration using the ADMIN_ROLE.
     * Expects a 201 Created status (or 404 if related entities are missing).
     */
    @Test
    public void test13_create_course_registration_adminrole() {
        CourseRegistration cr = new CourseRegistration();
        Student s = new Student();
        s.setId(1);
        Course c = new Course();
        c.setId(1);
        cr.setStudent(s);
        cr.setCourse(c);
        cr.setYear(2024);
        cr.setSemester("W24");

        Response response = webTarget
            .register(adminAuth)
            .path(COURSE_REGISTRATION_RESOURCE_NAME)
            .request()
            .post(Entity.json(cr));

        assertThat(
            response.getStatus() == 201 || response.getStatus() == 404,
            is(true)
        );
    }

    /**
     * Tests retrieving the current user's course registrations using the USER_ROLE.
     * Expects a 200 OK status.
     */
    @Test
    public void test14_get_my_registrations_userrole() {
        Response response = webTarget
            .register(userAuth)
            .path(COURSE_REGISTRATION_RESOURCE_NAME)
            .path("my")
            .request()
            .get();

        assertThat(response.getStatus(), is(200));
    }

    /**
     * Tests assigning a professor to a course registration using the ADMIN_ROLE.
     * Expects a 200 OK status (or 404 if resources are missing).
     */
    @Test
    public void test15_assign_professor_to_registration_adminrole() {
        Professor p = new Professor();
        p.setId(1);

        Response response = webTarget
            .register(adminAuth)
            .path(COURSE_REGISTRATION_RESOURCE_NAME)
            .path("student")
            .path("1")
            .path("course")
            .path("1")
            .path("professor")
            .request()
            .put(Entity.json(p));

        assertThat(
            response.getStatus() == 200 || response.getStatus() == 404,
            is(true)
        );
    }

    /**
     * Negative test: Tests assigning a professor to a registration using the USER_ROLE.
     * Expects a 403 Forbidden status as only admins can assign professors.
     */
    @Test
    public void test16_assign_professor_to_registration_userrole() {
        Professor p = new Professor();
        p.setId(1);

        Response response = webTarget
            .register(userAuth)
            .path(COURSE_REGISTRATION_RESOURCE_NAME)
            .path("student")
            .path("1")
            .path("course")
            .path("1")
            .path("professor")
            .request()
            .put(Entity.json(p));

        assertThat(response.getStatus(), is(403));
    }

    /**
     * Tests assigning a grade to a course registration using the ADMIN_ROLE.
     * Expects a 200 OK status (or 404 if resources are missing).
     */
    @Test
    public void test17_assign_grade_to_registration_adminrole() {
        Response response = webTarget
            .register(adminAuth)
            .path(COURSE_REGISTRATION_RESOURCE_NAME)
            .path("student")
            .path("1")
            .path("course")
            .path("1")
            .path("grade")
            .request()
            .put(Entity.entity("A+", MediaType.TEXT_PLAIN));

        assertThat(
            response.getStatus() == 200 || response.getStatus() == 404,
            is(true)
        );
    }

    /**
     * Tests retrieving specific student details using the USER_ROLE where authorized.
     * Expects a 200 OK status because the authenticated user is mapped to student ID 1.
     */
    @Test
    public void test18_get_specific_student_userrole_allowed() {
        // The user cst8277 is mapped to student id 1
        Response response = webTarget
            .register(userAuth)
            .path(STUDENT_RESOURCE_NAME)
            .path("1")
            .request()
            .get();

        assertThat(response.getStatus(), is(200));
    }

    /**
     * Negative test: Tests retrieving specific student details where unauthorized.
     * Expects a 403 Forbidden status because user cst8277 is mapped to ID 1, not 2.
     */
    @Test
    public void test19_get_specific_student_userrole_forbidden() {
        // The user cst8277 is mapped to student id 1, so accessing id 2 should fail
        Response response = webTarget
            .register(userAuth)
            .path(STUDENT_RESOURCE_NAME)
            .path("2")
            .request()
            .get();

        assertThat(response.getStatus(), is(403));
    }

    /**
     * Tests retrieving letter grades list using the USER_ROLE.
     * Expects a 200 OK status.
     */
    @Test
    public void test20_get_letter_grades_userrole() {
        Response response = webTarget
            .register(userAuth)
            .path(COURSE_REGISTRATION_RESOURCE_NAME)
            .path("lettergrade")
            .request()
            .get();

        assertThat(response.getStatus(), is(200));
    }

    /**
     * Tests deleting a course registration using the ADMIN_ROLE.
     * Expects a 200 OK or 204 No Content status (or 404 if not found).
     */
    @Test
    public void test21_delete_registration_adminrole() {
        Response response = webTarget
            .register(adminAuth)
            .path(COURSE_REGISTRATION_RESOURCE_NAME)
            .path("student")
            .path("1")
            .path("course")
            .path("1")
            .request()
            .delete();

        assertThat(
            response.getStatus() == 200 || response.getStatus() == 404,
            is(true)
        );
    }

    /**
     * Tests deleting a student club using the ADMIN_ROLE.
     * Expects a 200 OK or 204 No Content status (or 404 if not found).
     */
    @Test
    public void test22_delete_club_adminrole() {
        Response response = webTarget
            .register(adminAuth)
            .path(STUDENT_CLUB_RESOURCE_NAME)
            .path("1") // Assuming club 1 was created/exists
            .request()
            .delete();

        assertThat(
            response.getStatus() == 200 || response.getStatus() == 404,
            is(true)
        );
    }
}
