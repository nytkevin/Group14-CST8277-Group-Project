/********************************************************************************************************
 * File:  ACMECollegeService.java Course Materials CST 8277
 *
 * @author Teddy Yap
 * @author Shariar (Shawn) Emami
 * 
 */
package com.algonquincollege.cst8277.ejb;

import static com.algonquincollege.cst8277.entity.Student.ALL_STUDENTS_QUERY_NAME;
import com.algonquincollege.cst8277.entity.CourseRegistrationPK;
import static com.algonquincollege.cst8277.utility.MyConstants.DEFAULT_KEY_SIZE;
import static com.algonquincollege.cst8277.utility.MyConstants.DEFAULT_PROPERTY_ALGORITHM;
import static com.algonquincollege.cst8277.utility.MyConstants.DEFAULT_PROPERTY_ITERATIONS;
import static com.algonquincollege.cst8277.utility.MyConstants.DEFAULT_SALT_SIZE;
import static com.algonquincollege.cst8277.utility.MyConstants.DEFAULT_USER_PASSWORD;
import static com.algonquincollege.cst8277.utility.MyConstants.DEFAULT_USER_PREFIX;
import static com.algonquincollege.cst8277.utility.MyConstants.PARAM1;
import static com.algonquincollege.cst8277.utility.MyConstants.PROPERTY_ALGORITHM;
import static com.algonquincollege.cst8277.utility.MyConstants.PROPERTY_ITERATIONS;
import static com.algonquincollege.cst8277.utility.MyConstants.PROPERTY_KEY_SIZE;
import static com.algonquincollege.cst8277.utility.MyConstants.PROPERTY_SALT_SIZE;
import static com.algonquincollege.cst8277.utility.MyConstants.PU_NAME;
import static com.algonquincollege.cst8277.utility.MyConstants.USER_ROLE;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import jakarta.ejb.Singleton;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import jakarta.security.enterprise.identitystore.Pbkdf2PasswordHash;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;
import jakarta.persistence.NoResultException;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.algonquincollege.cst8277.entity.Course;
import com.algonquincollege.cst8277.entity.CourseRegistration;
import com.algonquincollege.cst8277.entity.Professor;
import com.algonquincollege.cst8277.entity.SecurityRole;
import com.algonquincollege.cst8277.entity.SecurityUser;
import com.algonquincollege.cst8277.entity.Student;
import com.algonquincollege.cst8277.entity.StudentClub;

@SuppressWarnings("unused")

/**
 * Stateless Singleton EJB Bean - ACMECollegeService
 */
@Singleton
public class ACMECollegeService implements Serializable {
    private static final long serialVersionUID = 1L;

    private static final Logger LOG = LogManager.getLogger();

    private static final String READ_ALL_PROGRAMS = "SELECT name FROM program";
    private static final String READ_ALL_DEGREES = "SELECT name FROM degree";
    // TODO ACMECS01 - Add your query constants here.

    @PersistenceContext(name = PU_NAME)
    protected EntityManager em;

    @Inject
    protected Pbkdf2PasswordHash pbAndjPasswordHash;

    public List<Student> getAllStudents() {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Student> cq = cb.createQuery(Student.class);
        cq.select(cq.from(Student.class));
        return em.createQuery(cq).getResultList();
    }

    public Student getStudentById(int id) {
        return em.find(Student.class, id);
    }

    @Transactional
    public Student persistStudent(Student newStudent) {
        em.persist(newStudent);
        return newStudent;
    }

    @Transactional
    public void buildUserForNewStudent(Student newStudent) {
        SecurityUser userForNewStudent = new SecurityUser();
        userForNewStudent.setUsername(
                DEFAULT_USER_PREFIX + "_" + newStudent.getFirstName() + "." + newStudent.getLastName());
        Map<String, String> pbAndjProperties = new HashMap<>();
        pbAndjProperties.put(PROPERTY_ALGORITHM, DEFAULT_PROPERTY_ALGORITHM);
        pbAndjProperties.put(PROPERTY_ITERATIONS, DEFAULT_PROPERTY_ITERATIONS);
        pbAndjProperties.put(PROPERTY_SALT_SIZE, DEFAULT_SALT_SIZE);
        pbAndjProperties.put(PROPERTY_KEY_SIZE, DEFAULT_KEY_SIZE);
        pbAndjPasswordHash.initialize(pbAndjProperties);
        String pwHash = pbAndjPasswordHash.generate(DEFAULT_USER_PASSWORD.toCharArray());
        userForNewStudent.setPwHash(pwHash);
        userForNewStudent.setStudent(newStudent);
        SecurityRole userRole = em.createNamedQuery(SecurityRole.SECURITY_ROLE_BY_NAME, SecurityRole.class)
                .setParameter("roleName", "USER_ROLE")
                .getSingleResult();

        userForNewStudent.getRoles().add(userRole);
        userRole.getUsers().add(userForNewStudent);
        em.persist(userForNewStudent);
    }

