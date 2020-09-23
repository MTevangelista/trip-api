import { Router } from 'express';

import PlacesController from '@controllers/PlaceController';

const routes = Router();

routes.get('/api/place', PlacesController.index);
routes.get('/api/place/filter', PlacesController.getAllByFilters);
routes.post('/api/place', PlacesController.create);

export default routes;
