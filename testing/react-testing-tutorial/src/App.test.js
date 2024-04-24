import { render, screen } from '@testing-library/react';
import App from './App';
import { TextEncoder, TextDecoder } from 'util';
Object.assign(global, { TextDecoder, TextEncoder });
const request = require('supertest');
const express = require('express');
const app = express();

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});


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

describe('POST /api/reviews', () => {
  it('should submit a new review', async () => {
    const response = await request(app)
      .post('/api/reviews')
      .send({
        textBody: 'Great game!',
        rating: 5,
        videoGameId: '123',
        displayName: 'Test User',
        videoGameName: 'Example Game'
      });

    expect(response.status).toBe(200);
    expect(response.body.newRating).toBeCloseTo(5); // Replace with the expected new rating
    expect(response.body.message).toBe('Review submitted successfully.');
  });

  it('should return an error if required data is missing', async () => {
    const response = await request(app)
      .post('/api/reviews')
      .send({
        textBody: 'Great game!',
        rating: 5,
        videoGameId: '123'
        // Missing displayName
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing required data in the request body.');
  });

  it('should return an error if user has already reviewed the game', async () => {
    // Assuming an existing review with the same videoGameId and displayName
    const existingReview = {
      videoGameId: '123',
      displayName: 'Test User'
    };

    // Insert the existing review into the database
    await db.collection('Reviews').insertOne(existingReview);

    const response = await request(app)
      .post('/api/reviews')
      .send({
        textBody: 'Great game!',
        rating: 5,
        videoGameId: '123',
        displayName: 'Test User',
        videoGameName: 'Example Game'
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('You have already reviewed this game.');
  });

});