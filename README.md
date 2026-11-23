# After School Lessons - Back-End

Express.js REST API with MongoDB Atlas, hosted on render.com.

Live: https://m00969005-after-school.onrender.com/lessons

## Routes
- GET /lessons - all lessons
- GET /lessons/:_id - one lesson
- POST /orders - save a new order
- PUT /lessons/:_id - update a lesson (e.g. spaces)
- GET /orders - all orders
- GET /images/<file> - lesson images

## Middleware
- Logger (morgan + console.log)
- Static files for images, with "Image not found" error