    /**
     * To update a student
     * 
     * @param id                 - id of entity to update
     * @param studentWithUpdates - entity with updated information
     * @return Entity with updated information
     */
    @Transactional
    public Student updateStudentById(int id, Student studentWithUpdates) {
        Student studentToBeUpdated = getStudentById(id);
        if (studentToBeUpdated != null) {
            em.refresh(studentToBeUpdated);
            studentToBeUpdated.setFirstName(studentWithUpdates.getFirstName());
            studentToBeUpdated.setLastName(studentWithUpdates.getLastName());
            studentToBeUpdated.setEmail(studentWithUpdates.getEmail());
            studentToBeUpdated.setPhone(studentWithUpdates.getPhone());
            studentToBeUpdated.setProgram(studentWithUpdates.getProgram());
            em.merge(studentToBeUpdated);
            em.flush();
        }
        return studentToBeUpdated;
    }

    /**
     * To delete a student by id
     * 
     * @param id - student id to delete
     */
    @Transactional
    public Student deleteStudentById(int id) {
        Student student = getStudentById(id);

        if (student != null) {
            em.refresh(student);

            TypedQuery<SecurityUser> findUser = em.createNamedQuery(
                    SecurityUser.SECURITY_USER_BY_STUDENT_ID, SecurityUser.class).setParameter("studentId", id);

            SecurityUser sUser = null;
            try {
                sUser = findUser.getSingleResult();
                for (SecurityRole role : sUser.getRoles()) {
                    role.getUsers().remove(sUser);
                }
                sUser.getRoles().clear();

                // Now safely remove the SecurityUser
                em.remove(sUser);

            } catch (NoResultException nre) {

            }

            em.remove(student);
        }

        return student;
    }

    @SuppressWarnings("unchecked")
    public List<String> getAllPrograms() {
        List<String> programs = new ArrayList<>();
        try {
            programs = (List<String>) em.createNativeQuery(READ_ALL_PROGRAMS).getResultList();
        } catch (Exception e) {
        }
        return programs;
    }

    // TODO ACMECS02 - Add the rest of your CRUD methods here.
    public List<Professor> getAllProfessors() {
        return em.createNamedQuery(Professor.ALL_PROFESSORS_QUERY, Professor.class).getResultList();
    }

    @SuppressWarnings("unchecked")
    public List<String> getAllDegrees() {
        List<String> degrees = new ArrayList<>();
        try {
            degrees = (List<String>) em.createNativeQuery(READ_ALL_DEGREES).getResultList();
        } catch (Exception e) {
        }
        return degrees;
    }

    public Professor getProfessorById(int id) {
        return em.find(Professor.class, id);
    }

    @Transactional
    public Professor persistProfessor(Professor professor) {
        em.persist(professor);
        return professor;
    }

    @Transactional
    public Professor updateProfessorById(int id, Professor updates) {
        Professor existing = em.find(Professor.class, id);
        if (existing == null) {
            return null;
        }

        existing.setFirstName(updates.getFirstName());
        existing.setLastName(updates.getLastName());
        existing.setDegree(updates.getDegree());

        return em.merge(existing);
    }

    @Transactional
    public Professor deleteProfessorById(int id) {
        Professor p = em.find(Professor.class, id);
        if (p == null) {
            return null;
        }
        for (CourseRegistration cr : p.getCourseRegistrations()) {
            cr.setProfessor(null);
            em.merge(cr);
        }
        em.remove(p);
        return p;
    }

    // -----------------------------------------------------------------------//
    public List<Course> getAllCourses() {
        return em.createNamedQuery(Course.ALL_COURSES_QUERY, Course.class).getResultList();
    }

    public Course getCourseById(int id) {
        return em.find(Course.class, id);
    }

    @Transactional
    public Course persistCourse(Course course) {
        em.persist(course);
        return course;
    }

