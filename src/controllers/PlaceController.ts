import { Request, Response } from 'express';

import PlaceRepository from '@repositories/PlaceRepository';

class PlacesController {
  public constructor() {}

  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const places = await PlaceRepository.index();
      return res.json(places);
    } catch (err) {
      return res.status(400).json({
        message: 'Unexpected error while listing places',
        error: err,
      });
    }
  }

  public async getAllByFilters(req: Request, res: Response): Promise<Response> {
    const {
      uf, city, week_day, place, time,
    } = req.query;

    if (!uf || !city || !week_day || !place || !time) {
      return res.status(400).json({
        error: 'Missing filters to search places',
      });
    }

    const filters = {
      uf, city, week_day, place, time,
    };

    try {
      const filteredPlaces = await PlaceRepository.getAllByFilters(filters);
      return res.json(filteredPlaces);
    } catch (err) {
      return res.status(400).json({
        message: 'Unexpected error while listing places by filters',
        error: err,
      });
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const {
      name, image_url, place, address, whatsapp, bio, uf, city, schedule,
    } = req.body;

    const newPlace = {
      name,
      image_url,
      place,
      address,
      whatsapp,
      bio,
      uf,
      city,
      schedule,
    };

    try {
      await PlaceRepository.create(newPlace);
      return res.status(201).json({ message: 'Place created with success' });
    } catch (err) {
      return res.status(400).json({
        message: 'Unexpected error while creating a place',
        error: err,
      });
    }
  }
}

export default new PlacesController();
