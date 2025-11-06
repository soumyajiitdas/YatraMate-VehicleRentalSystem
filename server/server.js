const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: './.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB)
    .then(() => console.log('✅ MongoDB connection successful!'));

const port = process.env.PORT || 5600;
const server = app.listen(port, () => {
    console.log(`🎉 YatraMate server is running on http://localhost:${port}`);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});