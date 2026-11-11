CREATE DATABASE IF NOT EXISTS CRM;
USE CRM;

DROP TABLE IF EXISTS Clients;
CREATE TABLE Clients (
    event_offset INT AUTO_INCREMENT UNIQUE KEY,
    client_id int,
    event_number int,
    name varchar(255),
    age int,
    user_to_blame varchar(255),
    event_type ENUM('CREATE','UPDATE','DELETE'),
    happened_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (client_id, envent_number)
);

DROP TABLE IF EXISTS view_metadata;
CREATE TABLE IF NOT EXISTS view_metadata (
    table_name varchar(256) PRIMARY KEY,
    last_processed_offset int DEFAULT 0
);
