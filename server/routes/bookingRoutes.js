const express = require('express');
const router = express.Router();
const { 
    createBooking, 
    getMyBookings,
    cancelBooking,
    rescheduleBooking,
    cancelIndividualService,
    rescheduleIndividualService
} = require('../controllers/bookingController');
const { protect } = require('../middleware/bookingMiddleware');

// All routes here are protected by the booking middleware
router.use(protect);

/* ===========================
   STANDARD ROUTES
=========================== */

// POST /api/service-bookings - Create a new booking
router.post('/', createBooking);

// GET /api/service-bookings - Get all bookings for the logged-in user
router.get('/', getMyBookings);

/* ===========================
   BOOKING LEVEL LIFECYCLE
=========================== */

// PATCH /api/service-bookings/:id/cancel - Cancel entire booking
router.patch('/:id/cancel', cancelBooking);

// PUT /api/service-bookings/:id/reschedule - Reschedule entire booking
router.put('/:id/reschedule', rescheduleBooking);

/* ===========================
   SERVICE LEVEL LIFECYCLE
=========================== */

// PATCH /api/service-bookings/service/:bookingId/:dogId/:serviceIndex/cancel
router.patch(
  "/service/:bookingId/:dogItemId/:serviceIndex/cancel",
  cancelIndividualService
);


// PATCH /api/service-bookings/service/:bookingId/:dogId/:serviceIndex/reschedule
router.patch('/service/:bookingId/:dogId/:serviceIndex/reschedule', rescheduleIndividualService);

module.exports = router;