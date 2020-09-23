import db from '../database/index'

import convertHourToMinutes from '../utils/convertHourToMinutes'

interface ScheduleItem {
    week_day: number;
    from: string;
    to: string;
}

interface FiltersItem {
    uf: string;
    city: string;
    week_day: string;
    place: string;
    time: string;
}

exports.index = async() => {
    const places = await db('places')
        .join('place_schedule', 'places.id', '=', 'place_schedule.place_id')
        .where('place_schedule.week_day', '=', 1)
        .select('places.*', 'place_schedule.from', 'place_schedule.to')
    return places
}

exports.getAllByFilters = async(filters: FiltersItem) => {
    const uf = filters.uf
    const city = filters.city
    const week_day = filters.week_day 
    const place = filters.place
    const time = filters.time

    const timeInMinutes = convertHourToMinutes(time)

    const places = await db('places')
        .whereExists(function () {
            this.select('place_schedule.*')
                .from('place_schedule')
                .whereRaw('`place_schedule`.`place_id` = `places`.`id`')
                .whereRaw('`place_schedule`.`week_day` = ??', [Number(week_day)])
                .whereRaw('`place_schedule`.`from` <= ??', [timeInMinutes])
                .whereRaw('`place_schedule`.`to` > ??', [timeInMinutes])
        })
        .where('places.place', '=', place)
        .where('places.uf', '=', uf)
        .where('places.city', '=', city)
        .where('place_schedule.week_day', '=', week_day)
        .join('place_schedule', 'places.id', '=', 'place_schedule.place_id')
        .select(['places.*', 'place_schedule.from', 'place_schedule.to'])
    
    return places
}

exports.create = async(name: string, image_url: string, place: string, address: string, whatsapp: string, bio: string, uf: string, city: string, schedule: Array<ScheduleItem>) => {
    const trx = await db.transaction()

    try {
        const insertedPlacesIds = await trx('places').insert({
            name,
            image_url,
            place,
            address,
            whatsapp,
            bio,
            uf,
            city
        })

        const place_id = insertedPlacesIds[0]

        const placeSchedule = schedule.map((scheduleItem: ScheduleItem) => {
            return {
                place_id,
                week_day: scheduleItem.week_day,
                from: convertHourToMinutes(scheduleItem.from),
                to: convertHourToMinutes(scheduleItem.to)
            }
        })

        await trx('place_schedule').insert(placeSchedule)

        await trx.commit()
    } catch (e) {
        await trx.rollback()
    }
}