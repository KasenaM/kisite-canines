const ServiceBooking = require('../models/Booking');
const ServiceInstance = require('../models/ServiceInstances');
const Activity = require('../models/Activity');



const hasResidentialService = (bookings = []) => {
  return bookings.some(dog =>
    dog.services.some(
      s => s.service === "Training" || s.service === "Boarding"
    )
  );
};

const datesOverlap = (start1, end1, start2, end2) => {
  const s1 = new Date(start1);
  const e1 = new Date(end1);
  const s2 = new Date(start2);
  const e2 = new Date(end2);
  return s1 <= e2 && s2 <= e1;
};

const getServiceDateRange = (service) => {
  if (service.service === "Training" || service.service === "Boarding") {
    return {
      start: service.startDate,
      end: service.endDate || service.startDate
    };
  }
  if (service.service === "Grooming") {
    return {
      start: service.serviceDate,
      end: service.serviceDate
    };
  }
  return null;
};

/* ===========================
   CREATE BOOKING
=========================== */

exports.createBooking = async (req, res) => {
  try {
    const { phone, address, pickupPreference, bookings, totalAmount } = req.body;

    if (!bookings || bookings.length === 0) {
      return res.status(400).json({ message: "No services selected" });
    }

    if (hasResidentialService(bookings) && !pickupPreference) {
      return res.status(400).json({
        message: "Pickup/Drop-off preference required for Training or Boarding."
      });
    }

    for (const dog of bookings) {
      if (!dog.services || dog.services.length === 0) {
        return res.status(400).json({
          message: `Dog ${dog.dogName || dog.dogId} must have at least one service.`
        });
      }

      for (const service of dog.services) {

        if (!service.notes || service.notes.trim().length < 5) {
          return res.status(400).json({
            message: `Notes must be at least 5 characters for ${service.service}.`
          });
        }

        const newRange = getServiceDateRange(service);
        if (!newRange || !newRange.start) continue;

        const existingBookings = await ServiceBooking.find({
          "bookings.dogId": dog.dogId,
          status: { $ne: "Cancelled" }
        });

        for (const existing of existingBookings) {
          for (const exDog of existing.bookings) {
            if (String(exDog.dogId) !== String(dog.dogId)) continue;

            for (const exService of exDog.services) {
              if (exService.service !== service.service) continue;
              if (exService.serviceStatus === "Cancelled") continue;

              const existingRange = getServiceDateRange(exService);
              if (!existingRange || !existingRange.start) continue;

              if (datesOverlap(
                newRange.start, newRange.end,
                existingRange.start, existingRange.end
              )) {
                return res.status(400).json({
                  message: `${service.service} conflict detected.`
                });
              }
            }
          }
        }
      }
    }

    const newBooking = new ServiceBooking({
      user: req.user._id,
      phone,
      address,
      pickupPreference,
      bookings,
      totalAmount
    });

    const savedBooking = await newBooking.save();

    const instances = [];

    savedBooking.bookings.forEach(dogItem => {
      dogItem.services.forEach(service => {
        instances.push({
          bookingId: savedBooking._id,
          userId: savedBooking.user,
          dogId: dogItem.dogId,
          serviceName: service.service,
          packageName: service.packageName || service.package || "Standard",
          price: service.price,
          serviceStatus: "Scheduled",
          progress: "Not Done",
          serviceDate: service.serviceDate || null,
          startDate: service.startDate || null,
          endDate: service.endDate || null,
          locationType: service.locationType || null,
          pickupPreference: pickupPreference || null,
          notes: service.notes || ""
        });
      });
    });

    await ServiceInstance.insertMany(instances);

    await Activity.create({
      userId: req.user._id,
      actionType: "Booking Created",
      description: `New booking created. Total ₦${totalAmount}`,
      relatedId: savedBooking._id,
      onModel: "ServiceBooking"
    });

    res.status(201).json(savedBooking);

  } catch (error) {
    console.error("Create Booking Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/* ===========================
   GET USER BOOKINGS
=========================== */

exports.getMyBookings = async (req, res) => {
  try {
    const userBookings = await ServiceBooking.find({ user: req.user._id })
      .populate("bookings.dogId")
      .sort({ createdAt: -1 });

    res.json(userBookings);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* ===========================
   CANCEL BOOKING
=========================== */

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await ServiceBooking.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    booking.status = "Cancelled";
    booking.totalAmount = 0;

    booking.bookings.forEach(dog => {
      dog.services.forEach(service => {
        service.serviceStatus = "Cancelled";
        service.progress = "Terminated";
      });
    });

    await booking.save();

    await ServiceInstance.updateMany(
      { bookingId: booking._id },
      {
        serviceStatus: "Cancelled",
        progress: "Terminated",
        cancelledAt: new Date()
      }
    );

    await Activity.create({
      userId: req.user._id,
      actionType: "Booking Cancelled",
      description: "Booking cancelled",
      relatedId: booking._id,
      onModel: "ServiceBooking"
    });

    res.json({ message: "Booking cancelled successfully", booking });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/* ===========================
   RESCHEDULE BOOKING
=========================== */

exports.rescheduleBooking = async (req, res) => {
  try {
    const { updatedServices } = req.body;

    const booking = await ServiceBooking.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    for (const update of updatedServices) {

      const dog = booking.bookings.find(d =>
        String(d._id) === String(update.dogId) ||
        String(d.dogId) === String(update.dogId)
      );

      if (!dog || !dog.services[update.serviceIndex]) continue;

      const service = dog.services[update.serviceIndex];

      if (update.startDate) service.startDate = update.startDate;
      if (update.endDate) service.endDate = update.endDate;
      if (update.serviceDate) service.serviceDate = update.serviceDate;

      service.serviceStatus = "Rescheduled";
      service.progress = "Awaiting Arrival";

      await ServiceInstance.updateOne(
        {
          bookingId: booking._id,
          dogId: dog.dogId,
          serviceName: service.service
        },
        {
          startDate: service.startDate,
          endDate: service.endDate,
          serviceDate: service.serviceDate,
          serviceStatus: "Rescheduled",
          progress: "Awaiting Arrival"
        }
      );
    }

    await booking.save();

    await Activity.create({
      userId: req.user._id,
      actionType: "Booking Rescheduled",
      description: "Booking rescheduled",
      relatedId: booking._id,
      onModel: "ServiceBooking"
    });

    res.json({ message: "Booking rescheduled successfully", booking });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/* ===========================
   CANCEL INDIVIDUAL SERVICE
=========================== */

exports.cancelIndividualService = async (req, res) => {
  try {
    const { bookingId, dogItemId, serviceIndex } = req.params;
    const sIdx = parseInt(serviceIndex, 10);

    const booking = await ServiceBooking.findOne({
      _id: bookingId,
      user: req.user._id
    });

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    const dog = booking.bookings.find(d =>
      String(d._id) === String(dogItemId) ||
      String(d.dogId) === String(dogItemId)
    );

    if (!dog || !dog.services[sIdx])
      return res.status(404).json({ message: "Service not found" });

    const service = dog.services[sIdx];

    service.serviceStatus = "Cancelled";
    service.progress = "Terminated";

    await ServiceInstance.updateOne(
      {
        bookingId: booking._id,
        dogId: dog.dogId,
        serviceName: service.service
      },
      {
        serviceStatus: "Cancelled",
        progress: "Terminated",
        cancelledAt: new Date()
      }
    );

    await booking.save();

    await Activity.create({
      userId: req.user._id,
      actionType: "Service Cancelled",
      description: `${service.service} cancelled`,
      relatedId: booking._id,
      onModel: "ServiceBooking"
    });

    res.json({ message: "Service cancelled successfully", booking });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/* ===========================
   RESCHEDULE INDIVIDUAL SERVICE
=========================== */

exports.rescheduleIndividualService = async (req, res) => {
  try {
    const { bookingId, dogId, serviceIndex } = req.params;
    const { startDate, endDate, serviceDate } = req.body;

    const booking = await ServiceBooking.findOne({
      _id: bookingId,
      user: req.user._id
    });

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    const dog = booking.bookings.find(d =>
      String(d._id) === String(dogId) ||
      String(d.dogId) === String(dogId)
    );

    if (!dog || !dog.services[serviceIndex])
      return res.status(404).json({ message: "Service not found" });

    const service = dog.services[serviceIndex];

    if (startDate) service.startDate = startDate;
    if (endDate) service.endDate = endDate;
    if (serviceDate) service.serviceDate = serviceDate;

    service.serviceStatus = "Rescheduled";
    service.progress = "Awaiting Arrival";

    await ServiceInstance.updateOne(
      {
        bookingId: booking._id,
        dogId: dog.dogId,
        serviceName: service.service
      },
      {
        startDate,
        endDate,
        serviceDate,
        serviceStatus: "Rescheduled",
        progress: "Awaiting Arrival"
      }
    );

    await booking.save();

    await Activity.create({
      userId: req.user._id,
      actionType: "Service Rescheduled",
      description: `${service.service} rescheduled`,
      relatedId: booking._id,
      onModel: "ServiceBooking"
    });

    res.json({ message: "Service rescheduled successfully", booking });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
