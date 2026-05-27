package com.example.student.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Student name is required")
    private String studentName;

    @NotBlank(message = "Subject name is required")
    private String subjectName;

    @Min(value = 0, message = "Marks should not be less than 0")
    @Max(value = 100, message = "Marks should not be greater than 100")
    private int marks;

    private String grade;

    public Student() {
    }

    public Student(Long id, String studentName, String subjectName, int marks, String grade) {
        this.id = id;
        this.studentName = studentName;
        this.subjectName = subjectName;
        this.marks = marks;
        this.grade = grade;
    }

    public Long getId() {
        return id;
    }

    public String getStudentName() {
        return studentName;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public int getMarks() {
        return marks;
    }

    public String getGrade() {
        return grade;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public void setMarks(int marks) {
        this.marks = marks;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }
}