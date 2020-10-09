const Knex = require('knex');

const tableNames = require('../../src/constants/tableNames');

function addDefaultColumns(table) {
  table.timestamps(false, true);
  table.datetime('deleted_at');
}

function createNameTable(knex, table_name) {
  return knex.schema.createTable(table_name, table => {
    table.increments().notNullable();
    table.text('name').notNullable().unique();
    addDefaultColumns(table);
  });
}

function references(table, tableName) {
  table
    .integer(`${tableName}_id`)
    .unsigned()
    .references('id')
    .inTable(tableName);
}

/**
 *  @param { Knex } knex
 */

exports.up = async knex => {
  await Promise.all([
    knex.schema.createTable(tableNames.user, table => {
      table.increments().notNullable();
      table.text('email', 254).notNullable().unique();
      table.text('name').notNullable();
      table.text('password', 127).notNullable();
      table.dateTime('last_login');
      addDefaultColumns(table);
    }),
    createNameTable(knex, tableNames.item_type),
    createNameTable(knex, tableNames.state),
    createNameTable(knex, tableNames.country),
    createNameTable(knex, tableNames.shape),

    knex.schema.createTable(tableNames.location, table => {
      table.increments().notNullable();
      table.text('name').notNullable().unique();
      table.text('description', 1000);
      table.text('image_url', 2000);
      addDefaultColumns(table);
    }),
  ]);

  await knex.schema.createTable(tableNames.address, table => {
    table.increments().notNullable();
    table.string('street_address_1', 50).notNullable();
    table.string('street_address_2', 50);
    table.string('city', 50).notNullable();
    table.string('zipcode', 15).notNullable();
    table.float('latitude').notNullable();
    table.float('longitude').notNullable();
    references(table, 'state');
    references(table, 'country');
  });
};

exports.down = async knex => {
  await Promise.all(
    [
      tableNames.address,
      tableNames.user,
      tableNames.item_type,
      tableNames.state,
      tableNames.country,
      tableNames.shape,
      tableNames.location,
    ].map(tableName => knex.schema.dropTable(tableName)),
  );
};
