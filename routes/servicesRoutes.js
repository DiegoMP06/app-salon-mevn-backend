import {getServices, createService, getService, updateService, deleteService} from '../controllers/ServiceController.js';
import express from "express";

const router = express.Router();

router.route('/')
    .get(getServices)
    .post(createService);

router.route('/:id')
    .get(getService)
    .put(updateService)
    .delete(deleteService);

export default router; 