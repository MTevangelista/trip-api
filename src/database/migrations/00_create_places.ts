import Knex from 'knex'

export async function up(knex: Knex) {
    return knex.schema.createTable('places', table => {
        table.increments('id').primary()
        table.string('name').notNullable()
        table.string('image_url').notNullable()
        table.string('place').notNullable()
        table.string('address').notNullable()
        table.string('whatsapp').notNullable()
        table.string('bio').notNullable()
        table.string('uf', 2).notNullable()
        table.string('city').notNullable()
    })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('places')
}