    @Transactional
    public Course updateCourseById(int id, Course updates) {
        Course existing = em.find(Course.class, id);
        if (existing == null) {
            return null;
        }

        existing.setCourseCode(updates.getCourseCode());
        existing.setCourseTitle(updates.getCourseTitle());
        existing.setCreditUnits(updates.getCreditUnits());
        existing.setOnline(updates.getOnline());

        return em.merge(existing);
    }

    @Transactional
    public Course deleteCourseById(int id) {
        Course c = em.find(Course.class, id);
        if (c == null) {
            return null;
        }
        for (CourseRegistration cr : c.getCourseRegistrations()) {
            em.remove(cr);
        }
        em.remove(c);
        return c;
    }

    // -----------------------------------------------------------------------//
    public List<StudentClub> getAllClubs() {
        return em.createNamedQuery(StudentClub.ALL_STUDENT_CLUBS_QUERY, StudentClub.class).getResultList();
    }

    public StudentClub getClubById(int id) {
        return em.find(StudentClub.class, id);
    }

    @Transactional
    public StudentClub persistClub(StudentClub club) {
        em.persist(club);
        return club;
    }

    @Transactional
    public StudentClub updateClubById(int id, StudentClub updates) {
        StudentClub existing = em.find(StudentClub.class, id);
        if (existing == null) {
            return null;
        }
        existing.setName(updates.getName());
        existing.setDesc(updates.getDesc());
        existing.setAcademic(updates.getAcademic());
        return em.merge(existing);
    }

    @Transactional
    public StudentClub deleteClubById(int id) {
        StudentClub sc = em.find(StudentClub.class, id);
        if (sc == null) {
            return null;
        }
        sc.getStudentMembers().clear();
        em.remove(sc);
        return sc;
    }

    // -----------------------------------------------------------------------//

    public List<CourseRegistration> getAllCourseRegistrations() {
        return em.createNamedQuery(CourseRegistration.ALL_COURSE_REGISTRATIONS_QUERY_NAME, CourseRegistration.class)
                .getResultList();
    }

    public CourseRegistration getCourseRegistration(int studentId, int courseId) {
        CourseRegistrationPK pk = new CourseRegistrationPK(studentId, courseId);
        return em.find(CourseRegistration.class, pk);
    }

    public List<CourseRegistration> getRegistrationsForStudent(int studentId) {
        return em.createQuery(
                "SELECT cr FROM CourseRegistration cr WHERE cr.student.id = :studentId",
                CourseRegistration.class).setParameter("studentId", studentId).getResultList();
    }

    @Transactional
    public CourseRegistration persistCourseRegistration(CourseRegistration cr) {
        Student managedStudent = em.find(Student.class, cr.getStudent().getId());
        Course managedCourse = em.find(Course.class, cr.getCourse().getId());
        cr.setStudent(managedStudent);
        cr.setCourse(managedCourse);
        em.persist(cr);
        return cr;
    }

    @Transactional
    public CourseRegistration assignProfessorToCourseRegistration(int studentId, int courseId, Professor professor) {
        CourseRegistrationPK pk = new CourseRegistrationPK(studentId, courseId);
        CourseRegistration existing = em.find(CourseRegistration.class, pk);
        if (existing == null) {
            return null;
        }
        Professor managedProfessor = em.find(Professor.class, professor.getId());
        existing.setProfessor(managedProfessor);
        return em.merge(existing);
    }

    @Transactional
    public CourseRegistration assignGradeToCourseRegistration(int studentId, int courseId, String letterGrade) {
        CourseRegistrationPK pk = new CourseRegistrationPK(studentId, courseId);
        CourseRegistration existing = em.find(CourseRegistration.class, pk);
        if (existing == null) {
            return null;
        }
        existing.setLetterGrade(letterGrade);
        return em.merge(existing);
    }

    @Transactional
    public CourseRegistration deleteCourseRegistration(int studentId, int courseId) {
        CourseRegistrationPK pk = new CourseRegistrationPK(studentId, courseId);
        CourseRegistration cr = em.find(CourseRegistration.class, pk);
        if (cr == null) {
            return null;
        }
        em.remove(cr);
        return cr;
    }

    @SuppressWarnings("unchecked")
    public List<String> getAllLetterGrades() {
        return em.createNativeQuery("SELECT grade FROM letter_grade").getResultList();
    }
}