CREATE TABLE tblUsers (
    userId INT PRIMARY KEY IDENTITY(1,1),
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    photo VARCHAR(255),  
    parent_invite_code VARCHAR(255),
    teacher_invite_code VARCHAR(255),
    role VARCHAR(50) NOT NULL,
	createdAt DATETIME DEFAULT GETDATE(),
	isDeleted BIT DEFAULT 0
);

CREATE TABLE tblSchools (
    schoolId INT PRIMARY KEY IDENTITY(1,1),
    uniqueCode Varchar(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    photo VARCHAR(255),
	createdAt DATETIME DEFAULT GETDATE(),
	isDeleted BIT DEFAULT 0
);

CREATE TABLE tblUserSchools (
    userSchoolId INT PRIMARY KEY IDENTITY(1,1),
    userId INT,
    schoolId INT,
    role VARCHAR(50) NOT NULL,
    FOREIGN KEY (userId) REFERENCES tblUsers(userId),
    FOREIGN KEY (schoolId) REFERENCES tblSchools(schoolId),
	createdAt DATETIME DEFAULT GETDATE(),
	isDeleted BIT DEFAULT 0
);

CREATE TABLE tblClasses (
    classId INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(255) NOT NULL,
    schoolId INT,
    FOREIGN KEY (schoolId) REFERENCES tblSchools(schoolId),
	  createdAt DATETIME DEFAULT GETDATE(),
	  isDeleted BIT DEFAULT 0
);


CREATE TABLE tblStudents (
    studentId INT PRIMARY KEY IDENTITY(1,1),
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    photo VARCHAR(255),
		schoolId INT NOT NULL,
	  createdAt DATETIME DEFAULT GETDATE(),
	  isDeleted BIT DEFAULT 0
    FOREIGN KEY (schoolId) REFERENCES tblSchools(schoolId)
);

CREATE TABLE tblClassStudents (
    classStudentId INT PRIMARY KEY IDENTITY(1,1),
    classId INT,
    studentId INT,
    schoolId INT,
	createdAt DATETIME DEFAULT GETDATE(),
	isDeleted BIT DEFAULT 0,
    FOREIGN KEY (classId) REFERENCES tblClasses(classId),
    FOREIGN KEY (studentId) REFERENCES tblStudents(studentId),
    FOREIGN KEY (schoolId) REFERENCES tblSchools(schoolId)
);
