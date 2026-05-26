package com.example.student.model;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentName;
    private String subjectName;
    private int marks;

    public Student() {
    }

    public Student(Long id, String studentName, String subjectName, int marks) {
        this.id = id;
        this.studentName = studentName;
        this.subjectName = subjectName;
        this.marks = marks;
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
}