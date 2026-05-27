package com.example.student.controller;

import com.example.student.model.Student;
import com.example.student.repository.StudentRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/students")
public class StudentController {

    private final StudentRepository studentRepository;

    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @PostMapping
    public Student addStudent(@Valid @RequestBody Student student) {
        student.setGrade(calculateGrade(student.getMarks()));
        return studentRepository.save(student);
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable Long id) {
        return studentRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable Long id, @Valid @RequestBody Student newStudent) {
        Student student = studentRepository.findById(id).orElse(null);

        if (student != null) {
            student.setStudentName(newStudent.getStudentName());
            student.setSubjectName(newStudent.getSubjectName());
            student.setMarks(newStudent.getMarks());
            student.setGrade(calculateGrade(newStudent.getMarks()));

            return studentRepository.save(student);
        }

        return null;
    }

    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable Long id) {
        studentRepository.deleteById(id);
        return "Student deleted successfully";
    }

    private String calculateGrade(int marks) {
        if (marks >= 90) return "A+";
        else if (marks >= 80) return "A";
        else if (marks >= 70) return "B";
        else if (marks >= 60) return "C";
        else if (marks >= 40) return "D";
        else return "Fail";
    }
}