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


router.use(protect);


router.post('/', createBooking);


router.get('/', getMyBookings);


router.patch('/:id/cancel', cancelBooking);


router.put('/:id/reschedule', rescheduleBooking);


router.patch(
  "/service/:bookingId/:dogItemId/:serviceIndex/cancel",
  cancelIndividualService
);



router.patch('/service/:bookingId/:dogId/:serviceIndex/reschedule', rescheduleIndividualService);

module.exports = router;