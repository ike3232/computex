-- Create the database
CREATE DATABASE computex;

-- Create the user and set the password
CREATE USER admin WITH ENCRYPTED PASSWORD '12345';

-- Grant all privileges to the user for the database
GRANT ALL PRIVILEGES ON DATABASE computex TO admin;
