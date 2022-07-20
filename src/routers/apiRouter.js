const express = require('express');
const api = require('../controllers/api');

const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');
const isFreeSlotsSynchronized = require('../middlewares/isFreeSlotsSynchronized');

const apiRouter = new express.Router();

apiRouter.post('/posts', isAdmin, api.addPost);
apiRouter.delete('/appointments/:id'/*, isAdmin*/, api.deleteAppointment);
apiRouter.post('/appointments', isAuth, api.addAppointment);
apiRouter.get('/appointments', isAuth, api.getFreeSlots);

apiRouter.get('/freeSlots', isFreeSlotsSynchronized, (req, res) => {
    req.session.isFreeSlotsSynchronized = false;
    res.render('freeSlots', { freeSlots: req.session.freeSlots });
});

module.exports = apiRouter;
