import db from '../database/index'

import convertHourToMinutes from '../utils/convertHourToMinutes'

interface ScheduleItem {
    week_day: number;
    from: string;
    to: string;
}

exports.index = async() => {
    const places = await db('places')
        .join('place_schedule', 'places.id', '=', 'place_schedule.place_id')
        .where('place_schedule.week_day', '=', 1)
        .select('places.*', 'place_schedule.from', 'place_schedule.to')
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