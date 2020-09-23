import { Router } from 'express';

import PlacesController from '@controllers/PlacesController'

const routes = Router();
const placesController = new PlacesController()

routes.get('/api/place', placesController.index)
routes.get('/api/place/filter', placesController.getAllByFilters)
routes.post('/api/place', placesController.create)

export default routes;