
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {'username': 'noel', password : 'password'},
        {'username': 'joe', password: 'password'},
        {'username': 'deku', password : 'password'},
        {'username': 'jeff', password: 'password'}

      ]);
    });
};
