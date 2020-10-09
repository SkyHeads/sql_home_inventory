const Knex = require('knex');

const tableNames = require('../../src/constants/tableNames');

function addDefaultColumns(table) {
  table.timestamps(false, true);
  table.datetime('deleted_at');
}

/**
 *  @param { Knex } knex
 */

exports.up = async knex => {
  await knex.schema.createTable(tableNames.user, table => {
    table.increments().notNullable();
    table.text('email', 254).notNullable().unique();
    table.text('name').notNullable();
    table.text('password', 127).notNullable();
    table.dateTime('last_login');
    addDefaultColumns(table);
  });

  await knex.schema.createTable(tableNames.item_type, table => {
    table.increments().notNullable();
    table.text('name').notNullable().unique();
    addDefaultColumns(table);
  });
};

exports.down = async knex => {
  await knex.schema.dropTable(tableNames.user);
};
