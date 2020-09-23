import { Request, Response } from 'express'

const repository = require('../repositories/placesRepository')

export default class PlacesController {
    async index(req: Request, res: Response) {
        try {
            let index = await repository.index()
            return res.json(index)
        } catch (e) {
            return res.status(400).json({
                error: 'Unexpected error while listing all places'
            })
        }
    }

    async getAllByFilters(req: Request, res: Response) {
        const filters = req.query

        if (!filters.uf || !filters.city || !filters.week_day || !filters.place || !filters.time) {
            return res.status(400).json({
                error: 'Missing filters to search places'
            })
        }

        try {
            let places = await repository.getAllByFilters(filters)
            return res.json(places)
        } catch (e) {
            return res.status(400).json({
                error: 'Unexpected error while listing all places'
            })
        }
    }

    async create(req: Request, res: Response) {
        const { name, image_url, place, address, whatsapp, bio, uf, city, schedule } = req.body

        try {
            await repository.create(
                name,
                image_url,
                place,
                address,
                whatsapp,
                bio,
                uf,
                city,
                schedule
            )
            return res.status(201).send()
        } catch (e) {
            return res.status(400).json({
                error: 'Unexpected error while creating a new place'
            })
        }
    }
}
