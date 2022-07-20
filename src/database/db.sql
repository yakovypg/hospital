/*
===========================
    INITIALIZE
===========================
*/

CREATE DATABASE hospital_db;

/*
===========================
    CREATE TABLE
===========================
*/

CREATE TABLE Patient (
    Id SERIAL PRIMARY KEY,
    FirstName VARCHAR(20) NOT NULL,
    LastName VARCHAR(20) NOT NULL,
    Passport VARCHAR(11) UNIQUE NOT NULL,

    CHECK (FirstName != '' AND LastName != '' AND Passport != '')
);

CREATE TABLE Doctor (
    Id SERIAL PRIMARY KEY,
    FirstName VARCHAR(20) NOT NULL,
    LastName VARCHAR(20) NOT NULL,
    Specialty VARCHAR(40) NOT NULL,

    CHECK (FirstName != '' AND LastName != '' AND Specialty != '')
);

CREATE TABLE Post (
    Id SERIAL PRIMARY KEY,
    DoctorId INTEGER NOT NULL,
    Office INTEGER NOT NULL,
    AppointmentTime Time,

    FOREIGN KEY (DoctorId) REFERENCES Doctor (Id) ON DELETE CASCADE
);

CREATE TABLE Appointment (
    Id SERIAL PRIMARY KEY,
    PatientId INTEGER NOT NULL,
    PostId INTEGER UNIQUE NOT NULL,

    FOREIGN KEY (PatientId) REFERENCES Patient (Id) ON DELETE CASCADE,
    FOREIGN KEY (PostId) REFERENCES Post (Id) ON DELETE CASCADE
);

/*
===========================
    VIEWS
===========================
*/

CREATE VIEW v_posts_d AS
    SELECT * FROM Post ORDER BY DoctorId;

CREATE VIEW v_posts_t AS
    SELECT * FROM Post ORDER BY AppointmentTime;

CREATE VIEW v_appointments AS
    SELECT * FROM Appointment ORDER BY PatientId;

CREATE VIEW v_timetable AS
    SELECT Patient.FirstName AS p_FirstName, Patient.LastName AS p_LastName,
           Doctor.FirstName AS d_FirstName, Doctor.LastName AS d_LastName,
           Post.Office, Post.AppointmentTime
    FROM Appointment, Post, Doctor, Patient
        WHERE Appointment.PostId = Post.Id AND
              Appointment.PatientId = Patient.Id AND
              Post.DoctorId = Doctor.Id
        ORDER BY Post.AppointmentTime;

/*
===========================
    FUNCTIONS
===========================
*/

CREATE OR REPLACE FUNCTION get_patient(_firstName VARCHAR(20), _lastName VARCHAR(20), _passport VARCHAR(11))
RETURNS INTEGER AS
$$
BEGIN
    IF (_firstName, _lastName, _passport) IN (SELECT FirstName, LastName, Passport FROM Patient) THEN
        RETURN (SELECT Id FROM Patient WHERE Patient.Passport = _passport);
    END IF;

    INSERT INTO Patient (FirstName, LastName, Passport) VALUES (_firstName, _lastName, _passport);
    RETURN (SELECT MAX(Id) FROM Patient);
END;
$$
LANGUAGE 'plpgsql';

/*
===========================
    TRIGGERS
===========================
*/

CREATE OR REPLACE FUNCTION verify_patient()
RETURNS TRIGGER AS
$$
BEGIN
    IF NEW.Passport IN (SELECT Passport FROM Patient) THEN
        RAISE EXCEPTION 'The passport does not belong to you';
    END IF;

    RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE TRIGGER verify_patient_trigger BEFORE INSERT OR UPDATE ON Patient
    FOR EACH ROW EXECUTE FUNCTION verify_patient();

CREATE OR REPLACE FUNCTION verify_post()
RETURNS TRIGGER AS
$$
BEGIN
    IF NEW.DoctorId NOT IN (SELECT Id FROM Doctor) THEN
        RAISE EXCEPTION 'There is no doctor with the specified ID';
    END IF;
    
    IF (NEW.Office, NEW.AppointmentTime) IN (SELECT Office, AppointmentTime FROM Post) THEN
        RAISE EXCEPTION 'The office is already in use at this time';
    END IF;
    
    IF NEW.AppointmentTime IN (SELECT AppointmentTime FROM Post WHERE DoctorId = NEW.DoctorId) THEN
        RAISE EXCEPTION 'The doctor is already making an appointment at this time';
    END IF;

    RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE TRIGGER verify_post_trigger BEFORE INSERT OR UPDATE ON Post
    FOR EACH ROW EXECUTE FUNCTION verify_post();

CREATE OR REPLACE FUNCTION verify_appointment()
RETURNS TRIGGER AS
$$
BEGIN
    IF NEW.PatientId NOT IN (SELECT Id FROM Patient) THEN
        RAISE EXCEPTION 'There is no patient with the specified ID';
    END IF;

    IF NEW.PostId NOT IN (SELECT Id FROM Post) THEN
        RAISE EXCEPTION 'There is no post with the specified ID';
    END IF;

    IF (NEW.PostId IN (SELECT PostId FROM Appointment)) THEN
        RAISE EXCEPTION 'The slot is occupied by another patient';
    END IF;
    
    IF (SELECT AppointmentTime FROM Post WHERE Id = NEW.PostId) IN (
            SELECT Post.AppointmentTime FROM Appointment, Post
                WHERE Appointment.PostId = Post.Id AND Appointment.PatientId = NEW.PatientId
        )
    THEN
        RAISE EXCEPTION 'The patient is already booked into another slot at this time';
    END IF;

    RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE TRIGGER verify_appointment_trigger BEFORE INSERT OR UPDATE ON Appointment
    FOR EACH ROW EXECUTE FUNCTION verify_appointment();

/*
===========================
    INSERT
===========================
*/

INSERT INTO Doctor (FirstName, LastName, Specialty) VALUES ('Ivan', 'Ivanov', 'Therapist');
INSERT INTO Doctor (FirstName, LastName, Specialty) VALUES ('Petr', 'Petrov', 'Therapist');
INSERT INTO Doctor (FirstName, LastName, Specialty) VALUES ('Kuzma', 'Kuzmin', 'Surgeon');
INSERT INTO Doctor (FirstName, LastName, Specialty) VALUES ('Boris', 'Borisovich', 'Cardiologist');
