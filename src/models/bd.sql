CREATE TABLE departments (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE courses (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    level VARCHAR(255),
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE students (
    id INT PRIMARY KEY,
    cpf VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    birthday DATE,
    birth_place VARCHAR(255),
    nationality VARCHAR(255)
);

CREATE TABLE curriculums (
    id INT PRIMARY KEY,
    register VARCHAR(255),
    status VARCHAR(255),
    initial_period DATE,
    current_period DATE,
    ingress_form VARCHAR(255),
    course_acknowledgment VARCHAR(255),
    conclusion_deadline_period DATE,
    locks_number INT,
    extensions_number INT,
    leaving_date DATE,
    leaving_reason VARCHAR(255),
    graduation_date DATE,
    degree_certificate_expedition_date DATE,
    iec INT,
    iepi INT,
    iep INT,
    iepa INT,
    mpg INT,
    required_component_workload INT,
    fulfilled_component_workload INT,
    required_activity_workload INT,
    fulfilled_activity_workload INT,
    required_optative_workload INT,
    fulfilled_optative_workload INT,
    path VARCHAR(255),
    created_at TIMESTAMP,
    student_id INT,
    course_id INT,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE disciplines (
    id INT PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    workload INT NOT NULL
);

CREATE TABLE curricular_components (
    id INT PRIMARY KEY,
    period VARCHAR(255),
    type VARCHAR(255),
    class_number INT,
    frequency INT,
    grade INT,
    situation VARCHAR(255),
    discipline_id INT,
    curriculum_id INT,
    FOREIGN KEY (discipline_id) REFERENCES disciplines(id),
    FOREIGN KEY (curriculum_id) REFERENCES curriculums(id)
);

CREATE TABLE professors (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE curricular_components_professors (
    id INT PRIMARY KEY,
    curricular_component_id INT,
    professor_id INT,
    workload INT,
    FOREIGN KEY (curricular_component_id) REFERENCES curricular_components(id),
    FOREIGN KEY (professor_id) REFERENCES professors(id)
);

CREATE TABLE sisu_score (
    id INT PRIMARY KEY,
    score_average FLOAT,
    quota_type VARCHAR(255),
    classification VARCHAR(255),
    created_at TIMESTAMP,
    student_id INT,
    FOREIGN KEY (student_id) REFERENCES students(id)
);

CREATE TABLE process_errors (
    id INT PRIMARY KEY,
    pdf_name VARCHAR(255),
    error_type VARCHAR(255),
    error VARCHAR(255),
    created_at TIMESTAMP
);

CREATE TABLE pending_required_disciplines (
    id INT PRIMARY KEY,
    level VARCHAR(255),
    curriculum_id INT,
    discipline_id INT,
    FOREIGN KEY (curriculum_id) REFERENCES curriculums(id),
    FOREIGN KEY (discipline_id) REFERENCES disciplines(id)
);
