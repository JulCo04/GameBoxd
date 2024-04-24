import { TextEncoder, TextDecoder } from 'util';
Object.assign(global, { TextDecoder, TextEncoder });
const request = require('supertest');
const express = require('express');
const app = express();

describe('POST /api/register', () => {
    it('should register a new user', async () => {
        const response = await request(app)
            .post('/api/register')
            .send({
                email: 'test@example.com',
                password: 'password',
                displayName: 'Test User'
            });

        expect(response.status).toBe(200);
        expect(response.body.error).toBe('');
    });
});

describe('POST /api/login', () => {
    it('should login a user with valid credentials', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({
                email: 'omoryrowe@gmail.com',
                password: 'password'
            });

        expect(response.status).toBe(200);
        expect(response.body.error).toBe('');
        expect(response.body.id).toBe(1); // Replace with the expected user ID
        expect(response.body.displayName).toBe('Test User'); // Replace with the expected display name
        expect(response.body.email).toBe('omoryrowe@gmail.com'); // Replace with the expected email
        expect(response.body.dateCreated).toBe('2022-01-01'); // Replace with the expected date created

    });
});

