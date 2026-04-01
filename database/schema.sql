
--  Notes Management Application — MySQL Schema
--  Run this script in MySQL Workbench to initialise the database

-- 1. Create and select the database
CREATE DATABASE IF NOT EXISTS notes_management_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE notes_management_db;


-- 2. Users table

CREATE TABLE IF NOT EXISTS users (
  id           INT          NOT NULL AUTO_INCREMENT,
  username     VARCHAR(50)  NOT NULL UNIQUE,
  email        VARCHAR(100) NOT NULL UNIQUE,
  password     VARCHAR(255) NOT NULL,           -- bcrypt hash stored here
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;


-- 3. Notes table

CREATE TABLE IF NOT EXISTS notes (
  id           INT           NOT NULL AUTO_INCREMENT,
  user_id      INT           NOT NULL,
  title        VARCHAR(150)  NOT NULL,
  content      TEXT          NOT NULL,
  created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
                                      ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_notes_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;


-- 4. Helpful indexes

CREATE INDEX idx_notes_user_id ON notes (user_id);
