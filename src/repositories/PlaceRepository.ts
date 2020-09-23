import convertHourToMinutes from '@utils/convertHourToMinutes';

import db from '@database/index.ts';

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

class PlaceRepository {
  public constructor() {}

  public async index(): Promise<object[]> {
    const places = await db('places')
      .join('place_schedule', 'places.id', '=', 'place_schedule.place_id')
      .where('place_schedule.week_day', '=', 1)
      .select('places.*', 'place_schedule.from', 'place_schedule.to');
    return places;
  }

  public async getAllByFilters({
    uf, city, week_day, place, time,
  }): Promise<object[]> {
    const timeInMinutes = convertHourToMinutes(time);

    const places = await db('places')
      .whereExists(function () {
        this.select('place_schedule.*')
          .from('place_schedule')
          .whereRaw('`place_schedule`.`place_id` = `places`.`id`')
          .whereRaw('`place_schedule`.`week_day` = ??', [Number(week_day)])
          .whereRaw('`place_schedule`.`from` <= ??', [timeInMinutes])
          .whereRaw('`place_schedule`.`to` > ??', [timeInMinutes]);
      })
      .where('places.place', '=', place)
      .where('places.uf', '=', uf)
      .where('places.city', '=', city)
      .where('place_schedule.week_day', '=', week_day)
      .join('place_schedule', 'places.id', '=', 'place_schedule.place_id')
      .select(['places.*', 'place_schedule.from', 'place_schedule.to']);
    return places;
  }

  public async create({
    name, image_url, place, address, whatsapp, bio, uf, city, schedule,
  }): Promise<void> {
    const trx = await db.transaction();

    try {
      const insertedPlacesIds = await trx('places').insert({
        name,
        image_url,
        place,
        address,
        whatsapp,
        bio,
        uf,
        city,
      });

      const place_id = insertedPlacesIds[0];

      const placeSchedule = schedule.map((scheduleItem: ScheduleItem) => ({
        place_id,
        week_day: scheduleItem.week_day,
        from: convertHourToMinutes(scheduleItem.from),
        to: convertHourToMinutes(scheduleItem.to),
      }));

      await trx('place_schedule').insert(placeSchedule);

      await trx.commit();
    } catch (e) {
      await trx.rollback();
    }
  }
}

export default new PlaceRepository();
