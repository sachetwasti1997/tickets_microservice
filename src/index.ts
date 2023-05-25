import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

const app = express();

const start = async () => {
  try {
    await mongoose.connect('mongodb://tickets-mongo-srv:27017/tickets');
    console.log('Connected to mongodb');
  } catch (err) {
    console.log(err);
  }
  app.listen(3000, () => {
    console.log('Starting on port 3000!!!');
  });
};

start();
