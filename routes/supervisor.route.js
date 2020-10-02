const { Router } = require('express');
const { SupervisorModel } = require('../models/supervisor.model');
const { verifyToken } = require('../helpers/auth.helper');
const { handleGetFilters } = require('../helpers/supervisor.helper');

const supervisorApi = Router();

supervisorApi
  .route('/')
  .post(async (req, res, next) => {
    const supervisor = req.body;
    try {
      const newSupervisor = SupervisorModel.create(supervisor);
      res.status(200).json(newSupervisor);
    } catch (err) {
      return next(err);
    }
  })
  .get(async (req, res, next) => {
    try {
      const consultants = await handleGetFilters(req.query, SupervisorModel);
      res.status(200).json(consultants);
    } catch (e) {
      next(e);
    }
  })
  .put(verifyToken(['admin', 'controller', 'self']), async (req, res, next) => {
    const { id } = req.query;
    const supervisor = req.body;
    if (id) {
      try {
        const updatedConsultant = await SupervisorModel.updateOne(
          { _id: id },
          { $set: supervisor }
        );
        res.status(200).json({
          message: 'supervisor.updated',
          info: updatedConsultant
        });
      } catch (err) {
        return next(err);
      }
    } else {
      return res.status(400).json({
        message: 'supervisor.missingId'
      });
    }
  });

module.exports = { supervisorApi };
