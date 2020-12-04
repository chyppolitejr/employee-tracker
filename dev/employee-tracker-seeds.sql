drop database if exists employees_db;

create database employees_db;

use employees_db;

create table tblEmployees
(
id integer auto_increment primary key,
first_name varchar(50) not null,
last_name  varchar(50) not null,
role_id int not null default(-1),
manager_id int not null default(-1)
);

create table tblRole
(
id integer auto_increment primary key,
title varchar(50) not null,
salary decimal not null,
department_id int not null
);

create table tblDepartment 
(
id int auto_increment primary key,
name varchar(50) not null
);

CREATE VIEW `employees_db`.`v_view_employees` AS 
select `E`.`id` AS `employeeid`,`E`.`first_name` AS `first_name`,`E`.`last_name` AS `last_name`,concat(`E`.`last_name`,',',`E`.`first_name`) AS `employeename`,`R`.`title` AS `title`,`R`.`salary` AS `salary`,`D`.`id` AS `department_id`,`D`.`name` AS `department`,concat(`M`.`last_name`,',',`M`.`first_name`) AS `manager`,`E`.`manager_id` AS `manager_id` from (((`employees_db`.`tblemployees` `E` left join `employees_db`.`tblemployees` `M` on((`E`.`manager_id` = `M`.`id`))) left join `employees_db`.`tblrole` `R` on((`E`.`role_id` = `R`.`id`))) left join `employees_db`.`tbldepartment` `D` on((`R`.`department_id` = `D`.`id`)));

/* test data */
insert into tbldepartment (name)
values ('Workforce Management'), ('Business Management'),('Security'),('Training'),('Quality Assurance'),('Human Resources'),('Operations'),
('Desktop Support'),('Corporate');

/* role test data */
insert into tblRole (title, salary, department_id)
values('Realtime Analyst',30000.00,1), ('Scheduler',30000.00,1), ('Workforce Manager',45000.00,1);

/* BMT */
insert into tblRole (title,salary,department_id)
values('Senior Business Application Developer',90000.00,2),
('Reporting Analyst',40000.00,2),
('Business Application Manager',75000.00,2);

/*Training*/
insert into tblRole (title,salary,department_id)
values ('Trainer',35000.00,4),('Training Assistant',30000.00,4),('Training Manager',75000.00,4);

 /*Quality*/
insert into tblRole (title,salary,department_id)
values ('Quality Assurance Specialist',35000.00,5),('Quality Supervisor',30000.00,5),('Quality Manager',65000.00,5);

 /*Human Resources*/
insert into tblRole (title,salary,department_id)
values ('Human Resources Manager',85000.00,6),('HR Generalist',45000.00,6),('Recruiter',65000.00,5);

 /*Human Resources*/
insert into tblRole (title,salary,department_id)
values ('Customer Service Supervisor',45000.00,6),('Customer Service Associate',35000.00,6),('Customer Service Manager',65000.00,5);

 insert into tblRole (title,salary,department_id)
values ('Chief Exective Officer',550000.00,9), ('Executive Assistant',75000.00,9);

/* Employees */
/* CEO */
insert into tblEmployees (first_name, last_name,role_id)
values('Jane','Smith',19);

/* admin assistant */
insert into tblEmployees (first_name, last_name,role_id,manager_id)
values('Doris','Day',20,1);

insert into tblEmployees (first_name, last_name,role_id,manager_id)
values('Donald','Duckenstein',3,1);


insert into tblEmployees (first_name, last_name,role_id,manager_id)
values('Daffy','Duckenstein',6,1);

insert into tblEmployees (first_name, last_name,role_id,manager_id)
values('Angela','Jolly',13,1);

insert into tblEmployees (first_name, last_name,role_id,manager_id)
values('Jean-Claude','Damme-Van',12,1);

insert into tblEmployees (first_name, last_name,role_id,manager_id)
values('Rocky','Stallone',18,1);


insert into tblEmployees (first_name, last_name,role_id,manager_id)
values('Herman','Munster',2,3);

insert into tblEmployees (first_name, last_name,role_id,manager_id)
values('Luke','Lawson',1,3);

insert into tblEmployees (first_name, last_name,role_id,manager_id)
values('Richard','Redmon',5,4);

insert into tblEmployees (first_name, last_name,role_id,manager_id)
values('Sally','Smith',4,4);





select * from tbldepartment;
select * from tblrole;
select * from tblEmployees;
select * from v_view_employees;
