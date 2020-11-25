"use strict";

const Course = require("../models/course");
const httpStatus = require('http-status-codes');
const User = require("../models/user");

module.exports = {
  index: (req, res, next) => {
    Course.find({})
      .then(courses => {
        res.locals.courses = courses;
        next();
      })
      .catch(error => {
        console.log(`Error fetching courses: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    if (req.query.format === "json") {
      res.json(res.locals.courses);
    } else {
      res.render("courses/index");
    }
  },
  new: (req, res) => {
    res.render("courses/new");
  },

  create: (req, res, next) => {
    let courseParams = {
      title: req.body.title,
      description: req.body.description,
      items: [req.body.items.split(",")],
      zipCode: req.body.zipCode
    };
    Course.create(courseParams)
      .then(course => {
        res.locals.redirect = "/courses";
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.log(`Error saving course: ${error.message}`);
        next(error);
      });
  },

  show: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId)
      .then(course => {
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },

  showView: (req, res) => {
    res.render("courses/show");
  },

  edit: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId)
      .then(course => {
        res.render("courses/edit", {
          course: course
        });
      })
      .catch(error => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    let courseId = req.params.id,
      courseParams = {
        title: req.body.title,
        description: req.body.description,
        items: [req.body.items.split(",")],
        zipCode: req.body.zipCode
      };

    Course.findByIdAndUpdate(courseId, {
      $set: courseParams
    })
      .then(course => {
        res.locals.redirect = `/courses/${courseId}`;
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.log(`Error updating course by ID: ${error.message}`);
        next(error);
      });
  },

  delete: (req, res, next) => {
    let courseId = req.params.id;
    Course.findByIdAndRemove(courseId)
      .then(() => {
        res.locals.redirect = "/courses";
        next();
      })
      .catch(error => {
        console.log(`Error deleting course by ID: ${error.message}`);
        next();
      });
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  },

  respondJSON: (req, res) => {
    res.json({
      status: httpStatus.OK,
      data: res.locals
    });
  },

  errorJSON: (error, req, res, next) => {
    let errorObject;

    if (error) {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      }
    } else {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Unknown Error"
      }
    } 
    res.json(errorObject);
  },

  /**
   * Method for adding (joining) a user to a course
   */
  join: (req, res, next) => { 
    let courseId = req.params.id; // get the course id and current user from the request
    let currentUser = req.user;

    if (currentUser) { // Checks if user is logged in
      User.findByIdAndUpdate(currentUser, { // Update the user's courses field to contain the targeted courses
        $addToSet: {
          courses: courseId 
        }
      }).then(() => {
        res.locals.success = true; // Respond with a JSON object with a success indicator
        next();
      }).catch(error => {
        next(error); // Respond with a JSON object with an error indicator
      });
    } else {
      next(new Error("User must log in.")); // Pass an error through to the next middleware function
    }
  },

  /**
   * This function will check if a user if already logged in. If not, it will next() and show all courses.
   * If the user is logged in, it will check if the course id matches any in the user's array of courses.
   * If it finds a match, it will respond 
   */
  filterUserCourses: (req, res, next) => {
    let currentUser = res.locals.currentUser;
    if (currentUser) {
      let mappedCourses = res.locals.courses.map(course => { // Maps all courses
        let userJoined = currentUser.courses.some(userCourse => { // array.some() returns "true" if course._id matches a user's already joined courseId
          return userCourse.equals(course._id);
        });
        return Object.assign(course.toObject(), { joined: userJoined }); // Adds a "joined" key:value to te courses object
      });
      res.locals.courses = mappedCourses; // Returns new list of courses, modified to explain if joined: true/false
      next();
    } else {
      next();
    }
  }
};
